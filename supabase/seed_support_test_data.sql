-- ============================================
-- Support UI Test Data Generator
-- Uses REAL products and business logic
-- ============================================

-- Get existing customer IDs for reference
DO $$
DECLARE
  customer1_id uuid;
  customer2_id uuid;
  customer3_id uuid;
  user1_id uuid;
  user2_id uuid;
  user3_id uuid;
  admin_user_id uuid;
  product_bpc157 uuid := 'f742119a-fe02-4eb3-95c5-b2e6f3008fa7';
  product_sema uuid := 'a5600f01-e148-4a66-8a43-04dc12becf63';
  product_cjc uuid := 'cf5fb067-744f-41c5-8e59-a66191e1d517';
  product_ghrp2_2mg uuid := '5b88e752-488f-4d89-8a43-0d9e0367566c';
  product_ghrp2_5mg uuid := '0f4d9c31-4a45-43e2-9d1f-e8147950557c';
  product_hex2mg uuid := '7f9223e6-bff3-495f-a863-0a17848b938f';
  order1_id uuid;
  order2_id uuid;
  order3_id uuid;
  order4_id uuid;
  order5_id uuid;
  ticket1_id uuid;
  ticket2_id uuid;
  ticket3_id uuid;
  ticket4_id uuid;
BEGIN

-- ============================================
-- 1. GET EXISTING CUSTOMERS
-- ============================================
SELECT id INTO customer1_id FROM customers WHERE customer_type = 'retail' LIMIT 1;
SELECT id INTO customer2_id FROM customers WHERE customer_type = 'retail' OFFSET 1 LIMIT 1;
SELECT id INTO customer3_id FROM customers WHERE customer_type = 'retail' OFFSET 2 LIMIT 1;

-- Get their user IDs
SELECT user_id INTO user1_id FROM customers WHERE id = customer1_id;
SELECT user_id INTO user2_id FROM customers WHERE id = customer2_id;
SELECT user_id INTO user3_id FROM customers WHERE id = customer3_id;

-- Get an admin user for AI/admin messages
SELECT id INTO admin_user_id FROM users WHERE role = 'admin' LIMIT 1;

RAISE NOTICE 'Using customers: %, %, %', customer1_id, customer2_id, customer3_id;
RAISE NOTICE 'Using admin user: %', admin_user_id;

-- ============================================
-- 2. CREATE TEST ORDERS WITH REAL PRODUCTS
-- ============================================

-- ORDER 1: Retail customer - Delivered order (happy customer)
order1_id := gen_random_uuid();
INSERT INTO orders (
  id, order_number, customer_id, customer_type, status, 
  subtotal, tax_amount, shipping_amount, total_amount,
  payment_method, payment_status, payment_date,
  created_at, shipped_at, tracking_number, shipping_carrier
) VALUES (
  order1_id,
  'ORD-' || to_char(NOW() - INTERVAL '5 days', 'YYYYMMDD') || '-001',
  customer1_id,
  'retail',
  'delivered',
  165.00,
  0,
  0,
  165.00,
  'crypto',
  'paid',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '3 days',
  '1Z999AA10123456784',
  'UPS'
);

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
VALUES 
  (order1_id, product_bpc157, 'BPC-157 10mg', 1, 100.00, 100.00),
  (order1_id, product_sema, 'Semaglutide 2mg', 1, 65.00, 65.00);

-- ORDER 2: Retail customer - Shipped but delayed
order2_id := gen_random_uuid();
INSERT INTO orders (
  id, order_number, customer_id, customer_type, status,
  subtotal, tax_amount, shipping_amount, total_amount,
  payment_method, payment_status, payment_date,
  created_at, shipped_at, tracking_number, shipping_carrier
) VALUES (
  order2_id,
  'ORD-' || to_char(NOW() - INTERVAL '7 days', 'YYYYMMDD') || '-002',
  customer2_id,
  'retail',
  'shipped',
  125.00,
  0,
  0,
  125.00,
  'crypto',
  'paid',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '6 days',
  '1Z999AA10123456785',
  'USPS'
);

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
VALUES 
  (order2_id, product_bpc157, 'BPC-157 10mg', 1, 100.00, 100.00),
  (order2_id, product_ghrp2_2mg, 'GHRP-2 2mg', 1, 36.00, 36.00);

-- ORDER 3: Pending payment - Needs follow-up
order3_id := gen_random_uuid();
INSERT INTO orders (
  id, order_number, customer_id, customer_type, status,
  subtotal, tax_amount, shipping_amount, total_amount,
  payment_method, payment_status,
  created_at
) VALUES (
  order3_id,
  'ORD-' || to_char(NOW() - INTERVAL '2 days', 'YYYYMMDD') || '-003',
  customer3_id,
  'retail',
  'pending',
  84.00,
  0,
  0,
  84.00,
  'crypto',
  'pending',
  NOW() - INTERVAL '2 days'
);

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
VALUES 
  (order3_id, product_cjc, 'CJC-1295 w/o DAC 5mg', 1, 48.00, 48.00),
  (order3_id, product_ghrp2_2mg, 'GHRP-2 2mg', 1, 36.00, 36.00);

-- ORDER 4: Recently delivered - might need support
order4_id := gen_random_uuid();
INSERT INTO orders (
  id, order_number, customer_id, customer_type, status,
  subtotal, tax_amount, shipping_amount, total_amount,
  payment_method, payment_status, payment_date,
  created_at, shipped_at, tracking_number, shipping_carrier
) VALUES (
  order4_id,
  'ORD-' || to_char(NOW() - INTERVAL '10 days', 'YYYYMMDD') || '-004',
  customer1_id,
  'retail',
  'delivered',
  75.00,
  0,
  0,
  75.00,
  'crypto',
  'paid',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '8 days',
  '1Z999AA10123456786',
  'FedEx'
);

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
VALUES 
  (order4_id, product_ghrp2_5mg, 'GHRP-2 5mg', 1, 39.00, 39.00),
  (order4_id, product_ghrp2_2mg, 'GHRP-2 2mg', 1, 36.00, 36.00);

-- ORDER 5: Processing - no issues yet
order5_id := gen_random_uuid();
INSERT INTO orders (
  id, order_number, customer_id, customer_type, status,
  subtotal, tax_amount, shipping_amount, total_amount,
  payment_method, payment_status, payment_date,
  created_at
) VALUES (
  order5_id,
  'ORD-' || to_char(NOW() - INTERVAL '1 day', 'YYYYMMDD') || '-005',
  customer2_id,
  'retail',
  'processing',
  100.00,
  0,
  0,
  100.00,
  'crypto',
  'paid',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
);

INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, total_price)
VALUES 
  (order5_id, product_bpc157, 'BPC-157 10mg', 1, 100.00, 100.00);

RAISE NOTICE 'Created 5 orders';

-- ============================================
-- 3. CREATE SUPPORT TICKETS
-- ============================================

-- TICKET 1: Delivery delay complaint (HIGH priority, OPEN)
ticket1_id := gen_random_uuid();
INSERT INTO support_tickets (
  id, customer_id, user_id, order_id,
  subject, message, status, priority,
  created_at, ai_handling
) VALUES (
  ticket1_id,
  customer2_id,
  user2_id,
  order2_id,
  'Package tracking shows no movement for 5 days',
  'Hi, I ordered BPC-157 a week ago and the tracking hasn''t updated in 5 days. It just says "In Transit" but no location updates. Can you check on this?',
  'open',
  'high',
  NOW() - INTERVAL '2 hours',
  true
);

-- Add conversation to ticket 1
INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin, is_ai, created_at)
VALUES 
  (ticket1_id, user2_id, 'Hi, I ordered BPC-157 a week ago and the tracking hasn''t updated in 5 days. It just says "In Transit" but no location updates. Can you check on this?', false, false, NOW() - INTERVAL '2 hours'),
  (ticket1_id, admin_user_id, 'I understand your concern about the tracking. Let me look into this for you. I see your order was shipped via USPS. Sometimes there can be scanning delays, but let me check with the carrier.', false, true, NOW() - INTERVAL '1 hour 45 minutes');

INSERT INTO admin_notes (ticket_id, author, note, created_at)
VALUES 
  (ticket1_id, 'AI System', 'Checked USPS tracking - package is in transit but appears delayed at distribution center. Recommend contacting carrier.', NOW() - INTERVAL '1 hour 30 minutes');

-- TICKET 2: Product question (MEDIUM priority, OPEN)
ticket2_id := gen_random_uuid();
INSERT INTO support_tickets (
  id, customer_id, user_id,
  subject, message, status, priority,
  created_at, ai_handling
) VALUES (
  ticket2_id,
  customer3_id,
  user3_id,
  NULL,
  'Question about dosing for CJC-1295',
  'I''m new to peptides and want to know the recommended dosing protocol for CJC-1295 w/o DAC. Should I take it daily or weekly?',
  'open',
  'medium',
  NOW() - INTERVAL '5 hours',
  true
);

INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin, is_ai, created_at)
VALUES 
  (ticket2_id, user3_id, 'I''m new to peptides and want to know the recommended dosing protocol for CJC-1295 w/o DAC. Should I take it daily or weekly?', false, false, NOW() - INTERVAL '5 hours'),
  (ticket2_id, admin_user_id, 'For CJC-1295 without DAC, the typical protocol is 100-200mcg 2-3 times daily, ideally before bed and post-workout. However, I strongly recommend consulting with your healthcare provider for personalized dosing guidance.', false, true, NOW() - INTERVAL '4 hours 30 minutes'),
  (ticket2_id, user3_id, 'Thanks! One more question - can I stack it with GHRP-2?', false, false, NOW() - INTERVAL '3 hours');

-- TICKET 3: Payment issue (HIGH priority, OPEN)
ticket3_id := gen_random_uuid();
INSERT INTO support_tickets (
  id, customer_id, user_id, order_id,
  subject, message, status, priority,
  created_at, ai_handling, ai_escalated, escalation_reason
) VALUES (
  ticket3_id,
  customer3_id,
  user3_id,
  order3_id,
  'Sent payment but order still shows pending',
  'I sent the Bitcoin payment 2 days ago (tx hash: abc123...) but my order still shows as pending payment. Can someone verify?',
  'open',
  'high',
  NOW() - INTERVAL '6 hours',
  false,
  true,
  'Payment verification required - needs manual admin review'
);

INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin, is_ai, created_at)
VALUES 
  (ticket3_id, user3_id, 'I sent the Bitcoin payment 2 days ago (tx hash: abc123...) but my order still shows as pending payment. Can someone verify?', false, false, NOW() - INTERVAL '6 hours'),
  (ticket3_id, admin_user_id, 'I see this requires payment verification. I''ve escalated this to our payment team for manual review. They''ll check the transaction and update your order status within 24 hours.', false, true, NOW() - INTERVAL '5 hours 30 minutes');

INSERT INTO admin_notes (ticket_id, author, note, created_at)
VALUES 
  (ticket3_id, 'AI System', 'ESCALATED: Payment verification needed. Customer claims BTC sent 2 days ago. Need to check blockchain and wallet.', NOW() - INTERVAL '5 hours 30 minutes');

-- TICKET 4: Product quality concern (MEDIUM priority, IN_PROGRESS)
ticket4_id := gen_random_uuid();
INSERT INTO support_tickets (
  id, customer_id, user_id, order_id,
  subject, message, status, priority,
  created_at, ai_handling
) VALUES (
  ticket4_id,
  customer1_id,
  user1_id,
  order4_id,
  'Vial arrived with small crack',
  'Just received my GHRP-2 order. One of the vials has a hairline crack on the side. The seal seems intact but I''m concerned about sterility. What should I do?',
  'in_progress',
  'medium',
  NOW() - INTERVAL '1 day',
  true
);

INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin, is_ai, created_at)
VALUES 
  (ticket4_id, user1_id, 'Just received my GHRP-2 order. One of the vials has a hairline crack on the side. The seal seems intact but I''m concerned about sterility. What should I do?', false, false, NOW() - INTERVAL '1 day'),
  (ticket4_id, admin_user_id, 'I''m very sorry about this! We take product quality seriously. Please don''t use that vial. I''m sending you a replacement immediately at no charge. Can you email a photo to quality@domain.com for our records?', true, false, NOW() - INTERVAL '20 hours'),
  (ticket4_id, user1_id, 'Thanks for the quick response! I''ll send the photo now. Really appreciate the fast resolution.', false, false, NOW() - INTERVAL '19 hours');

INSERT INTO admin_notes (ticket_id, author, note, created_at)
VALUES 
  (ticket4_id, 'Admin', 'Approved replacement shipment. Order #REP-' || to_char(NOW(), 'YYYYMMDD') || '-001 created. Flagged batch for QC review.', NOW() - INTERVAL '20 hours');

-- TICKET 5: General inquiry (LOW priority, RESOLVED)
INSERT INTO support_tickets (
  id, customer_id, user_id,
  subject, message, status, priority,
  created_at, closed_at, ai_handling
) VALUES (
  gen_random_uuid(),
  customer1_id,
  user1_id,
  NULL,
  'Do you ship to Canada?',
  'I have a friend in Toronto who wants to order. Do you ship internationally?',
  'resolved',
  'low',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 days 22 hours',
  true
);

-- TICKET 6: Tracking request (LOW priority, RESOLVED)
INSERT INTO support_tickets (
  id, customer_id, user_id, order_id,
  subject, message, status, priority,
  created_at, closed_at, ai_handling
) VALUES (
  gen_random_uuid(),
  customer2_id,
  user2_id,
  order5_id,
  'When will my order ship?',
  'I placed an order yesterday. Any idea when it will ship out?',
  'resolved',
  'low',
  NOW() - INTERVAL '1 day 6 hours',
  NOW() - INTERVAL '1 day 5 hours',
  true
);

-- TICKET 7: Dosage question (MEDIUM priority, RESOLVED)
INSERT INTO support_tickets (
  id, customer_id, user_id,
  subject, message, status, priority,
  created_at, closed_at, ai_handling
) VALUES (
  gen_random_uuid(),
  customer3_id,
  user3_id,
  NULL,
  'Storage temperature for peptides?',
  'Should I store BPC-157 in the fridge or freezer?',
  'resolved',
  'medium',
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '3 days 20 hours',
  true
);

-- TICKET 8: Reorder assistance (LOW priority, RESOLVED)
INSERT INTO support_tickets (
  id, customer_id, user_id,
  subject, message, status, priority,
  created_at, closed_at, ai_handling
) VALUES (
  gen_random_uuid(),
  customer1_id,
  user1_id,
  NULL,
  'How do I reorder my last purchase?',
  'I want to order the same products as last time. Is there an easy way to do this?',
  'resolved',
  'low',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day 22 hours',
  true
);

RAISE NOTICE 'Created 8 support tickets with messages and notes';

END $$;

-- ============================================
-- VERIFY TEST DATA
-- ============================================
SELECT 
  'ORDERS CREATED' as info,
  COUNT(*) as count,
  SUM(total_amount) as total_revenue
FROM orders 
WHERE created_at > NOW() - INTERVAL '1 hour';

SELECT 
  'TICKETS CREATED' as info,
  status,
  priority,
  COUNT(*) as count
FROM support_tickets 
WHERE created_at > NOW() - INTERVAL '1 hour'
GROUP BY status, priority
ORDER BY status, priority;

SELECT 
  'TICKET MESSAGES' as info,
  COUNT(*) as count
FROM ticket_messages
WHERE created_at > NOW() - INTERVAL '1 hour';

-- Done!
SELECT '✅ Test data created successfully!' as status;
