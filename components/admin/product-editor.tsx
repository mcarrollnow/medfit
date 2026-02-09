'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  Package,
  DollarSign,
  Tag,
  BarChart,
  Image as ImageIcon,
  Save,
  AlertCircle
} from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import type { Product } from '@/types';

interface ProductEditorProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function ProductEditor({ product, isOpen, onClose, onSave }: ProductEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    base_name: '',
    variant: '',
    barcode: '',
    category_id: '',
    description: '',
    cost_price: 0,
    b2b_price: 0,
    retail_price: 0,
    initial_stock: 0,
    current_stock: 0,
    restock_level: 10,
    is_active: true,
    image_url: '',
    color: ''
  });

  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        base_name: product.base_name || '',
        variant: product.variant || '',
        barcode: product.barcode || '',
        category_id: product.category_id || '',
        description: product.description || '',
        cost_price: product.cost_price || 0,
        b2b_price: product.b2b_price || 0,
        retail_price: product.retail_price || 0,
        initial_stock: product.initial_stock || 0,
        current_stock: product.current_stock || 0,
        restock_level: product.restock_level || 10,
        is_active: product.is_active ?? true,
        image_url: product.image_url || '',
        color: product.color || ''
      });
      setImagePreview(product.image_url || null);
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        base_name: '',
        variant: '',
        barcode: '',
        category_id: '',
        description: '',
        cost_price: 0,
        b2b_price: 0,
        retail_price: 0,
        initial_stock: 0,
        current_stock: 0,
        restock_level: 10,
        is_active: true,
        image_url: '',
        color: ''
      });
      setImagePreview(null);
    }
  }, [product]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('id, name')
      .order('name');

    if (data) {
      setCategories(data);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    try {
      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setError('Failed to upload image');
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
      setImagePreview(publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload image');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name || !formData.barcode) {
        setError('Name and barcode are required');
        return;
      }

      const productData = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      if (product) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);

        if (updateError) {
          throw updateError;
        }
      } else {
        // Create new product
        const { error: insertError } = await supabase
          .from('products')
          .insert({
            ...productData,
            created_at: new Date().toISOString()
          });

        if (insertError) {
          throw insertError;
        }
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Save error:', error);
      setError(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const calculateMarkup = (cost: number, price: number) => {
    if (cost === 0) return 0;
    return ((price - cost) / cost * 100).toFixed(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/80" onClick={onClose} />

        {/* Modal */}
        <div className="relative bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
            <h2 className="text-2xl font-bold text-white">
              {product ? 'Edit Product' : 'New Product'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Basic Information
                  </h3>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Base Name</label>
                      <input
                        type="text"
                        value={formData.base_name}
                        onChange={(e) => setFormData({ ...formData, base_name: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Variant</label>
                      <input
                        type="text"
                        value={formData.variant}
                        onChange={(e) => setFormData({ ...formData, variant: e.target.value })}
                        placeholder="e.g., 10mg, Large"
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Barcode/SKU *</label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Category</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Color Hex (optional)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        placeholder="#FF5733"
                        className="flex-1 px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                      />
                      {formData.color && (
                        <div
                          className="w-10 h-10 rounded border border-gray-700"
                          style={{ backgroundColor: formData.color }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Product Image
                  </h3>

                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
                      isDragging
                        ? 'border-white bg-gray-800'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    {imagePreview ? (
                      <div className="space-y-4">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="mx-auto h-48 w-48 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-sm text-gray-400 hover:text-white transition"
                        >
                          Change image
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="mx-auto w-12 h-12 text-gray-500" />
                        <p className="text-gray-400">
                          Drag and drop an image here, or click to select
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                          Choose Image
                        </button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pricing
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Cost Price</label>
                      <input
                        type="number"
                        value={formData.cost_price}
                        onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">B2B Price</label>
                      <input
                        type="number"
                        value={formData.b2b_price}
                        onChange={(e) => setFormData({ ...formData, b2b_price: parseFloat(e.target.value) || 0 })}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                      />
                      {formData.cost_price > 0 && (
                        <p className="text-xs text-green-400 mt-1">
                          {calculateMarkup(formData.cost_price, formData.b2b_price)}% markup
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Retail Price</label>
                      <input
                        type="number"
                        value={formData.retail_price}
                        onChange={(e) => setFormData({ ...formData, retail_price: parseFloat(e.target.value) || 0 })}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                      />
                      {formData.cost_price > 0 && (
                        <p className="text-xs text-green-400 mt-1">
                          {calculateMarkup(formData.cost_price, formData.retail_price)}% markup
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <BarChart className="w-5 h-5 mr-2" />
                    Inventory
                  </h3>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Initial Stock</label>
                      <input
                        type="number"
                        value={formData.initial_stock}
                        onChange={(e) => setFormData({ ...formData, initial_stock: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Current Stock</label>
                      <input
                        type="number"
                        value={formData.current_stock}
                        onChange={(e) => setFormData({ ...formData, current_stock: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Restock Level</label>
                      <input
                        type="number"
                        value={formData.restock_level}
                        onChange={(e) => setFormData({ ...formData, restock_level: parseInt(e.target.value) || 0 })}
                        min="0"
                        className="w-full px-3 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <Tag className="w-5 h-5 mr-2" />
                    Status
                  </h3>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-700 text-white focus:ring-white"
                    />
                    <span className="text-white">Product is active and visible</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-800">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-700 text-gray-400 rounded-lg hover:text-white hover:border-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}