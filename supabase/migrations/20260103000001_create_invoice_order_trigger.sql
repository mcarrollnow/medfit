-- Create a trigger to process invoice orders via Supabase Edge Function
-- This sends a Shopify invoice when an order with payment_method = 'invoice' is created

-- Create the trigger function that calls the edge function
CREATE OR REPLACE FUNCTION notify_invoice_order()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT;
  service_role_key TEXT;
BEGIN
  -- Only process orders with payment_method = 'invoice'
  IF NEW.payment_method = 'invoice' THEN
    -- Get the Supabase project URL from environment
    -- Note: Edge function URL is: {SUPABASE_URL}/functions/v1/send-shopify-invoice
    edge_function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-shopify-invoice';
    service_role_key := current_setting('app.settings.service_role_key', true);
    
    -- Use pg_net to call the edge function asynchronously
    -- This requires the pg_net extension to be enabled
    PERFORM net.http_post(
      url := edge_function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'type', 'INSERT',
        'record', row_to_json(NEW)
      )
    );
    
    RAISE NOTICE '[InvoiceOrderTrigger] Edge function called for order: %', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on orders table
DROP TRIGGER IF EXISTS on_invoice_order_created ON orders;
CREATE TRIGGER on_invoice_order_created
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_invoice_order();

COMMENT ON FUNCTION notify_invoice_order() IS 'Triggers Shopify invoice creation for orders with payment_method = invoice';
COMMENT ON TRIGGER on_invoice_order_created ON orders IS 'Calls edge function to send Shopify invoice for new invoice orders';

-- Alternative: If pg_net is not available, you can use Supabase webhooks instead
-- Configure a webhook in the Supabase dashboard:
-- 1. Go to Database > Webhooks
-- 2. Create new webhook
-- 3. Table: orders
-- 4. Events: INSERT
-- 5. URL: YOUR_SUPABASE_URL/functions/v1/send-shopify-invoice
-- 6. Add filters: payment_method = 'invoice'

