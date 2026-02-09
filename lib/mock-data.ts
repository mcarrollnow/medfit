import { Product } from '@/types'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'BPC-157 5mg',
    base_name: 'BPC-157',
    variant: '5mg',
    barcode: 'BPC157-5MG',
    retail_price: '45.00',
    description: 'Body Protection Compound - Premium research peptide',
    color: 'blue',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    name: 'BPC-157 10mg',
    base_name: 'BPC-157',
    variant: '10mg',
    barcode: 'BPC157-10MG',
    retail_price: '75.00',
    description: 'Body Protection Compound - Premium research peptide',
    color: 'blue',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    name: 'TB-500 5mg',
    base_name: 'TB-500',
    variant: '5mg',
    barcode: 'TB500-5MG',
    retail_price: '55.00',
    description: 'Thymosin Beta-4 fragment - Research compound',
    color: 'green',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    name: 'TB-500 10mg',
    base_name: 'TB-500',
    variant: '10mg',
    barcode: 'TB500-10MG',
    retail_price: '95.00',
    description: 'Thymosin Beta-4 fragment - Research compound',
    color: 'green',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Ipamorelin 5mg',
    base_name: 'Ipamorelin',
    variant: '5mg',
    barcode: 'IPA-5MG',
    retail_price: '40.00',
    description: 'Growth hormone secretagogue - Research peptide',
    color: 'purple',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Ipamorelin 10mg',
    base_name: 'Ipamorelin',
    variant: '10mg',
    barcode: 'IPA-10MG',
    retail_price: '70.00',
    description: 'Growth hormone secretagogue - Research peptide',
    color: 'purple',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '7',
    name: 'CJC-1295 5mg',
    base_name: 'CJC-1295',
    variant: '5mg',
    barcode: 'CJC-5MG',
    retail_price: '50.00',
    description: 'Growth hormone releasing hormone analog',
    color: 'orange',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '8',
    name: 'CJC-1295 10mg',
    base_name: 'CJC-1295',
    variant: '10mg',
    barcode: 'CJC-10MG',
    retail_price: '85.00',
    description: 'Growth hormone releasing hormone analog',
    color: 'orange',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]
