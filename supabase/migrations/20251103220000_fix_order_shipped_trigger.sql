-- Fix the notify_order_shipped trigger function to use correct customer schema
CREATE OR REPLACE FUNCTION notify_order_shipped()
RETURNS TRIGGER AS $$
DECLARE
  customer_user_id UUID;
  user_name TEXT;
BEGIN
  -- Only notify when status changes TO 'shipped'
  IF NEW.status = 'shipped' AND (OLD.status IS NULL OR OLD.status != 'shipped') THEN
    -- Get customer's user_id
    SELECT c.user_id
    INTO customer_user_id
    FROM customers c
    WHERE c.id = NEW.customer_id;
    
    -- Get user's name from users table
    SELECT CONCAT(u.first_name, ' ', u.last_name)
    INTO user_name
    FROM users u
    WHERE u.id = customer_user_id;
    
    -- Create notification
    PERFORM create_notification(
      customer_user_id,
      'order_shipped',
      'Order Shipped! 📦',
      'Your order #' || NEW.order_number || ' has been shipped' || 
        CASE WHEN NEW.tracking_number IS NOT NULL
        THEN '. Tracking: ' || NEW.tracking_number
        ELSE '' END,
      NEW.id,
      '/orders'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
