export * from './database';

// App-specific types
export interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export interface ScannedProduct {
  sku: string;
  name: string;
  quantity: number;
  location?: string;
}
