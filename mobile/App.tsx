import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// Initialize Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';
const apiBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://modernhealth.pro';
const mobileApiKey = process.env.EXPO_PUBLIC_MOBILE_API_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: {
          getItem: (key) => SecureStore.getItemAsync(key),
          setItem: (key, value) => SecureStore.setItemAsync(key, value),
          removeItem: (key) => SecureStore.deleteItemAsync(key),
        },
      },
    })
  : null;

type ActionResult = {
  type: 'invoice_created' | 'orders_list' | 'inventory_list' | 'customer_created' | 'customer_list' | 'error' | 'success' | 'info';
  title: string;
  message: string;
  data?: any;
};

export default function App() {
  const [mode, setMode] = useState<'idle' | 'listening' | 'processing' | 'result'>('idle');
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<ActionResult | null>(null);
  const [textCommand, setTextCommand] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordingStartTime = useRef<number>(0);

  useEffect(() => {
    Audio.requestPermissionsAsync();
  }, []);

  // Pulse animation when listening
  useEffect(() => {
    if (mode === 'listening') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [mode]);

  const startListening = async () => {
    try {
      // Clean up any existing recording first
      if (recordingRef.current) {
        try {
          await recordingRef.current.stopAndUnloadAsync();
        } catch (e) {
          // Ignore cleanup errors
        }
        recordingRef.current = null;
      }

      // Haptic feedback to indicate recording started
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      recordingRef.current = recording;
      recordingStartTime.current = Date.now();
      setMode('listening');
      setTranscript('');
      setResult(null);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording:', err);
      setMode('idle');
    }
  };

  const stopListening = async () => {
    if (!recordingRef.current) return;
    
    const recordingDuration = Date.now() - recordingStartTime.current;
    console.log('Recording duration:', recordingDuration, 'ms');

    // Minimum 500ms recording to avoid "too short" errors
    if (recordingDuration < 500) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setResult({ type: 'error', title: 'Too Short', message: 'Hold the button longer while speaking' });
      setMode('result');
      try {
        await recordingRef.current.stopAndUnloadAsync();
      } catch (e) {}
      recordingRef.current = null;
      return;
    }

    // Haptic feedback to indicate recording stopped
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setMode('processing');
    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      
      console.log('Recording saved to:', uri);
      
      if (uri) {
        await processVoiceCommand(uri);
      }
    } catch (err) {
      console.error('Failed to stop recording:', err);
      setResult({ type: 'error', title: 'Error', message: 'Failed to process recording' });
      setMode('result');
    }
  };

  const processVoiceCommand = async (audioUri: string) => {
    try {
      // Step 1: Transcribe audio
      const formData = new FormData();
      formData.append('audio', {
        uri: audioUri,
        type: 'audio/m4a',
        name: 'command.m4a',
      } as any);

      const transcribeRes = await fetch(`${apiBaseUrl}/api/mobile/transcribe`, {
        method: 'POST',
        headers: { 'x-mobile-api-key': mobileApiKey },
        body: formData,
      });

      if (!transcribeRes.ok) {
        const errorText = await transcribeRes.text();
        console.log('Transcribe error:', transcribeRes.status, errorText);
        let errorMsg = `Transcribe failed: ${transcribeRes.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMsg = errorJson.details || errorJson.error || errorMsg;
          if (errorJson.whisperError) {
            console.log('Whisper error:', errorJson.whisperError);
          }
        } catch {}
        throw new Error(transcribeRes.status === 401 ? 'Unauthorized - check MOBILE_API_KEY' : errorMsg);
      }

      const transcribeData = await transcribeRes.json();
      if (!transcribeData.transcript) {
        throw new Error('No transcript returned');
      }

      setTranscript(transcribeData.transcript);

      // Step 2: Execute command via AI agent
      const executeRes = await fetch(`${apiBaseUrl}/api/mobile/voice-command`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-mobile-api-key': mobileApiKey,
        },
        body: JSON.stringify({ command: transcribeData.transcript }),
      });

      if (!executeRes.ok) {
        const errorText = await executeRes.text();
        console.log('Execute error:', executeRes.status, errorText);
        throw new Error(executeRes.status === 401 ? 'Unauthorized - check MOBILE_API_KEY' : `Command failed: ${executeRes.status}`);
      }

      const executeData = await executeRes.json();
      
      if (executeData.success) {
        setResult({
          type: executeData.action_type || 'success',
          title: executeData.title || 'Done',
          message: executeData.message || 'Command executed',
          data: executeData.data,
        });
      } else {
        setResult({
          type: 'error',
          title: 'Error',
          message: executeData.error || 'Failed to execute command',
        });
      }
    } catch (err: any) {
      setResult({
        type: 'error',
        title: 'Error',
        message: err.message || 'Something went wrong',
      });
    } finally {
      setMode('result');
    }
  };

  const reset = () => {
    setMode('idle');
    setTranscript('');
    setResult(null);
  };

  const fetchOrderDetails = async (orderId: string) => {
    setOrderLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/mobile/orders/${orderId}`, {
        headers: { 'x-mobile-api-key': mobileApiKey },
      });
      if (res.ok) {
        const order = await res.json();
        setSelectedOrder(order);
      } else {
        Alert.alert('Error', 'Failed to fetch order details');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch order details');
    } finally {
      setOrderLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setOrderLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/mobile/orders/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-mobile-api-key': mobileApiKey,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(updated.order || { ...selectedOrder, status });
        Alert.alert('Success', `Order status updated to ${status}`);
      } else {
        Alert.alert('Error', 'Failed to update order');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update order');
    } finally {
      setOrderLoading(false);
    }
  };

  const updateTracking = async (orderId: string, trackingNumber: string, carrier: string) => {
    setOrderLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/mobile/orders/${orderId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-mobile-api-key': mobileApiKey,
        },
        body: JSON.stringify({ 
          tracking_number: trackingNumber, 
          shipping_carrier: carrier,
          status: 'shipped',
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(updated.order || { ...selectedOrder, tracking_number: trackingNumber, shipping_carrier: carrier, status: 'shipped' });
        Alert.alert('Success', 'Tracking info added and order marked as shipped');
      } else {
        Alert.alert('Error', 'Failed to update tracking');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update tracking');
    } finally {
      setOrderLoading(false);
    }
  };

  // Product/Inventory functions
  const fetchProductDetails = async (productId: string) => {
    setOrderLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/mobile/products/${productId}`, {
        headers: { 'x-mobile-api-key': mobileApiKey },
      });
      if (res.ok) {
        const product = await res.json();
        setSelectedProduct(product);
      } else {
        Alert.alert('Error', 'Failed to fetch product details');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch product details');
    } finally {
      setOrderLoading(false);
    }
  };

  const updateProduct = async (productId: string, updates: any) => {
    setOrderLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/mobile/products/${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-mobile-api-key': mobileApiKey,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedProduct(data.product);
        Alert.alert('Success', 'Product updated');
      } else {
        Alert.alert('Error', 'Failed to update product');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update product');
    } finally {
      setOrderLoading(false);
    }
  };

  // Customer functions
  const fetchCustomerDetails = async (customerId: string) => {
    setOrderLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/mobile/customers/${customerId}`, {
        headers: { 'x-mobile-api-key': mobileApiKey },
      });
      if (res.ok) {
        const customer = await res.json();
        setSelectedCustomer(customer);
      } else {
        Alert.alert('Error', 'Failed to fetch customer details');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to fetch customer details');
    } finally {
      setOrderLoading(false);
    }
  };

  const updateCustomer = async (customerId: string, updates: any) => {
    setOrderLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/mobile/customers/${customerId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-mobile-api-key': mobileApiKey,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedCustomer(data.customer);
        Alert.alert('Success', 'Customer updated');
      } else {
        Alert.alert('Error', 'Failed to update customer');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to update customer');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>MODERN HEALTH PRO</Text>
        <Text style={styles.tagline}>Voice Command Center</Text>
      </View>

      {/* Main Content */}
      <View style={styles.main}>
        {mode === 'idle' && (
          <View style={styles.idleState}>
            <Text style={styles.instruction}>Hold the button and speak</Text>
            <Text style={styles.examples}>
              "Create invoice for John Mullins for 10 Tirzepatide at B2B price, total $4,000"
            </Text>
            <Text style={styles.examples}>
              "Pull up recent orders for rep Nathan"
            </Text>
            <Text style={styles.examples}>
              "Show orders ready to ship"
            </Text>
          </View>
        )}

        {mode === 'listening' && (
          <View style={styles.listeningState}>
            <Text style={styles.listeningText}>Listening...</Text>
            <Text style={styles.listeningHint}>Release to process</Text>
          </View>
        )}

        {mode === 'processing' && (
          <View style={styles.processingState}>
            <ActivityIndicator size="large" color="#ef4444" />
            <Text style={styles.processingText}>Processing command...</Text>
            {transcript && (
              <View style={styles.transcriptBox}>
                <Text style={styles.transcriptLabel}>You said:</Text>
                <Text style={styles.transcriptText}>"{transcript}"</Text>
              </View>
            )}
          </View>
        )}

        {mode === 'result' && result && (
          <ResultView 
            result={result} 
            onReset={reset} 
            onOrderPress={fetchOrderDetails}
            onProductPress={fetchProductDetails}
            onCustomerPress={fetchCustomerDetails}
          />
        )}
      </View>

      {/* Big Red Button */}
      <View style={styles.buttonContainer}>
        {mode !== 'result' && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={startListening}
            onPressOut={stopListening}
            disabled={mode === 'processing'}
          >
            <Animated.View 
              style={[
                styles.bigButton,
                mode === 'listening' && styles.bigButtonActive,
                mode === 'processing' && styles.bigButtonProcessing,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <Ionicons 
                name={mode === 'processing' ? 'hourglass' : 'mic'} 
                size={60} 
                color="#fff" 
              />
            </Animated.View>
          </TouchableOpacity>
        )}

        {mode === 'result' && (
          <TouchableOpacity style={styles.resetButton} onPress={reset}>
            <Ionicons name="refresh" size={24} color="#fff" />
            <Text style={styles.resetButtonText}>New Command</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Order Detail Modal */}
      <Modal
        visible={selectedOrder !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <OrderDetailModal
          order={selectedOrder}
          loading={orderLoading}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
          onUpdateTracking={updateTracking}
        />
      </Modal>

      <Modal
        visible={selectedProduct !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedProduct(null)}
      >
        <ProductDetailModal
          product={selectedProduct}
          loading={orderLoading}
          onClose={() => setSelectedProduct(null)}
          onUpdate={updateProduct}
        />
      </Modal>

      <Modal
        visible={selectedCustomer !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedCustomer(null)}
      >
        <CustomerDetailModal
          customer={selectedCustomer}
          loading={orderLoading}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={updateCustomer}
        />
      </Modal>
    </SafeAreaView>
  );
}

// Order Detail Modal Component
function OrderDetailModal({ 
  order, 
  loading, 
  onClose, 
  onUpdateStatus, 
  onUpdateTracking 
}: { 
  order: any; 
  loading: boolean;
  onClose: () => void; 
  onUpdateStatus: (id: string, status: string) => void;
  onUpdateTracking: (id: string, tracking: string, carrier: string) => void;
}) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('USPS');

  if (!order) return null;

  const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  const customerName = order.customers?.users 
    ? `${order.customers.users.first_name || ''} ${order.customers.users.last_name || ''}`.trim() 
    : order.guest_name || 'Guest';

  return (
    <View style={modalStyles.container}>
      <View style={modalStyles.header}>
        <Text style={modalStyles.title}>Order {order.order_number}</Text>
        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={modalStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ef4444" />
        </View>
      )}

      <ScrollView style={modalStyles.content}>
        {/* Order Info */}
        <View style={modalStyles.section}>
          <Text style={modalStyles.sectionTitle}>Order Details</Text>
          <View style={modalStyles.row}>
            <Text style={modalStyles.label}>Customer</Text>
            <Text style={modalStyles.value}>{customerName}</Text>
          </View>
          <View style={modalStyles.row}>
            <Text style={modalStyles.label}>Email</Text>
            <Text style={modalStyles.value}>{order.customers?.users?.email || 'N/A'}</Text>
          </View>
          <View style={modalStyles.row}>
            <Text style={modalStyles.label}>Total</Text>
            <Text style={modalStyles.valueHighlight}>${order.total_amount?.toFixed(2)}</Text>
          </View>
          <View style={modalStyles.row}>
            <Text style={modalStyles.label}>Status</Text>
            <View style={[modalStyles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
              <Text style={modalStyles.statusText}>{order.status}</Text>
            </View>
          </View>
          <View style={modalStyles.row}>
            <Text style={modalStyles.label}>Payment</Text>
            <View style={[modalStyles.statusBadge, { backgroundColor: getStatusColor(order.payment_status) }]}>
              <Text style={modalStyles.statusText}>{order.payment_status}</Text>
            </View>
          </View>
          <View style={modalStyles.row}>
            <Text style={modalStyles.label}>Date</Text>
            <Text style={modalStyles.value}>{new Date(order.created_at).toLocaleString()}</Text>
          </View>
        </View>

        {/* Order Items */}
        {order.order_items && order.order_items.length > 0 && (
          <View style={modalStyles.section}>
            <Text style={modalStyles.sectionTitle}>Items</Text>
            {order.order_items.map((item: any, idx: number) => (
              <View key={idx} style={modalStyles.itemRow}>
                <Text style={modalStyles.itemName}>{item.product_name}</Text>
                <Text style={modalStyles.itemQty}>x{item.quantity}</Text>
                <Text style={modalStyles.itemPrice}>${item.total_price?.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Shipping Address */}
        {order.customers && (
          <View style={modalStyles.section}>
            <Text style={modalStyles.sectionTitle}>Shipping</Text>
            <Text style={modalStyles.address}>
              {order.customers.shipping_address_line1 || 'No address'}
              {order.customers.shipping_city && `\n${order.customers.shipping_city}, ${order.customers.shipping_state} ${order.customers.shipping_zip}`}
            </Text>
          </View>
        )}

        {/* Update Status */}
        <View style={modalStyles.section}>
          <Text style={modalStyles.sectionTitle}>Update Status</Text>
          <View style={modalStyles.statusButtons}>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  modalStyles.statusButton,
                  order.status === status && modalStyles.statusButtonActive
                ]}
                onPress={() => onUpdateStatus(order.id, status)}
              >
                <Text style={[
                  modalStyles.statusButtonText,
                  order.status === status && modalStyles.statusButtonTextActive
                ]}>{status}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Tracking */}
        <View style={modalStyles.section}>
          <Text style={modalStyles.sectionTitle}>Tracking</Text>
          {order.tracking_number ? (
            <View style={modalStyles.row}>
              <Text style={modalStyles.label}>{order.shipping_carrier || 'Carrier'}</Text>
              <Text style={modalStyles.value}>{order.tracking_number}</Text>
            </View>
          ) : (
            <>
              <TextInput
                style={modalStyles.input}
                placeholder="Tracking number"
                placeholderTextColor="#666"
                value={trackingNumber}
                onChangeText={setTrackingNumber}
              />
              <View style={modalStyles.carrierRow}>
                {['USPS', 'UPS', 'FedEx'].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[modalStyles.carrierButton, carrier === c && modalStyles.carrierButtonActive]}
                    onPress={() => setCarrier(c)}
                  >
                    <Text style={[modalStyles.carrierText, carrier === c && modalStyles.carrierTextActive]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={modalStyles.saveButton}
                onPress={() => {
                  if (trackingNumber.trim()) {
                    onUpdateTracking(order.id, trackingNumber.trim(), carrier);
                  } else {
                    Alert.alert('Error', 'Please enter a tracking number');
                  }
                }}
              >
                <Text style={modalStyles.saveButtonText}>Add Tracking & Mark Shipped</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function ResultView({ result, onReset, onOrderPress, onProductPress, onCustomerPress }: { 
  result: ActionResult; 
  onReset: () => void; 
  onOrderPress: (id: string) => void;
  onProductPress: (id: string) => void;
  onCustomerPress: (id: string) => void;
}) {
  const getIcon = () => {
    switch (result.type) {
      case 'invoice_created': return 'document-text';
      case 'orders_list': return 'list';
      case 'inventory_list': return 'cube';
      case 'customer_created': return 'person-add';
      case 'customer_list': return 'people';
      case 'error': return 'alert-circle';
      case 'success': return 'checkmark-circle';
      default: return 'information-circle';
    }
  };

  const getColor = () => {
    switch (result.type) {
      case 'error': return '#ef4444';
      case 'success': case 'invoice_created': case 'customer_created': return '#22c55e';
      case 'inventory_list': return '#8b5cf6';
      case 'customer_list': return '#3b82f6';
      default: return '#3b82f6';
    }
  };

  return (
    <ScrollView style={styles.resultContainer} contentContainerStyle={styles.resultContent}>
      <View style={[styles.resultIcon, { backgroundColor: getColor() + '20' }]}>
        <Ionicons name={getIcon() as any} size={48} color={getColor()} />
      </View>
      
      <Text style={styles.resultTitle}>{result.title}</Text>
      <Text style={styles.resultMessage}>{result.message}</Text>

      {/* Orders List */}
      {result.type === 'orders_list' && result.data?.orders && (
        <View style={styles.ordersList}>
          {result.data.orders.map((order: any) => (
            <TouchableOpacity 
              key={order.id} 
              style={styles.orderItem}
              onPress={() => onOrderPress(order.id)}
              activeOpacity={0.7}
            >
              <View style={styles.orderItemHeader}>
                <Text style={styles.orderItemNumber}>{order.order_number}</Text>
                <View style={[styles.orderItemStatus, { backgroundColor: getStatusColor(order.payment_status || order.status) }]}>
                  <Text style={styles.orderItemStatusText}>{order.payment_status || order.status}</Text>
                </View>
              </View>
              <Text style={styles.orderItemCustomer}>{order.customer_name || order.guest_name || 'Guest'}</Text>
              <View style={styles.orderItemFooter}>
                <Text style={styles.orderItemDate}>{new Date(order.created_at).toLocaleDateString()}</Text>
                <Text style={styles.orderItemTotal}>${order.total_amount?.toFixed(2)}</Text>
              </View>
              <View style={styles.orderItemTapHint}>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Invoice Created */}
      {result.type === 'invoice_created' && result.data?.invoice && (
        <View style={styles.invoiceCreated}>
          <View style={styles.invoiceDetail}>
            <Text style={styles.invoiceLabel}>Invoice #</Text>
            <Text style={styles.invoiceValue}>{result.data.invoice.invoice_number}</Text>
          </View>
          <View style={styles.invoiceDetail}>
            <Text style={styles.invoiceLabel}>Customer</Text>
            <Text style={styles.invoiceValue}>{result.data.invoice.customer_name}</Text>
          </View>
          <View style={styles.invoiceDetail}>
            <Text style={styles.invoiceLabel}>Total</Text>
            <Text style={styles.invoiceTotal}>${result.data.invoice.total?.toFixed(2)}</Text>
          </View>
          {result.data.invoice.payment_url && (
            <View style={styles.invoiceDetail}>
              <Text style={styles.invoiceLabel}>Status</Text>
              <Text style={styles.invoiceSent}>✓ Email Sent</Text>
            </View>
          )}
        </View>
      )}

      {/* Inventory List */}
      {result.type === 'inventory_list' && result.data?.products && (
        <View style={styles.ordersList}>
          {result.data.products.map((product: any, idx: number) => (
            <TouchableOpacity 
              key={product.id || idx} 
              style={styles.orderItem}
              onPress={() => product.id && onProductPress(product.id)}
              activeOpacity={0.7}
            >
              <View style={styles.orderItemHeader}>
                <Text style={styles.orderItemNumber}>{product.name}</Text>
                <View style={[styles.orderItemStatus, { backgroundColor: product.current_stock > 10 ? '#22c55e' : product.current_stock > 0 ? '#eab308' : '#ef4444' }]}>
                  <Text style={styles.orderItemStatusText}>{product.current_stock} in stock</Text>
                </View>
              </View>
              {product.b2b_price && (
                <View style={styles.orderItemFooter}>
                  <Text style={styles.orderItemDate}>B2B: ${product.b2b_price?.toFixed(2)}</Text>
                  <Text style={styles.orderItemTotal}>Retail: ${product.retail_price?.toFixed(2)}</Text>
                </View>
              )}
              <View style={styles.orderItemTapHint}>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Customer List (Search Results) */}
      {result.type === 'customer_list' && result.data?.customers && (
        <View style={styles.ordersList}>
          {result.data.customers.map((customer: any) => (
            <TouchableOpacity 
              key={customer.id} 
              style={styles.orderItem}
              onPress={() => onCustomerPress(customer.id)}
              activeOpacity={0.7}
            >
              <View style={styles.orderItemHeader}>
                <Text style={styles.orderItemNumber}>
                  {customer.first_name} {customer.last_name}
                </Text>
                {customer.company_name && (
                  <View style={[styles.orderItemStatus, { backgroundColor: '#8b5cf6' }]}>
                    <Text style={styles.orderItemStatusText}>{customer.company_name}</Text>
                  </View>
                )}
              </View>
              {customer.email && (
                <Text style={styles.orderItemCustomer}>{customer.email}</Text>
              )}
              <View style={styles.orderItemFooter}>
                <Text style={styles.orderItemDate}>
                  {customer.city ? `${customer.city}, ${customer.state}` : 'No address'}
                </Text>
                {customer.phone && (
                  <Text style={styles.orderItemTotal}>{customer.phone}</Text>
                )}
              </View>
              <View style={styles.orderItemTapHint}>
                <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Customer Created */}
      {result.type === 'customer_created' && result.data?.customer && (
        <TouchableOpacity 
          style={styles.invoiceCreated}
          onPress={() => result.data.customer.id && onCustomerPress(result.data.customer.id)}
          activeOpacity={0.7}
        >
          <View style={styles.invoiceDetail}>
            <Text style={styles.invoiceLabel}>Email</Text>
            <Text style={styles.invoiceValue}>{result.data.customer.email}</Text>
          </View>
          <View style={styles.invoiceDetail}>
            <Text style={styles.invoiceLabel}>Name</Text>
            <Text style={styles.invoiceValue}>{result.data.customer.first_name} {result.data.customer.last_name}</Text>
          </View>
          {result.data.customer.company_name && (
            <View style={styles.invoiceDetail}>
              <Text style={styles.invoiceLabel}>Company</Text>
              <Text style={styles.invoiceValue}>{result.data.customer.company_name}</Text>
            </View>
          )}
          <View style={styles.invoiceDetail}>
            <Text style={styles.invoiceLabel}>Status</Text>
            <Text style={styles.invoiceSent}>✓ Invite Sent</Text>
          </View>
          <Text style={styles.tapToEditHint}>Tap to edit customer</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

// Product Detail Modal Component - Shows all variants of a product
function ProductDetailModal({ 
  product, 
  loading, 
  onClose, 
  onUpdate 
}: { 
  product: any; 
  loading: boolean;
  onClose: () => void; 
  onUpdate: (id: string, updates: any) => void;
}) {
  // Track edits for each variant by ID
  const [variantEdits, setVariantEdits] = useState<Record<string, any>>({});

  useEffect(() => {
    if (product?.variants) {
      // Initialize edits from variants
      const edits: Record<string, any> = {};
      product.variants.forEach((v: any) => {
        edits[v.id] = {
          current_stock: String(v.current_stock || 0),
          cost_price: String(v.cost_price || 0),
          b2b_price: String(v.b2b_price || 0),
          retail_price: String(v.retail_price || 0),
        };
      });
      setVariantEdits(edits);
    }
  }, [product]);

  if (!product) return null;

  const variants = product.variants || [product];
  const baseName = product.base_name || product.name;

  const updateVariantField = (variantId: string, field: string, value: string) => {
    setVariantEdits(prev => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        [field]: value,
      }
    }));
  };

  const adjustStock = (variantId: string, amount: number) => {
    const current = parseInt(variantEdits[variantId]?.current_stock || '0');
    const newStock = Math.max(0, current + amount);
    updateVariantField(variantId, 'current_stock', String(newStock));
  };

  const saveVariant = (variantId: string) => {
    const edits = variantEdits[variantId];
    if (!edits) return;
    
    onUpdate(variantId, {
      current_stock: parseInt(edits.current_stock) || 0,
      cost_price: parseFloat(edits.cost_price) || 0,
      b2b_price: parseFloat(edits.b2b_price) || 0,
      retail_price: parseFloat(edits.retail_price) || 0,
    });
  };

  const getStockColor = (stock: string) => {
    const num = parseInt(stock || '0');
    return num > 10 ? '#22c55e' : num > 0 ? '#eab308' : '#ef4444';
  };

  return (
    <View style={modalStyles.container}>
      <View style={modalStyles.header}>
        <Text style={modalStyles.title}>{baseName}</Text>
        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={modalStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#8b5cf6" />
        </View>
      )}

      <ScrollView style={modalStyles.content}>
        {variants.map((variant: any) => {
          const edits = variantEdits[variant.id] || {};
          const stock = edits.current_stock || '0';
          
          return (
            <View key={variant.id} style={modalStyles.variantCard}>
              {/* Variant Header */}
              <View style={modalStyles.variantHeader}>
                <Text style={modalStyles.variantName}>
                  {variant.variant || variant.name}
                </Text>
                <View style={[modalStyles.statusBadge, { backgroundColor: getStockColor(stock) }]}>
                  <Text style={modalStyles.statusText}>{stock} in stock</Text>
                </View>
              </View>

              {/* Stock Controls */}
              <View style={modalStyles.stockControls}>
                <TouchableOpacity style={modalStyles.stockButton} onPress={() => adjustStock(variant.id, -10)}>
                  <Text style={modalStyles.stockButtonText}>-10</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modalStyles.stockButton} onPress={() => adjustStock(variant.id, -1)}>
                  <Text style={modalStyles.stockButtonText}>-1</Text>
                </TouchableOpacity>
                <TextInput
                  style={modalStyles.stockInput}
                  value={stock}
                  onChangeText={(val) => updateVariantField(variant.id, 'current_stock', val)}
                  keyboardType="numeric"
                  textAlign="center"
                />
                <TouchableOpacity style={modalStyles.stockButton} onPress={() => adjustStock(variant.id, 1)}>
                  <Text style={modalStyles.stockButtonText}>+1</Text>
                </TouchableOpacity>
                <TouchableOpacity style={modalStyles.stockButton} onPress={() => adjustStock(variant.id, 10)}>
                  <Text style={modalStyles.stockButtonText}>+10</Text>
                </TouchableOpacity>
              </View>

              {/* Pricing Row */}
              <View style={modalStyles.pricingRow}>
                <View style={modalStyles.priceBox}>
                  <Text style={modalStyles.priceLabel}>Cost</Text>
                  <View style={modalStyles.priceInputSmall}>
                    <Text style={modalStyles.pricePrefix}>$</Text>
                    <TextInput
                      style={modalStyles.priceFieldSmall}
                      value={edits.cost_price || '0'}
                      onChangeText={(val) => updateVariantField(variant.id, 'cost_price', val)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
                <View style={modalStyles.priceBox}>
                  <Text style={modalStyles.priceLabel}>B2B</Text>
                  <View style={modalStyles.priceInputSmall}>
                    <Text style={modalStyles.pricePrefix}>$</Text>
                    <TextInput
                      style={modalStyles.priceFieldSmall}
                      value={edits.b2b_price || '0'}
                      onChangeText={(val) => updateVariantField(variant.id, 'b2b_price', val)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
                <View style={modalStyles.priceBox}>
                  <Text style={modalStyles.priceLabel}>Retail</Text>
                  <View style={modalStyles.priceInputSmall}>
                    <Text style={modalStyles.pricePrefix}>$</Text>
                    <TextInput
                      style={modalStyles.priceFieldSmall}
                      value={edits.retail_price || '0'}
                      onChangeText={(val) => updateVariantField(variant.id, 'retail_price', val)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
              </View>

              {/* Save Button for this variant */}
              <TouchableOpacity 
                style={modalStyles.variantSaveButton} 
                onPress={() => saveVariant(variant.id)}
              >
                <Text style={modalStyles.variantSaveButtonText}>Save {variant.variant || 'Changes'}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// Customer Detail Modal Component
function CustomerDetailModal({ 
  customer, 
  loading, 
  onClose, 
  onUpdate 
}: { 
  customer: any; 
  loading: boolean;
  onClose: () => void; 
  onUpdate: (id: string, updates: any) => void;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (customer) {
      const user = customer.users || customer;
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
      setEmail(user.email || '');
      setPhone(customer.phone || user.phone || '');
      setCompanyName(customer.company_name || '');
      setAddressLine1(customer.shipping_address_line1 || '');
      setCity(customer.shipping_city || '');
      setState(customer.shipping_state || '');
      setZip(customer.shipping_zip || '');
      setIsEditing(false);
    }
  }, [customer]);

  if (!customer) return null;

  const handleSave = () => {
    onUpdate(customer.id, {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      company_name: companyName,
      shipping_address_line1: addressLine1,
      shipping_city: city,
      shipping_state: state,
      shipping_zip: zip,
    });
    setIsEditing(false);
  };

  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone.replace(/\D/g, '')}`);
    }
  };

  const handleText = () => {
    if (phone) {
      Linking.openURL(`sms:${phone.replace(/\D/g, '')}`);
    }
  };

  const handleEmail = () => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const fullName = `${firstName} ${lastName}`.trim() || 'Customer';

  return (
    <View style={modalStyles.container}>
      <View style={modalStyles.header}>
        <Text style={modalStyles.title}>{fullName}</Text>
        <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={modalStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      )}

      <ScrollView style={modalStyles.content}>
        {/* Quick Contact Section - Always visible */}
        <View style={modalStyles.section}>
          <Text style={modalStyles.sectionTitle}>Quick Contact</Text>
          
          {/* Email Row */}
          {email && (
            <View style={modalStyles.contactRow}>
              <View style={modalStyles.contactIcon}>
                <Ionicons name="mail" size={20} color="#3b82f6" />
              </View>
              <View style={modalStyles.contactInfo}>
                <Text style={modalStyles.contactLabel}>Email</Text>
                <Text style={modalStyles.contactValue}>{email}</Text>
              </View>
              <View style={modalStyles.contactActions}>
                <TouchableOpacity style={modalStyles.contactActionButton} onPress={handleEmail}>
                  <Ionicons name="send" size={18} color="#3b82f6" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Phone Row */}
          {phone && (
            <View style={modalStyles.contactRow}>
              <View style={[modalStyles.contactIcon, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
                <Ionicons name="call" size={20} color="#22c55e" />
              </View>
              <View style={modalStyles.contactInfo}>
                <Text style={modalStyles.contactLabel}>Phone</Text>
                <Text style={[modalStyles.contactValue, { color: '#22c55e' }]}>{phone}</Text>
              </View>
              <View style={modalStyles.contactActions}>
                <TouchableOpacity style={modalStyles.contactActionButton} onPress={handleText}>
                  <Ionicons name="chatbubble" size={18} color="#22c55e" />
                </TouchableOpacity>
                <TouchableOpacity style={modalStyles.contactActionButton} onPress={handleCall}>
                  <Ionicons name="call" size={18} color="#22c55e" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Company */}
          {companyName && (
            <View style={modalStyles.contactRow}>
              <View style={[modalStyles.contactIcon, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                <Ionicons name="business" size={20} color="#8b5cf6" />
              </View>
              <View style={modalStyles.contactInfo}>
                <Text style={modalStyles.contactLabel}>Company</Text>
                <Text style={[modalStyles.contactValue, { color: '#8b5cf6' }]}>{companyName}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Edit Toggle */}
        <TouchableOpacity 
          style={[modalStyles.section, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 }]}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Text style={modalStyles.sectionTitle}>Edit Profile</Text>
          <Ionicons name={isEditing ? 'chevron-up' : 'chevron-down'} size={20} color="rgba(255,255,255,0.4)" />
        </TouchableOpacity>

        {/* Editable Fields - Only show when editing */}
        {isEditing && (
          <>
            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Personal Info</Text>
              
              <Text style={modalStyles.inputLabel}>First Name</Text>
              <TextInput
                style={modalStyles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
                placeholderTextColor="#666"
              />
              
              <Text style={modalStyles.inputLabel}>Last Name</Text>
              <TextInput
                style={modalStyles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
                placeholderTextColor="#666"
              />
              
              <Text style={modalStyles.inputLabel}>Email</Text>
              <TextInput
                style={modalStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <Text style={modalStyles.inputLabel}>Phone</Text>
              <TextInput
                style={modalStyles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone"
                placeholderTextColor="#666"
                keyboardType="phone-pad"
              />
            </View>

            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Business</Text>
              
              <Text style={modalStyles.inputLabel}>Company Name</Text>
              <TextInput
                style={modalStyles.input}
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Company name"
                placeholderTextColor="#666"
              />
            </View>

            <View style={modalStyles.section}>
              <Text style={modalStyles.sectionTitle}>Shipping Address</Text>
              
              <Text style={modalStyles.inputLabel}>Address</Text>
              <TextInput
                style={modalStyles.input}
                value={addressLine1}
                onChangeText={setAddressLine1}
                placeholder="Street address"
                placeholderTextColor="#666"
              />
              
              <View style={modalStyles.addressRow}>
                <View style={modalStyles.addressField}>
                  <Text style={modalStyles.inputLabel}>City</Text>
                  <TextInput
                    style={modalStyles.input}
                    value={city}
                    onChangeText={setCity}
                    placeholder="City"
                    placeholderTextColor="#666"
                  />
                </View>
                <View style={modalStyles.addressFieldSmall}>
                  <Text style={modalStyles.inputLabel}>State</Text>
                  <TextInput
                    style={modalStyles.input}
                    value={state}
                    onChangeText={setState}
                    placeholder="ST"
                    placeholderTextColor="#666"
                    maxLength={2}
                    autoCapitalize="characters"
                  />
                </View>
                <View style={modalStyles.addressFieldSmall}>
                  <Text style={modalStyles.inputLabel}>ZIP</Text>
                  <TextInput
                    style={modalStyles.input}
                    value={zip}
                    onChangeText={setZip}
                    placeholder="ZIP"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <TouchableOpacity style={modalStyles.saveButton} onPress={handleSave}>
              <Text style={modalStyles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'paid': case 'completed': case 'shipped': return '#22c55e';
    case 'processing': case 'confirmed': return '#3b82f6';
    case 'pending': return '#eab308';
    case 'cancelled': case 'failed': return '#ef4444';
    default: return '#6b7280';
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
  },
  logo: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    letterSpacing: 4,
    color: 'rgba(255,255,255,0.4)',
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  idleState: {
    alignItems: 'center',
  },
  instruction: {
    fontSize: 22,
    fontWeight: '300',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 30,
  },
  examples: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: 12,
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  listeningState: {
    alignItems: 'center',
  },
  listeningText: {
    fontSize: 28,
    fontWeight: '300',
    color: '#ef4444',
    marginBottom: 8,
  },
  listeningHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  processingState: {
    alignItems: 'center',
  },
  processingText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 20,
  },
  transcriptBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    width: '100%',
  },
  transcriptLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
  },
  transcriptText: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
  },
  buttonContainer: {
    alignItems: 'center',
    paddingBottom: 60,
    paddingTop: 20,
  },
  bigButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  bigButtonActive: {
    backgroundColor: '#b91c1c',
    shadowOpacity: 0.8,
    shadowRadius: 50,
  },
  bigButtonProcessing: {
    backgroundColor: '#6b7280',
    shadowColor: '#6b7280',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    gap: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  resultContainer: {
    flex: 1,
  },
  resultContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  resultIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultMessage: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  ordersList: {
    width: '100%',
  },
  orderItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderItemNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  orderItemStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  orderItemStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
    textTransform: 'uppercase',
  },
  orderItemCustomer: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  orderItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemDate: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
  },
  orderItemTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#22c55e',
  },
  invoiceCreated: {
    width: '100%',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  invoiceDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  invoiceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  invoiceValue: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  invoiceTotal: {
    fontSize: 24,
    color: '#22c55e',
    fontWeight: '700',
  },
  invoiceSent: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '600',
  },
  tapToEditHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  orderItemTapHint: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -8,
  },
});

// Modal Styles
const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    padding: 8,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  value: {
    fontSize: 14,
    color: '#fff',
  },
  valueHighlight: {
    fontSize: 20,
    fontWeight: '600',
    color: '#22c55e',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  itemQty: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    marginHorizontal: 12,
  },
  itemPrice: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '500',
  },
  address: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statusButtonActive: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  statusButtonText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'capitalize',
  },
  statusButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 12,
  },
  carrierRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  carrierButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  carrierButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  carrierText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  carrierTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  stockControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  stockButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  stockInput: {
    width: 80,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  priceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  pricePrefix: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
  },
  priceField: {
    width: 80,
    height: 40,
    fontSize: 16,
    color: '#fff',
    textAlign: 'right',
  },
  inputLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 6,
    marginTop: 8,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 12,
  },
  addressField: {
    flex: 2,
  },
  addressFieldSmall: {
    flex: 1,
  },
  // Variant card styles
  variantCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  variantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  variantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 12,
  },
  priceBox: {
    flex: 1,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  priceInputSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  priceFieldSmall: {
    width: 50,
    height: 36,
    fontSize: 14,
    color: '#fff',
    textAlign: 'right',
  },
  variantSaveButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  variantSaveButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  // Clickable contact styles
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 16,
    color: '#3b82f6',
    marginTop: 2,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8,
  },
  contactActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
