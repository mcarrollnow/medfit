# Database Setup Instructions

This guide will help you set up your Supabase database for the Modern Health Pro Agent application.

## Prerequisites

- Supabase account and project created
- Environment variables set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `ANTHROPIC_API_KEY`

## Step 1: Run the Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `database/schema.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute the schema

This will create all the necessary tables:
- `customers` - Customer information
- `orders` - Order records
- `order_items` - Items in each order
- `order_timeline` - Order status timeline
- `support_tickets` - Support ticket records
- `messages` - Chat messages (both customer-facing and admin-only)
- `admin_notes` - Internal notes about customers
- `conversations` - Conversation history

## Step 2: Seed Sample Data (Optional)

To populate your database with sample data for testing:

1. In the Supabase SQL Editor
2. Copy the contents of `database/seed.sql`
3. Paste into the SQL Editor
4. Click "Run" to execute the seed script

This will create:
- 3 sample customers (John Doe, Jane Smith, Mike Johnson)
- Multiple orders with items and timelines
- 2 active support tickets with conversation history
- Admin notes
- Conversation history records

## Step 3: Verify Installation

After running the scripts, verify the tables were created:

1. Go to the "Table Editor" in Supabase
2. You should see all 8 tables listed
3. Click on each table to verify the structure
4. If you ran the seed script, you should see sample data

## Step 4: Configure Row Level Security (RLS)

The schema includes basic RLS policies that allow all operations. For production, you should customize these policies based on your authentication setup.

### Example: Restrict customer data access

\`\`\`sql
-- Drop the permissive policy
DROP POLICY "Allow all operations on customers" ON customers;

-- Create more restrictive policies
CREATE POLICY "Customers can view their own data"
  ON customers FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all customers"
  ON customers FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
\`\`\`

## Step 5: Test the Integration

1. Start your Next.js development server: `npm run dev`
2. Navigate to the admin interface at `http://localhost:3000`
3. Open the sidebar and check the Support Tickets tab
4. You should see the sample tickets loaded from Supabase
5. Click on a ticket to view order details and conversation history

## Troubleshooting

### Connection Issues

If you see connection errors:
1. Verify your environment variables are set correctly
2. Check that your Supabase project is active
3. Ensure your API keys are valid

### Missing Data

If tables are empty:
1. Verify the schema script ran successfully
2. Check for any error messages in the SQL Editor
3. Run the seed script to populate sample data

### RLS Errors

If you get "permission denied" errors:
1. Check your RLS policies in the Supabase dashboard
2. Temporarily disable RLS for testing (not recommended for production)
3. Ensure your authentication is set up correctly

## Next Steps

- Customize RLS policies for your authentication setup
- Add more sample data as needed
- Set up real-time subscriptions for live updates
- Configure database backups
- Set up monitoring and alerts

## Database Schema Overview

### Customers Table
Stores customer information including contact details and purchase statistics.

### Orders Table
Contains order records with payment and shipping information.

### Order Items Table
Line items for each order (many-to-one relationship with orders).

### Order Timeline Table
Tracks the status progression of each order.

### Support Tickets Table
Main ticket records linking customers and orders.

### Messages Table
All chat messages, with a flag for admin-only messages.

### Admin Notes Table
Internal notes about customers, visible only to admins.

### Conversations Table
Conversation history for the history tab.

## Support

For issues or questions:
- Check the Supabase documentation: https://supabase.com/docs
- Review the Next.js documentation: https://nextjs.org/docs
- Check the AI SDK documentation: https://sdk.vercel.ai/docs
