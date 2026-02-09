-- Sample data to populate the database

-- Insert sample customers
INSERT INTO customers (id, name, email, phone, customer_since, total_orders, total_spent, average_order_value) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'john.doe@example.com', '+1 (555) 123-4567', '2024-01-15 10:00:00', 12, 1245.99, 103.83),
('550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'jane.smith@example.com', '+1 (555) 234-5678', '2024-03-20 14:30:00', 8, 687.25, 85.91),
('550e8400-e29b-41d4-a716-446655440003', 'Mike Johnson', 'mike.johnson@example.com', '+1 (555) 345-6789', '2024-02-10 09:15:00', 15, 2340.50, 156.03);

-- Insert sample orders for John Doe
INSERT INTO orders (id, order_number, customer_id, order_date, total, subtotal, shipping, tax, status, wallet_address, tracking_number) VALUES
('650e8400-e29b-41d4-a716-446655440001', '#12345', '550e8400-e29b-41d4-a716-446655440001', '2025-01-15 10:30:00', 125.99, 125.99, 0.00, 0.00, 'processing', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', '1Z999AA10123456784'),
('650e8400-e29b-41d4-a716-446655440002', '#12289', '550e8400-e29b-41d4-a716-446655440001', '2024-12-28 14:00:00', 89.50, 89.50, 0.00, 0.00, 'delivered', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', '1Z999AA10123456790'),
('650e8400-e29b-41d4-a716-446655440003', '#12156', '550e8400-e29b-41d4-a716-446655440001', '2024-12-10 11:00:00', 210.00, 210.00, 0.00, 0.00, 'delivered', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', '1Z999AA10123456791');

-- Insert order items for order #12345
INSERT INTO order_items (order_id, name, quantity, price) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Blue Widget', 2, 45.99),
('650e8400-e29b-41d4-a716-446655440001', 'Red Gadget', 1, 34.01);

-- Insert order items for order #12289
INSERT INTO order_items (order_id, name, quantity, price) VALUES
('650e8400-e29b-41d4-a716-446655440002', 'Green Gadget', 1, 89.50);

-- Insert order items for order #12156
INSERT INTO order_items (order_id, name, quantity, price) VALUES
('650e8400-e29b-41d4-a716-446655440003', 'Premium Headphones', 1, 150.00),
('650e8400-e29b-41d4-a716-446655440003', 'Carrying Case', 1, 60.00);

-- Insert order timeline for order #12345
INSERT INTO order_timeline (order_id, status, date, time, completed) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Order Placed', 'Jan 15, 2025', '10:30 AM', true),
('650e8400-e29b-41d4-a716-446655440001', 'Order Approved', 'Jan 15, 2025', '11:15 AM', true),
('650e8400-e29b-41d4-a716-446655440001', 'Payment Made', 'Jan 15, 2025', '11:20 AM', true),
('650e8400-e29b-41d4-a716-446655440001', 'Order Shipped', 'Jan 16, 2025', '2:45 PM', true),
('650e8400-e29b-41d4-a716-446655440001', 'Order Delivered', 'Pending', 'ETA: Jan 20', false);

-- Insert order timeline for order #12289
INSERT INTO order_timeline (order_id, status, date, time, completed) VALUES
('650e8400-e29b-41d4-a716-446655440002', 'Order Placed', 'Dec 28, 2024', '2:00 PM', true),
('650e8400-e29b-41d4-a716-446655440002', 'Order Approved', 'Dec 28, 2024', '2:30 PM', true),
('650e8400-e29b-41d4-a716-446655440002', 'Payment Made', 'Dec 28, 2024', '2:35 PM', true),
('650e8400-e29b-41d4-a716-446655440002', 'Order Shipped', 'Dec 29, 2024', '10:00 AM', true),
('650e8400-e29b-41d4-a716-446655440002', 'Order Delivered', 'Jan 2, 2025', '3:45 PM', true);

-- Insert order timeline for order #12156
INSERT INTO order_timeline (order_id, status, date, time, completed) VALUES
('650e8400-e29b-41d4-a716-446655440003', 'Order Placed', 'Dec 10, 2024', '11:00 AM', true),
('650e8400-e29b-41d4-a716-446655440003', 'Order Approved', 'Dec 10, 2024', '11:30 AM', true),
('650e8400-e29b-41d4-a716-446655440003', 'Payment Made', 'Dec 10, 2024', '11:35 AM', true),
('650e8400-e29b-41d4-a716-446655440003', 'Order Shipped', 'Dec 11, 2024', '9:00 AM', true),
('650e8400-e29b-41d4-a716-446655440003', 'Order Delivered', 'Dec 14, 2024', '2:15 PM', true);

-- Insert sample orders for Jane Smith
INSERT INTO orders (id, order_number, customer_id, order_date, total, subtotal, shipping, tax, status, wallet_address, tracking_number) VALUES
('650e8400-e29b-41d4-a716-446655440004', '#12340', '550e8400-e29b-41d4-a716-446655440002', '2025-01-12 09:00:00', 89.50, 89.50, 0.00, 0.00, 'refund_pending', '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', '1Z999AA10123456785');

-- Insert order items for order #12340
INSERT INTO order_items (order_id, name, quantity, price) VALUES
('650e8400-e29b-41d4-a716-446655440004', 'Glass Vase', 1, 89.50);

-- Insert order timeline for order #12340
INSERT INTO order_timeline (order_id, status, date, time, completed) VALUES
('650e8400-e29b-41d4-a716-446655440004', 'Order Placed', 'Jan 12, 2025', '9:00 AM', true),
('650e8400-e29b-41d4-a716-446655440004', 'Order Approved', 'Jan 12, 2025', '9:30 AM', true),
('650e8400-e29b-41d4-a716-446655440004', 'Payment Made', 'Jan 12, 2025', '9:35 AM', true),
('650e8400-e29b-41d4-a716-446655440004', 'Refund Processed', 'Jan 14, 2025', '2:00 PM', true);

-- Insert support tickets
INSERT INTO support_tickets (id, ticket_number, customer_id, order_id, title, description, status, priority, last_message, last_message_time) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'TKT-1001', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'Order #12345 Issue', 'Customer ordered a product 5 days ago and hasn''t received any shipping updates. They''re concerned about the delivery timeline and want to know the current status of their order.', 'open', 'high', 'I haven''t received any updates on my order', NOW()),
('750e8400-e29b-41d4-a716-446655440002', 'TKT-1002', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440004', 'Refund Request - Order #12340', 'Customer received a damaged item and is requesting a full refund. They''ve provided photos of the damage and want to know the refund timeline.', 'pending', 'medium', 'Processing your refund now', NOW() - INTERVAL '15 minutes');

-- Insert messages for ticket TKT-1001
INSERT INTO messages (ticket_id, sender_type, sender_name, message_text, is_admin_only, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'customer', 'John Doe', 'Hi, I just placed order #12345. When will it ship?', false, '2025-01-15 10:30:00'),
('750e8400-e29b-41d4-a716-446655440001', 'ai', 'AI Assistant', 'Thank you for your order! Your order is being processed and should ship within 1-2 business days. You''ll receive a tracking number via email.', false, '2025-01-15 10:32:00'),
('750e8400-e29b-41d4-a716-446655440001', 'customer', 'John Doe', 'Great, thank you!', false, '2025-01-15 10:35:00'),
('750e8400-e29b-41d4-a716-446655440001', 'customer', 'John Doe', 'I still haven''t received any shipping updates. It''s been 3 days.', false, '2025-01-18 14:15:00'),
('750e8400-e29b-41d4-a716-446655440001', 'ai', 'AI Assistant', 'I apologize for the delay. Let me check on your order status for you.', false, '2025-01-18 14:17:00'),
('750e8400-e29b-41d4-a716-446655440001', 'ai', 'AI Assistant', 'I see there was a delay in our warehouse. Your order is now being prepared for shipment and should go out today.', false, '2025-01-18 14:18:00'),
('750e8400-e29b-41d4-a716-446655440001', 'customer', 'John Doe', 'Okay, but I''m getting concerned. I need this by next week.', false, '2025-01-18 14:20:00'),
('750e8400-e29b-41d4-a716-446655440001', 'customer', 'John Doe', 'I haven''t received any updates on my order', false, NOW() - INTERVAL '10 minutes'),
('750e8400-e29b-41d4-a716-446655440001', 'admin', 'Support Agent', 'Let me check the status for you', false, NOW() - INTERVAL '8 minutes'),
('750e8400-e29b-41d4-a716-446655440001', 'customer', 'John Doe', 'Thank you, I''m getting worried', false, NOW() - INTERVAL '2 minutes');

-- Insert admin-only messages for ticket TKT-1001
INSERT INTO messages (ticket_id, sender_type, sender_name, message_text, is_admin_only, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440001', 'ai', 'AI Assistant', 'Flagging this ticket - customer is getting frustrated about shipping delays. Warehouse confirmed delay but item should ship today.', true, '2025-01-18 14:19:00'),
('750e8400-e29b-41d4-a716-446655440001', 'admin', 'Support Manager', 'Thanks for the heads up. I''ll monitor this one closely.', true, '2025-01-18 14:25:00'),
('750e8400-e29b-41d4-a716-446655440001', 'ai', 'AI Assistant', 'Customer has reached out again. Still no tracking update in system. Recommend escalating to warehouse manager.', true, NOW() - INTERVAL '15 minutes'),
('750e8400-e29b-41d4-a716-446655440001', 'admin', 'Support Agent', 'On it. Contacting warehouse now.', true, NOW() - INTERVAL '10 minutes'),
('750e8400-e29b-41d4-a716-446655440001', 'ai', 'AI Assistant', 'Sentiment analysis shows customer frustration level is high. Consider offering discount code as goodwill gesture.', true, NOW() - INTERVAL '5 minutes');

-- Insert messages for ticket TKT-1002
INSERT INTO messages (ticket_id, sender_type, sender_name, message_text, is_admin_only, created_at) VALUES
('750e8400-e29b-41d4-a716-446655440002', 'customer', 'Jane Smith', 'The vase arrived broken', false, NOW() - INTERVAL '1 hour'),
('750e8400-e29b-41d4-a716-446655440002', 'ai', 'AI Assistant', 'I''m sorry to hear that. Can you send photos?', false, NOW() - INTERVAL '45 minutes'),
('750e8400-e29b-41d4-a716-446655440002', 'customer', 'Jane Smith', 'Here are the photos [attached]', false, NOW() - INTERVAL '30 minutes'),
('750e8400-e29b-41d4-a716-446655440002', 'admin', 'Support Agent', 'Processing your refund now', false, NOW() - INTERVAL '15 minutes');

-- Insert admin notes
INSERT INTO admin_notes (customer_id, author, note, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Admin', 'Customer prefers email communication', '2025-01-10 10:00:00'),
('550e8400-e29b-41d4-a716-446655440001', 'Support', 'Resolved shipping issue quickly, very satisfied', '2024-12-15 15:30:00'),
('550e8400-e29b-41d4-a716-446655440002', 'Support', 'Very understanding customer, easy to work with', '2024-12-22 11:00:00');

-- Insert sample conversations
INSERT INTO conversations (id, customer_id, title, preview, message_count, created_at, updated_at) VALUES
('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Order Tracking Inquiry', 'How can I track my order? I haven''t received any updates.', 8, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '30 minutes'),
('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003', 'Shipping Options Question', 'What are the available shipping options for international orders?', 5, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '1 hour 15 minutes'),
('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Return Request', 'I need to return an item that doesn''t fit properly.', 12, NOW() - INTERVAL '1 day', NOW() - INTERVAL '4 hours 20 minutes');
