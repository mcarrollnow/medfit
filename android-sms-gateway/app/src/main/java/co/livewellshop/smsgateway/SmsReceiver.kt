package co.livewellshop.smsgateway

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch

/**
 * BroadcastReceiver that listens for incoming SMS messages
 * and forwards them to the webhook endpoint
 */
class SmsReceiver : BroadcastReceiver() {
    
    companion object {
        private const val TAG = "SmsReceiver"
        private const val PREFS_NAME = "sms_gateway_prefs"
        private const val KEY_MESSAGES_RECEIVED = "messages_received"
    }
    
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            return
        }
        
        Log.d(TAG, "SMS received, processing...")
        
        // Extract SMS messages from intent
        val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
        
        if (messages.isNullOrEmpty()) {
            Log.w(TAG, "No messages found in intent")
            return
        }
        
        // Process each message
        messages.forEach { sms ->
            val sender = sms.originatingAddress ?: "Unknown"
            val messageBody = sms.messageBody ?: ""
            val timestamp = sms.timestampMillis
            
            Log.d(TAG, "Processing SMS from: $sender")
            Log.d(TAG, "Message: $messageBody")
            AppLogger.info(TAG, "📨 Incoming SMS from $sender: ${messageBody.take(50)}")
            
            // Increment received counter
            incrementReceivedCount(context)
            
            // Forward to webhook asynchronously
            scope.launch {
                try {
                    val result = WebhookClient.forwardIncomingSms(
                        phoneNumber = sender,
                        message = messageBody,
                        timestamp = timestamp
                    )
                    
                    if (result.isSuccess) {
                        Log.d(TAG, "SMS forwarded successfully to webhook")
                        AppLogger.success(TAG, "✅ Forwarded to webhook")
                    } else {
                        Log.e(TAG, "Failed to forward SMS: ${result.exceptionOrNull()?.message}")
                        AppLogger.error(TAG, "❌ Webhook failed: ${result.exceptionOrNull()?.message}")
                    }
                } catch (e: Exception) {
                    Log.e(TAG, "Error forwarding SMS", e)
                }
            }
        }
    }
    
    /**
     * Increment the received message counter
     */
    private fun incrementReceivedCount(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val current = prefs.getInt(KEY_MESSAGES_RECEIVED, 0)
        prefs.edit().putInt(KEY_MESSAGES_RECEIVED, current + 1).apply()
        Log.d(TAG, "Messages received count: ${current + 1}")
    }
}
