# Live Well Shop - Technical Architecture

## Overview
Live Well Shop is a full-stack e-commerce platform with AI-powered chat assistance, built with React, Vite, Node.js, Supabase, and Anthropic Claude, deployed on Vercel.

## Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.1.7
- **Styling**: Tailwind CSS 3.4.17 + shadcn/ui components
- **State Management**: Zustand 4.5.7
- **Routing**: React Router DOM 6.30.1
- **Charts**: Recharts 2.15.4
- **Icons**: Lucide React 0.307.0
- **AI Integration**: Vercel AI SDK (@ai-sdk/react, @ai-sdk/anthropic)
- **Markdown**: react-markdown with syntax highlighting (rehype-highlight)
- **Math Rendering**: KaTeX (rehype-katex, remark-math)
- **Animations**: Framer Motion 12.23.24
- **Toasts**: Sonner 2.0.7
- **Data Fetching**: SWR 2.3.6
- **Date Utilities**: date-fns 3.6.0

### Backend
- **Runtime**: Node.js (Vercel Serverless Functions)
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth
- **AI Model**: Anthropic Claude 3.5 Sonnet
- **Payment Processing**: Stripe Elements + Payment Intents API
- **Stripe Elements**: @stripe/stripe-js, @stripe/react-stripe-js (card payments)
- **Crypto On-Ramp**: Stripe On-Ramp (@stripe/crypto)
- **Crypto Payments**: Ethers.js 6.15.0

### Deployment
- **Platform**: Vercel
- **CI/CD**: Git-based deployment
- **Bundle Optimization**: Manual code splitting for faster loadsorage
- **Package Manager**: pnpm

### External APIs
- **AI Vision**: Claude 3.5 Sonnet (Anthropic) - Receipt scanning
- **AI Assistant**: Claude 3.5 Sonnet (Anthropic) - Crypto onboarding guidance
- **Crypto Prices**: CoinGecko API - Real-time ETH prices
- **Blockchain**: Etherscan API - Transaction verification & sync
- **Shipping Tracking**: ShipEngine API - Live carrier updates

## Project Structure

```
dashboard/
├── api/                    # Vercel serverless functions
│   ├── admin/             # Admin-only endpoints
│   ├── ai-chat/           # AI chat endpoints
│   ├── customer/          # Customer endpoints
│   ├── lib/               # Shared utilities
│   └── wallet/            # Wallet management
├── client/                # React frontend
│   ├── public/           # Static assets
│   └── src/
│       ├── components/   # React components
│       │   ├── ai-chat/  # AI chat components
│       │   └── ui/       # shadcn/ui components
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utilities
│       ├── pages/        # Page components
│       │   └── AIChat.tsx # AI Assistant page
│       ├── store/        # Zustand stores
│       └── types/        # TypeScript types
└── supabase/             # Database migrations
    └── migrations/       # SQL migration files
│   │   │   ├── CustomerDashboard.tsx
│   │   │   ├── Cart.tsx
│   │   │   └── Login.tsx
│   │   ├── /store            # State management
│   │   │   └── cartStore.ts
│   │   ├── /lib              # Utilities
│   │   │   └── auth-utils.ts
│   │   └── /styles
│   └── index.html
├── /api                       # Serverless backend
│   ├── /admin                # Admin endpoints
│   │   ├── /orders
│   │   │   ├── assigned-wallet.js
│   │   │   └── /update/[id].js       # Order editing
│   │   ├── /mark-shipped/[id].js
│   │   ├── scan-shipping-receipt.js   # AI receipt scanner
│   │   ├── orders.js
│   │   ├── products.js
│   │   ├── customers.js
│   │   ├── reps.js                    # Rep management
│   │   ├── assign-rep.js              # Customer assignment
│   │   └── commission-report.js       # Commission tracking
│   ├── /rep                   # Rep endpoints
│   │   ├── dashboard.js               # Rep metrics & data
│   │   └── tickets.js                 # Support tickets
│   ├── /orders               # Customer order endpoints
│   │   ├── initiate-payment.js       # Crypto payment
│   │   ├── verify-payment.js         # Auto-verification
│   │   ├── reset-payment.js
│   │   └── assigned-wallet.js
│   ├── /tracking
│   │   └── [trackingNumber].js       # Live tracking
│   ├── /wallet               # Crypto wallet management
│   │   ├── list.js
│   │   ├── sync-transactions.js
│   │   └── balance.js
│   ├── /crypto-assistant     # AI crypto onboarding
│   │   └── chat.js                   # Conversational guidance
│   ├── /lib                  # Shared utilities
│   │   └── supabase-server.js
│   ├── my-orders.js
│   └── products.js
├── /supabase
│   └── /migrations           # Database migrations
│       ├── create_business_wallets.sql
│       └── add_shipping_tracking_to_orders.sql
├── package.json              # Root dependencies
├── .npmrc                    # pnpm config
└── vercel.json              # Deployment config
```

## Database Schema

### Core Tables
- `users` - User accounts with role-based access
- `products` - Product catalog
- `orders` - Order management
- `order_items` - Order line items
- `discount_codes` - Promotional codes
- `support_tickets` - Customer support
- `business_wallets` - Crypto wallet management
- `wallet_transactions` - Transaction history
- `themes` - Customizable color schemes (admin-editable)

### AI Chat Tables
- `chat_sessions` - AI conversation sessions with title and visibility
- `chat_messages` - Individual messages with role (user/assistant/system)
- `documents` - AI-generated artifacts (code, text, sheets, images)
- `votes` - Message upvote/downvote tracking

### Security
- Row Level Security (RLS) enabled on all tables
- User-level data isolation
- Admin service role for privileged operations
- Chat sessions and documents scoped to user_id

### Key Fields (Orders)
- `tracking_number` - Shipping tracking number
- `shipping_carrier` - UPS, USPS, FedEx
- `payment_status` - Payment state
- `payment_method` - eth, usdc
- `expected_payment_amount` - ETH amount (5 decimals)
- `transaction_hash` - Blockchain tx hash
- `assigned_wallet_id` - Business wallet for payment

## Authentication & Authorization

### System
- **Provider**: Supabase Authentication
- **Method**: Email + Password
- **Sessions**: JWT tokens in httpOnly cookies
- **RLS**: Row Level Security on all tables

### Roles
1. **Admin** - Full access (role in user_metadata)
2. **Customer** - Can view/manage own orders
3. **Rep** - Sales representatives with assigned customer access
4. **Supplier** - Limited access to inventory and payment records

### Auth Flow
1. User logs in → Supabase issues JWT
2. Frontend stores session
3. API calls include auth header
4. `verifyAuth(req)` / `verifyAdmin(req)` / `verifySupplier(req)` validate
5. RLS enforces data access at DB level

### Supplier Portal
Full-featured partner portal for suppliers. Supplier's customers get real accounts on the same storefront at `supplier_price`. The supplier can manage orders, customers, send invoices that onboard new customers, and build documented shipment manifests before sending product.

**Pages:**
- **Dashboard** (`/supplier`) - Key metrics (active orders, customers, revenue, shipments in transit), Ship Product CTA, recent orders feed, 6-card quick actions grid, inbound shipment stats
- **Orders** (`/supplier/orders`) - All orders from supplier's customers with status filters (all/pending/processing/shipped/delivered), search by order number or customer name, expandable order cards with items/tracking/payment details, inline note editing
- **Customers** (`/supplier/customers`) - Full customer management. Add Customer creates a real Supabase Auth account (users + customers tables) with `customer_type: 'supplier_customer'` and `supplier_id` linked, sends set-password email. Edit customer profiles (name, phone, company, shipping address). Stats per customer (order count, total spent)
- **Ship Product** (`/supplier/ship-product`) - Box builder for documenting outbound shipments. Product search bar (by name, supplier code, or barcode). Calculator-style keypad for quantity entry (3x4 grid, mobile-optimized with active:scale-95 feedback). Photo capture/upload of box contents before sealing. Workflow: building -> seal box -> add tracking/carrier -> mark shipped. Shipment history sidebar
- **Inventory** (`/supplier/inventory`) - Full CRUD management of Johnny's own product catalog. Add/edit/delete products with supplier codes, categories, pricing, stock levels. Track low stock. Products auto-link to our catalog when supplier codes match. Separate from our `products` table
- **Payments** (`/supplier/payments`) - View payment records, wire transfers, message with admin

**Database Schema:**
- `customers.supplier_id` (UUID, FK -> users.id) - links customer to their supplier
- `customers.customer_type = 'supplier_customer'` - triggers supplier_price throughout the system
- `orders.source` (TEXT, default 'direct') - values: 'direct', 'supplier', 'rep'
- `orders.supplier_id` (UUID, FK -> users.id) - which supplier this order came through
- `supplier_products` - id, supplier_id (FK users), name, supplier_code (UNIQUE per supplier), description, category, unit_price, current_stock, restock_level, image_url, is_active, product_id (nullable FK products - optional mapping to our catalog), timestamps. This is Johnny's own independent product catalog
- `supplier_shipments` - id, supplier_id, shipment_number (SUP-xxx), status (building/sealed/shipped/received), tracking_number, carrier, notes, timestamps (created/updated/shipped/received)
- `supplier_shipment_items` - id, shipment_id, product_id (nullable FK products), supplier_product_id (nullable FK supplier_products), supplier_code, product_name, quantity, notes. Links to both our products and supplier's own products
- `supplier_shipment_photos` - id, shipment_id, photo_url (Supabase Storage), caption, uploaded_at
- `authorize_net_invoices.supplier_id` - links invoices to supplier for onboarding flow
- Storage bucket: `supplier-shipment-photos` with upload/view/delete policies

**Customer-Type Pricing System:**
The storefront shows different prices based on the customer's type. This is resolved in three places:
1. **Storefront catalog** (`app/page.tsx` - `groupProductsByBaseName()`) - groups products and computes `lowestPrice` using the correct price field
2. **Product detail page** (`app/(public)/products/[id]/page.tsx` - `getPrice()`) - shows correct price on variant selectors and main price display
3. **Cart API** (`app/api/cart/route.ts` - `getPriceForType()`) - sets `display_price` on cart items, which flows through to checkout

Price mapping:
| customer_type | Price Field |
|---|---|
| retail (default) | retail_price |
| b2b, b2bvip, rep | b2b_price |
| supplier_customer | supplier_price |

The cart store's `getTotal()` uses `display_price || retail_price`, so setting `display_price` in the cart API is all that's needed for checkout to work.

**Order Auto-Tagging:**
When a `supplier_customer` places an order through the normal checkout (`app/api/orders/route.ts`), the order is automatically tagged with `source = 'supplier'` and `supplier_id` from the customer's record. No manual tagging needed.

**Invoice-Based Customer Onboarding:**
Suppliers can send invoices that double as customer onboarding. Flow:
1. Supplier creates invoice via `/api/supplier/invoices` (wraps existing Authorize.net invoice system with `supplier_id` auto-set)
2. Invoice stored with `supplier_id` in `authorize_net_invoices` table
3. New customer receives email with setup link
4. Customer opens invoice, creates account (password setup via `/api/invoice/setup`)
5. Setup API detects `supplier_id` on invoice, creates account as `customer_type: 'supplier_customer'` with `supplier_id` linked
6. Customer can now shop the storefront at `supplier_price`
7. Order created from invoice is tagged `source = 'supplier'`

**Supplier Own Inventory:**
Johnny has his own `supplier_products` table independent from our `products` table. His catalog is much larger than ours. Some of his products map to ours (via `product_id` FK or matching `supplier_code`), most don't. The `/supplier/inventory` page gives him full CRUD over his own catalog with stock tracking, categories, and pricing. When he ships product via the box builder, items are selected from HIS inventory and his stock is decremented automatically. On our admin side, when we receive a shipment we add to OUR products stock.

**Supplier Shipments (Box Builder):**
Separate system from `incoming_shipments` (which uses Google Sheets sync). This is the supplier's own tool for documenting what goes in each box.
- Workflow: building (add items + photos) -> sealed (locked manifest) -> shipped (tracking added) -> received (admin marks on arrival)
- Ship Product page searches from `supplier_products` (Johnny's inventory), not our `products` table
- Adding an item to a shipment automatically decrements the supplier's own stock
- Items link to both `supplier_products` (supplier_product_id) and optionally our `products` (product_id via supplier_code matching)
- Admin page at `/admin/supplier-shipments` shows all supplier shipments
- "Receive & Add to Inventory" button marks shipment received AND adds all linked item quantities to product `current_stock`
- "Receive Only" marks received without touching inventory
- Photos provide assurance of contents in case of shipping issues

**Admin Visibility:**
- Orders with `source='supplier'` show a "SUPPLIER" badge (monochromatic, follows style guide) on admin orders page
- Admin nav includes "Supplier Shipments" link to `/admin/supplier-shipments`
- Admin can filter customers by supplier association

**Key Files:**
- `app/actions/supplier-portal.ts` - All server actions: customer CRUD, order queries, shipment builder (create/addItem/removeItem/addPhoto/seal/ship), dashboard stats, admin shipment management (getAllSupplierShipments, markShipmentReceived), supplier product CRUD (getSupplierProducts, createSupplierProduct, updateSupplierProduct, deleteSupplierProduct), supplier product search for shipments
- `app/supplier/` - All supplier portal pages (dashboard, orders, customers, ship-product, inventory)
- `app/supplier/inventory/page.tsx` - Full CRUD inventory management for supplier's own products
- `app/admin/supplier-shipments/page.tsx` - Admin receive and inventory intake
- `app/api/supplier/invoices/route.ts` - Supplier invoice creation/listing API
- `components/supplier-auth-guard.tsx` - Client-side route protection
- `supabase/migrations/20260208_supplier_portal.sql` - Shipment tables schema
- `supabase/migrations/20260208_supplier_products.sql` - Supplier products table schema

**RLS Policies:**
- Suppliers read/write own shipments, items, photos
- Suppliers read customers where `supplier_id` matches
- Suppliers read orders where customers have matching `supplier_id`
- Admins read/write all (existing behavior)
- Storage: suppliers upload to `supplier-shipment-photos` bucket, public read

**Rep Pricing Tiers + Per-Customer Product Overrides:**
Reps create pricing tiers (Gold/Silver/Bronze) with base discount %, assign customers to tiers, and override specific product prices for specific customers.

**Pricing Priority Chain:** `per-product override > tier discount > customer_type pricing > retail`

**Database Schema:**
- `rep_pricing_tiers` - id, rep_id (FK users), name, discount_percentage (DECIMAL), description, is_default (BOOLEAN), timestamps
- `customer_product_pricing` - id, customer_id (FK customers), product_id (FK products), custom_price (DECIMAL), set_by_rep_id (FK users), timestamps, UNIQUE(customer_id, product_id)
- `customers.pricing_tier_id` (UUID, FK -> rep_pricing_tiers.id) - links customer to their pricing tier

**Pages:**
- **Pricing Tiers** (`/rep/pricing-tiers`) - Create/edit/delete tiers with name, discount %, description. Set default tier. View customer count per tier
- **Customer Detail Pricing Tab** (`/rep/customers/[id]` -> Pricing tab) - Assign tier via dropdown, add/remove per-product price overrides with product search

**Price Resolution (used across storefront, cart, product detail):**
1. Check `customer_product_pricing` for per-product override → use exact price
2. Check customer's `pricing_tier_id` → apply tier's `discount_percentage` to base price
3. Fall back to `customer_type` pricing (retail/b2b/supplier_price)
4. Fall back to retail_price

**Key Files:**
- `app/actions/rep-tiers.ts` - All server actions: tier CRUD, customer tier assignment, per-product pricing CRUD, batch price resolution, product search
- `app/rep/pricing-tiers/page.tsx` - Tier management UI
- `supabase/migrations/20260208_rep_pricing_tiers.sql` - Database schema

**RLS Policies:**
- Reps CRUD own tiers and customer pricing entries
- Admins read all tiers and customer pricing
- Service role full access for server-side operations
- Trigger ensures only one default tier per rep

## Payment System

### Stripe On-Ramp (Fiat-to-Crypto)
Allows customers to buy crypto with credit card directly in the checkout flow.

1. **API Endpoints**
   - `/api/stripe-onramp/create-session` - Creates Stripe OnRamp session
   - `/api/stripe-onramp/session-status` - Polls session status

2. **Components**
   - `StripeOnRamp` - Embedded widget component
   - `CheckoutWalletBalance` - Shows wallet balance in checkout with add funds option

3. **Session States** (per Stripe docs)
   - `initialized` - Session created, customer hasn't used it
   - `rejected` - Customer rejected (KYC failure, fraud)
   - `requires_payment` - Customer ready to pay
   - `fulfillment_processing` - Payment complete, crypto being delivered
   - `fulfillment_complete` - Crypto delivered successfully

4. **Network Mapping**
   - ETH, USDC, USDT, DAI, ARB, OP → ethereum network
   - BTC → bitcoin network
   - MATIC → polygon network
   - SOL → solana network

### Cryptocurrency Payments
1. **Order Approval**
   - Admin approves order with amount
   - Assigns wallet for payment
   
2. **Payment Initiation**
   - Fetch real-time ETH price (CoinGecko)
   - Convert USD → Wei
   - Generate EIP-681 payment URL
   - Store expected ETH amount (5 decimals)
   
3. **Auto-Verification** (Fully Automated)
   - Frontend polls every 10 seconds
   - Backend auto-syncs from Etherscan
   - Compares amounts (5 decimal precision)
   - Marks order as paid
   
4. **Precision Handling**
   - Store: 0.00025 ETH (5 decimals)
   - Compare: Round both to 5 decimals
   - Tolerance: 0.00001 ETH

### Transaction Sync
- Automatic via Etherscan API
- Supports ETH and USDC (ERC-20)
- Stores full blockchain data

### Revolut Business API
Full integration with Revolut Business API for business banking operations.

**Library**: `lib/revolut.ts`
- Singleton client with authentication
- Supports both API key and OAuth flows
- Sandbox and production environments

**API Endpoints**:
- `/api/revolut/accounts` - List all business accounts with balances
- `/api/revolut/counterparties` - List/create payment recipients
- `/api/revolut/transactions` - Transaction history with filtering
- `/api/revolut/transfers` - Create payments to counterparties
- `/api/revolut/exchange` - Currency exchange between accounts
- `/api/revolut/transfer-reasons` - Get transfer reason codes
- `/api/revolut/webhooks` - Manage webhook subscriptions

**Admin Dashboard**: `/admin/revolut`
- Overview with multi-currency balance cards
- Account management with full details
- Transfer creation with counterparty selection
- Transaction history with search/filter
- Counterparty management (add individuals/businesses)
- Currency exchange with live rates
- Settings and API status

**Features**:
- Multi-currency account support
- Real-time balance display
- Counterparty bank account management (IBAN, SWIFT, local)
- Transfer with idempotency (request_id)
- Exchange rate preview before execution
- Transaction filtering by type and search
- Revolut brand styling integration

**Environment Variables**:
```
REVOLUT_API_KEY=xxx                    # Direct API key auth
REVOLUT_ENVIRONMENT=sandbox|production # API environment
# OR for OAuth flow:
REVOLUT_CLIENT_ID=xxx
REVOLUT_REFRESH_TOKEN=xxx
```

**Transaction States**:
- `created` - Transaction created
- `pending` - Processing
- `completed` - Successfully completed
- `declined` - Rejected by Revolut
- `failed` - Transaction failed
- `reverted` - Reversed/refunded

**Supported Transfer Types**:
- Bank transfers (SWIFT, SEPA, local)
- Internal Revolut transfers (instant)
- Card transfers

## Shipping System

### AI Receipt Scanner
- **Technology**: Claude 3.5 Sonnet Vision
- **Function**: Extract tracking # and carrier from photos
- **Supports**: iPhone HEIC, all image formats
- **Conversion**: Auto-converts to JPEG via canvas
- **Accuracy**: High confidence extraction

### Live Tracking
- **Provider**: ShipEngine API
- **Features**:
  - Real-time status updates
  - Delivery estimates
  - Exception alerts
  - Full event timeline
  - Current location
- **Display**: TrackingInfo component
- **Refresh**: Manual or auto-reload

## Order Management

### Order Editing (Admin)
- Edit all order items
- Add/remove items
- Update quantities & prices
- Modify shipping address
- Update tracking info
- Add internal notes
- Live total calculations

### Order States
1. **new** - Just created
2. **pending_payment** - Invoice sent, awaiting payment
3. **payment_processing** - Customer initiated crypto payment
4. **paid** - Payment verified
5. **processing** - Fulfillment in progress (picking/packing)
6. **shipped** - Tracking added, shipped
7. **delivered** - Confirmed delivered

### Order Fulfillment Wizard (`/fulfill/[orderId]`)
- Accessible from both admin and supplier order views
- 5-step guided workflow: Review Order → Pick & Pack → Print Packing Slip → Photo Documentation → Ship
- **Pick & Pack**: Checklist of all items with checkboxes, running count, progress bar. Auto-updates order status to `processing`
- **Packing Slip**: Print-optimized layout (`@media print`) with items table, checkbox column, signature lines (Packed By, Date, Quality Checked), QR code for photo uploads
- **Photo Documentation**: Upload from wizard or scan QR code from printed slip. QR opens `/upload-photo/[orderId]` — minimal mobile page, no login required, camera opens automatically. Uses fulfillment token for secure validation
- **Ship**: Enter tracking/carrier, mark shipped, updates order status
- DB fields: `fulfillment_token`, `fulfillment_started_at`, `packed_by`, `pack_verified_at` on orders table
- Server actions in `app/actions/fulfillment.ts`
- Photo upload API: `app/api/orders/[orderId]/upload-photo/route.ts` (tokenized, no auth)

## Key Features

### 1. Crypto Payments
- Real-time price fetching
- Accurate USD → ETH conversion
- EIP-681 payment URLs
- Automatic verification
- Blockchain transaction display

### 2. AI-Powered Tools
- Receipt scanning (Claude Vision)
- Auto-extract tracking numbers
- HEIC/HEIF support
- Image optimization

### 3. Live Tracking
- Real-time carrier updates
- Visual timeline
- Exception handling
- Direct carrier links

### 4. Order Management
- Full editing capability
- Item management
- Address updates
- Tracking management

### 5. Wallet Dashboard
- Business wallet overview on main dashboard
- Multi-token balance display (ETH, USDC, USDT, DAI, MATIC, ARB, OP)
- Recent transactions across all wallets
- Labeled wallet recognition (yellow highlight)
- Clickable transaction cards → detailed modal
- Transaction details: amount, hash, addresses, status
- Etherscan integration
- Link to full wallet management page

### 6. Multi-Token Support
**Supported Tokens:**
- **ETH** - Native Ethereum (18 decimals)
- **USDC** - USD Coin (6 decimals)
- **USDT** - Tether USD (6 decimals)
- **DAI** - Dai Stablecoin (18 decimals)
- **MATIC** - Polygon token on Ethereum (18 decimals)
- **ARB** - Arbitrum token (18 decimals)
- **OP** - Optimism token (18 decimals)

**Features:**
- Dynamic balance fetching for all tokens
- Send any supported token to any address
- Token swap via Uniswap integration
- QR code generation for receiving any token
- Payment request QR with token selection
- Transaction monitoring for all tokens
- Automatic balance display (hides zero balances except ETH/USDC)

### 7. Customizable Theme System
**Database-Driven Themes:**
- All color schemes stored in Supabase `themes` table
- 4 pre-configured themes: Dark Mode (active), Light Mode, Custom Theme 1, Custom Theme 2
- Admin-only theme editing through `/admin/themes` UI
- Live preview of color changes
- Support for RGB, HSL, and HEX color formats
- Instant theme switching for all users

**Color Format Support:**
- RGB colors for backgrounds, cards, text (format: "17 24 39")
- HSL colors for sidebar elements (format: "0 0% 100%")
- HEX colors for brand accents (format: "#fff95e")

**Theme Structure:**
- Background colors (primary, secondary)
- Card colors (background, hover, border)
- Text colors (primary, secondary, muted)
- Sidebar colors (8 variations for shadcn/ui)
- Brand accent colors (yellow, purple, red, pink, blue, green, orange, gray)

**Admin Features:**
- Visual color preview in editing UI
- One-click theme activation
- Duplicate protection for system themes
- Real-time application across all users
- Persistent user preferences

**Technical Implementation:**
- ThemeContext provides theme data to all components
- CSS variables dynamically applied via JavaScript
- Backwards compatible with existing Tailwind classes
- API endpoints for CRUD operations
- RLS policies for admin-only editing

### 8. Sales Rep System
**Customer Assignment:**
- Admins assign customers to sales reps from customer profile
- Reps can only view/manage their assigned customers
- Customer assignment tracked in customers.rep_id field

**Rep Dashboard:**
- View all assigned customers
- See recent orders from their customers (last 30 days)
- Track order status breakdown
- Monitor open support tickets
- Monthly order metrics and growth tracking

**Support Ticket System:**
- Reps create tickets on behalf of customers
- Select customer from dropdown (only assigned customers visible)
- Optional order selection from customer's order history
- Order details auto-filled (read-only): order #, date, status, total, products
- Assign to specific admin OR notify entire admin team
- Priority levels (low, medium, high, urgent)
- Status tracking (open, in_progress, waiting_on_customer, resolved, closed)
- Ticket history view with status updates

**Customer Support Wizard:**
- Guided flow for customers to submit support requests
- Category-based intake: Missing Delivery, Late Delivery, Damaged/Broken, Adverse Reaction, General Complaint
- Structured questions per category capture relevant details
- Answers stored as JSON in ticket_messages with `source: support_wizard` metadata
- Supports photo uploads, date/time pickers, and multi-choice questions

**Admin Support Dashboard (`/admin/support`):**
- Lists all support tickets with filters (status, priority, search)
- Shows auto-generated issue summary from wizard answers in ticket list
- Stats overview: total tickets, open, in progress, urgent
- Click through to ticket detail page

**Ticket Detail Page (`/admin/support/[id]`):**
- Full conversation thread with customer
- Collapsible "Customer's Issue Summary" card showing parsed wizard answers
- Human-readable summary generated from wizard answers
- Detailed answer grid for quick reference
- Status/priority dropdowns for quick updates
- Message thread with customer/admin/system messages

**AI Response Generator:**
- Admin selects intent before generating AI response:
  - Get More Info - Ask clarifying questions
  - Request Evidence - Ask for photos/screenshots
  - Offer Replacement - Send new product
  - Offer Refund - Process refund
  - Offer Promo Code - Discount or credit
  - Decline Request - Politely decline
- AI uses full ticket context: customer info, order details, wizard answers, conversation history
- Generated response populates reply textarea for admin review/edit
- Streaming response with ability to stop generation

**API Endpoint (`/api/admin/support/ai-response`):**
- POST endpoint accepting ticketId and intent
- Fetches complete ticket context from database
- Uses Claude claude-sonnet-4-20250514 for response generation
- Intent-specific prompts guide response style
- Returns streaming response via Vercel AI SDK

**Commission Management (Admin-Only):**
- Set custom commission rate per rep (hidden from reps)
- Commission calculated on delivered orders only
- Based on order subtotal (before shipping/tax)
- Admin commission report generator
- Filter by date range
- Detailed order breakdown with commission per order
- Generate and send commission statements to reps
- Commission statements stored with full history

**RLS Security:**
- Reps can only view customers assigned to them
- Reps can only see orders from their assigned customers
- Reps can create tickets only for their customers
- Reps can view their own tickets
- Commission rates hidden from rep view
- Admin-only access to commission calculations and reports

## Environment Variables

### Required
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx (server-side only)
ANTHROPIC_API_KEY=xxx (Claude AI)
SHIPENGINE_API_KEY=xxx (Tracking)
ETHERSCAN_API_KEY=xxx (Optional, for better limits)
```

### Optional
- `COINGECKO_API_KEY` - For higher rate limits

## Deployment

### Platform
- **Hosting**: Vercel
- **Database**: Supabase Cloud
- **Build**: Vite (client) + Vercel Functions (API)

### Process
1. Push to GitHub main branch
2. Vercel auto-deploys
3. Runs client build
4. Deploys serverless functions
5. Updates environment

## Development

### Local Setup
```bash
# Install dependencies (using pnpm)
pnpm install

# Start development servers
# Terminal 1 - Backend (Vercel CLI)
vercel dev

# Terminal 2 - Frontend
cd client && pnpm dev

# Build for production
cd client && pnpm build
```

### Environment Variables
```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Chat
ANTHROPIC_API_KEY=sk-ant-your-key

# Payments
STRIPE_SECRET_KEY=sk_test_your_key

# Blockchain
INFURA_PROJECT_ID=your_infura_id
```

## Key Patterns

### API Endpoints
- All in `/api` folder
- Each file = serverless function
- Use `verifyAuth()` or `verifyAdmin()`
- Service role client for RLS bypass
- CORS enabled

### Frontend
- TypeScript strict mode
- Tailwind for styling
- Toast notifications
- Loading states
- Error handling

### Database
- RLS policies on all tables
- Service role for admin operations
- Foreign keys with cascades
- Indexes on lookups

## Security

### Authentication
- Supabase Auth with email verification
- JWT-based session management
- Row Level Security (RLS) policies enforced at database level
- Admin role verification via `verifyAdmin()` function
- User role verification via `verifyAuth()` function

### Data Protection
- HTTPS everywhere
- Environment variable security (all secrets in Vercel env)
- SQL injection prevention via parameterized queries
- XSS protection via React's built-in escaping
- CSRF tokens for state-changing operations
- API key security (Anthropic API key server-side only)

### AI Chat Security
- RLS policies scope chats to user_id
- Users can only access their own sessions and messages
- Public chat visibility option with proper access controls
- Document artifacts tied to user ownership

## Performance Optimizations

### Frontend
- **Code splitting** with React.lazy() for all pages
- **Manual vendor chunking** for optimal caching:
  - `react-vendor` - React core libraries (shared)
  - `ai-vendor` - AI SDK packages (122kB → 40kB gzipped)
  - `markdown-vendor` - Markdown rendering
  - `ui-vendor` - Animations and UI utilities
- **Phased data loading** on dashboard:
  - Phase 1: Critical data loads first (analytics, orders)
  - Phase 2: Wallet list loads after 100ms delay
  - Phase 3: Blockchain balances fetch in parallel, non-blocking
- Asset optimization and responsive images
- Lazy loading of components
- **Result**: 85% reduction in AI Chat bundle size, instant dashboard rendering

### Backend
- Serverless function cold start optimization
- Database query optimization with indexes
- Connection pooling via Supabase
- Progressive data fetching strategies
- Server-Sent Events (SSE) for AI streaming

## Recent Major Enhancements

### Supabase Admin Panel (December 2025)
- Comprehensive Supabase management in admin dashboard
- **Users Table Tab**: Live feed, search, delete from users table
- **Auth Users Tab**: Manage auth.users with actions (send password reset, magic link, delete)
- **Providers Tab**: View enabled auth providers and signup settings
- **Email Templates Tab**: Design email templates with WYSIWYG editor
- TipTap-based rich text editor adapted from p2 project blog editor
- Insert Supabase variables with one-click buttons ({{ .ConfirmationURL }}, {{ .Email }}, etc.)
- Three view modes: Design, HTML, Preview
- Export templates as HTML files
- Template types: Confirmation, Invite, Magic Link, Recovery, Email Change
- Located at `/admin/supabase`

### Customizable Theme System (October 2025)
- Database-driven color scheme management
- Admin UI for editing themes without code
- 4 pre-configured themes (Dark, Light, 2 Custom)
- Support for RGB, HSL, and HEX color formats
- Live preview and instant activation
- Integrated with existing CSS variable system

### AI Chat System (October 2024)
- Integrated Anthropic Claude 3.5 Sonnet
- Real-time streaming chat interface
- Persistent chat history with Supabase
- 3-panel layout with sidebar navigation
- Markdown + code syntax highlighting
- 85% bundle size reduction via code splitting

### Performance Optimizations (October 2024)
- Manual vendor chunk splitting
- Phased dashboard data loading
- Progressive wallet balance fetching
- Non-blocking blockchain calls

## Migration Status (November 2025)

### ✅ Restored Features
- **Cart System** - Fixed auth.users.id reference, cart_image SVG support
- **Order Creation** - POST /api/orders endpoint
- **Payment Flow** - Complete crypto payment system
  - Payment Initiation - /api/orders/initiate-payment with ETH price fetching
  - Payment Verification - /api/orders/verify-payment with blockchain sync
  - Payment Reset - /api/orders/reset-payment with safety checks
  - Wallet Assignment - /api/orders/assigned-wallet
- **Admin System** - Complete admin functionality
  - Orders management - /api/admin/orders (list, update, mark-shipped)
  - Products management - /api/admin/products (CRUD operations)
  - Customers management - /api/admin/customers (list, update, assign reps)
  - AI Receipt Scanning - /api/admin/scan-shipping-receipt (Claude Vision)
- **Wallet Management** - Full crypto wallet features
  - Wallet List - /api/wallet/list
  - Transaction Sync - /api/wallet/sync-transactions (Etherscan)
  - Multi-token Balances - /api/wallet/balance (ETH, USDC, USDT, DAI, MATIC, ARB, OP)
- **Shipping System** - Live tracking with ShipEngine (/api/tracking/[trackingNumber])
- **Customer Features** - Order history (/api/orders/my-orders)
- **Authentication** - Auth utilities with role verification

### ❌ Still Missing
- **AI Chat** - Claude integration for customer support
- **Crypto Assistant** - Onboarding guidance (/api/crypto-assistant/chat)
- **Theme System** - Database-driven color management UI
- **UI Components** - Admin dashboard, wallet dashboard, theme editor

### 🚧 Next Steps
- Restore crypto assistant endpoint
- Rebuild admin dashboard UI
- Implement wallet management UI
- Add theme customization interface

## UI Style Guide

### Design System Overview
The application uses a **dark glassmorphism** aesthetic with the following core principles:
- Deep black backgrounds (`oklch(0.05 0 0)` to `oklch(0.1 0 0)`)
- Semi-transparent white overlays for depth
- Subtle borders with `border-white/10` to `border-white/20`
- `backdrop-blur-xl` for frosted glass effects
- Large rounded corners (`rounded-2xl` to `rounded-3xl`)
- Smooth transitions (`transition-all duration-300` to `duration-500`)

### Card Component Variants
The `Card` component (`components/ui/card.tsx`) supports three variants to prevent double-wrapping issues:

```tsx
// Default - solid dark background (for forms, dialogs, solid containers)
<Card>
  {/* Uses bg-card which is a solid dark color */}
</Card>

// Glass - glassmorphism effect (for stats, dashboard cards, hero elements)
<Card variant="glass">
  {/* Uses bg-white/5 backdrop-blur-xl border-white/10 */}
</Card>

// Transparent - no background (for wrapping other styled components)
<Card variant="transparent">
  {/* No background, no border, no shadow */}
  <OrderList /> {/* OrderList has its own styling */}
</Card>
```

**⚠️ CRITICAL: Avoiding Double-Wrap Issues**
The most common styling bug is nesting elements with backgrounds:
- ❌ `Card` wrapping `OrderCard` (both have backgrounds → appears white/gray)
- ❌ `Card` wrapping glassmorphism elements (layers compound)
- ✅ Use `variant="transparent"` when wrapping styled components
- ✅ Use plain `<section>` or `<div>` tags instead of Card for layout-only wrappers

### Glassmorphism Patterns

**Navigation/Action Cards (Admin Dashboard, Customer Dashboard):**
```tsx
// Full glassmorphism card with hover effects
<Link
  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl transition-all duration-500 hover:bg-white/10 hover:border-white/20"
>
  {/* Noise texture overlay */}
  <div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
  
  {/* Glow effect */}
  <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl transition-all duration-500 group-hover:bg-white/10" />
  
  {/* Content with z-10 to appear above effects */}
  <div className="relative z-10">...</div>
</Link>
```

**Stats Cards:**
```tsx
<Card variant="glass" className="hover:bg-white/[0.12] transition-all duration-300">
  <CardHeader className="pb-6">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="h-5 w-5 text-white/50" />
      <CardDescription className="text-sm font-medium uppercase tracking-wider text-white/50">
        Label
      </CardDescription>
    </div>
    <CardTitle className="text-5xl md:text-6xl font-bold tracking-tight text-white">
      {value}
    </CardTitle>
  </CardHeader>
</Card>
```

**List Item Cards (Orders, Inventory Items):**
```tsx
<div className="rounded-2xl bg-white/5 border border-white/10 p-6 cursor-pointer hover:bg-white/10 transition-all duration-300 group">
  {/* Content */}
</div>
```

**Collapsible/Expandable Cards:**
```tsx
<Collapsible className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10">
  <CollapsibleTrigger>...</CollapsibleTrigger>
  <CollapsibleContent>
    <div className="border-t border-white/10 p-6 md:p-8">
      {/* Expanded content - NO additional background needed */}
    </div>
  </CollapsibleContent>
</Collapsible>
```

### Product Card Styling
Product cards use dynamic color theming from their category:

```tsx
<Card className="border-0 bg-white/[0.08] backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] aspect-[6/9]">
  {/* Radial gradient using product color */}
  <div
    className="absolute inset-0 opacity-20 group-hover:opacity-40"
    style={{ background: `radial-gradient(circle at center, ${productColor}, transparent 70%)` }}
  />
  
  {/* Inner content boxes */}
  <div className="bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-4">
    {/* Rating bars, etc */}
  </div>
</Card>
```

### Color Palette

**Backgrounds:**
- Page background: `bg-background` (uses CSS var)
- Card solid: `bg-card` (dark gray, use via Card default variant)
- Glass light: `bg-white/5` or `bg-white/[0.05]`
- Glass medium: `bg-white/[0.08]`
- Glass dark: `bg-white/10`
- Hover states: +0.02-0.05 opacity (e.g., `hover:bg-white/[0.12]`)
- Inner sections: `bg-black/70` or `bg-black/60`

**Borders:**
- Subtle: `border-white/10`
- Hover/Active: `border-white/20`
- Accent: `border-{color}/30` (e.g., `border-green-500/30`)

**Text:**
- Primary: `text-white`
- Secondary: `text-white/70` or `text-white/60`
- Muted: `text-white/50`
- Disabled: `text-white/40` or `text-white/30`

**Status Colors:**
- Success: `text-green-400`, `bg-green-500/20`, `border-green-500/50`
- Warning: `text-yellow-400`, `bg-yellow-500/20`, `border-yellow-500/50`
- Error: `text-red-400`, `bg-red-500/20`, `border-red-500/50`
- Info: `text-blue-400`, `bg-blue-500/20`, `border-blue-500/50`

### Typography Scale

**Headers:**
- Page title: `text-5xl md:text-6xl font-bold tracking-tighter`
- Section header: `text-3xl md:text-4xl font-bold`
- Card title: `text-2xl font-bold tracking-tight`
- Subsection: `text-lg font-semibold`

**Labels:**
- Section label: `text-sm font-bold uppercase tracking-widest text-white/40`
- Form label: `text-sm font-medium text-white/50`
- Stat label: `text-sm font-medium uppercase tracking-wider text-white/50`

**Body:**
- Primary: `text-base text-white`
- Secondary: `text-base text-white/60`
- Small: `text-sm text-white/50`
- Tiny: `text-xs text-white/40`

### Spacing & Layout

**Container:**
```tsx
<main className="container mx-auto px-6 md:px-20 py-12 md:py-24 max-w-[1400px]">
```

**Section spacing:**
- Between major sections: `mb-16 md:mb-24`
- Section header to content: `space-y-8`
- Between cards in grid: `gap-6` or `gap-8`

**Card padding:**
- Large cards: `p-8` to `p-10`
- Medium cards: `p-6`
- Small/inner cards: `p-4`

### Interactive Elements

**Buttons:**
```tsx
// Primary (solid white)
<Button className="rounded-xl bg-white text-black hover:bg-white/90 h-12 px-6">

// Secondary (glass)
<Button variant="outline" className="rounded-xl border-white/20 text-white hover:bg-white/10">

// Ghost
<Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
```

**Inputs:**
```tsx
<Input className="rounded-xl bg-white/5 border-white/10 text-white placeholder:text-white/30 h-12" />
```

**Select:**
```tsx
<select className="h-12 px-6 rounded-2xl bg-white/[0.05] border-0 text-white hover:bg-white/[0.08] cursor-pointer">
```

### Animation & Transitions

**Standard transition:**
```tsx
className="transition-all duration-300"
```

**Smooth hover:**
```tsx
className="transition-all duration-500 hover:bg-white/10"
```

**Framer Motion entry:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: index * 0.05 }}
>
```

### CSS Utilities (from globals.css)

**Glassmorphism shorthand:**
```tsx
className="glass"        // bg-white/15 backdrop-blur-xl border border-white/10 shadow-2xl
className="glass-hover"  // hover:bg-white/20 hover:border-white/20 transition-all duration-300
```

**Noise texture:**
```tsx
<div className="pointer-events-none absolute inset-0 bg-noise opacity-10" />
```

**Hide scrollbar:**
```tsx
className="no-scrollbar"
```

### Common Mistakes to Avoid

1. **Double backgrounds**: Never wrap a styled component in a Card without `variant="transparent"`
2. **Semi-transparent stacking**: `bg-white/[0.08]` inside `bg-white/[0.08]` = lighter appearance
3. **Missing z-index**: Content over gradient/blur effects needs `relative z-10`
4. **Hardcoded colors**: Use CSS variables or Tailwind theme colors
5. **Inconsistent radii**: Stick to `rounded-xl`, `rounded-2xl`, or `rounded-3xl`

## Legal Pages

### Privacy Policy (`/privacy`)
Comprehensive privacy policy page with dark glassmorphism design matching store aesthetic.

**Features:**
- 15-section legal document covering all privacy requirements
- Responsive typography with section numbering
- Highlighted commitment section (emerald accent)
- "We Will Never Sell" section (red accent)
- California CCPA/CPRA compliance section
- Contact section with support email
- SEO metadata included
- Uses GlobalNav and standard footer

**Styling:**
- Dark gradient background (`from-black via-black to-zinc-950`)
- Glass cards (`bg-white/[0.03] rounded-xl border border-white/10`)
- Emerald bullet points for lists
- Red X marks for "never" items
- Numbered section badges (`bg-white/10 rounded-full`)

---

## Mobile App (React Native / Expo)

A companion mobile app for staff and admin to manage orders on the go.

### Tech Stack
- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Push Notifications**: Expo Notifications
- **Camera/Scanner**: Expo Camera

### Project Structure
```
mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Home with quick actions
│   │   ├── orders.tsx     # Orders list
│   │   ├── inventory.tsx  # Inventory management
│   │   └── settings.tsx   # App settings
│   ├── orders/[id].tsx    # Order details
│   ├── scanner.tsx        # QR code scanner
│   ├── send-invoice.tsx   # Invoice modal
│   ├── create-order.tsx   # Order creation flow
│   └── login.tsx          # Authentication
├── src/
│   ├── hooks/             # useNotifications
│   ├── lib/               # Supabase client
│   ├── store/             # Zustand stores
│   └── types/             # TypeScript types
├── app.json               # Expo config
└── package.json
```

### Features
- **Push Notifications**: Real-time order alerts via Expo Push
- **Quick Actions**: One-tap Send Invoice, Create Order, Scan QR
- **QR Scanner**: Scan product barcodes for inventory lookup/update
- **Order Management**: View, search, filter, update orders
- **Real-time Sync**: Supabase real-time subscriptions for live updates
- **Dark Theme**: Matches web dashboard glassmorphism aesthetic

### Running the App
```bash
cd mobile
pnpm install
pnpm start  # Opens Expo dev menu
```

---

## Future Enhancements

- [ ] AI Artifact panel (code editor, spreadsheet viewer)
- [ ] Email notification system
- [ ] Multi-currency support
- [x] Mobile app (React Native) ✅
- [ ] AI-powered product recommendations
- [ ] Chat history search and export
- [ ] Tool calling for AI (code execution, data analysis)
- Inventory management
- Webhook integrations