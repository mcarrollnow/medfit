# Update Log

## [2026-02-09] - [FEATURE] Order Fulfillment Wizard

Built a 5-step order fulfillment wizard accessible from both admin and supplier views. Guides the user through reviewing the order, picking/packing items with a checklist, printing a packing slip with QR code, uploading verification photos, and marking the order as shipped.

### New Features
- **Fulfillment Wizard** (`/fulfill/[orderId]`): 5-step guided workflow — Review Order, Pick & Pack (checkboxes for each item), Print Packing Slip, Photo Documentation, Ship. Progress bar tracks completion. Resumable if interrupted.
- **Printable Packing Slip**: Print-optimized layout with company header, order details, items table with checkbox column, signature lines (Packed By, Date, Quality Checked), and QR code for photo uploads. Uses `@media print` CSS — only the slip prints.
- **QR Code Photo Upload** (`/upload-photo/[orderId]`): Minimal mobile-first page (no auth required). Scan QR from printed packing slip, camera opens automatically, photos attach directly to the order. Uses secure fulfillment token for validation.
- **Fulfill Buttons**: Added to admin orders list (clipboard icon), admin order detail page ("Fulfill Order" button), and supplier orders page ("Fulfill" button on each order card). Only shows for unfulfilled orders.

### Database Changes
- Added `fulfillment_token`, `fulfillment_started_at`, `packed_by`, `pack_verified_at` columns to `orders` table
- Index on `fulfillment_token` for fast QR upload validation
- RLS policies on `order_photos` for admin/supplier access and public insert (for QR uploads)

### Files Created
- `app/(fulfillment)/fulfill/[orderId]/page.tsx` — Main wizard with all 5 steps and print packing slip
- `app/(fulfillment)/layout.tsx` — Layout with GlobalNav
- `app/(minimal)/upload-photo/[orderId]/page.tsx` — Public QR scan photo upload page
- `app/(minimal)/layout.tsx` — Minimal layout (no nav/footer)
- `app/api/orders/[orderId]/upload-photo/route.ts` — Tokenized photo upload API
- `app/actions/fulfillment.ts` — Server actions (getOrderForFulfillment, generateFulfillmentToken, updateFulfillmentStep, saveOrderPhoto, validateFulfillmentToken, getOrderPhotos)
- `supabase/migrations/20260209_fulfillment.sql` — Database migration

### Files Modified
- `app/admin/orders/page.tsx` — Added ClipboardList fulfill icon button on each order card
- `app/admin/orders/[id]/page.tsx` — Added "Fulfill Order" button in shipping section
- `app/supplier/orders/page.tsx` — Added "Fulfill" button on each order header

---

## [2026-02-08] - [FEATURE] Instant Product Autocomplete on Ship Product

Replaced the debounced server-side search on the Ship Product page with instant local filtering. All active supplier products load upfront when the page mounts, then typing filters them in-memory with zero latency. The dropdown also shows all products when the search field is focused (before typing), so the supplier can browse and pick without typing anything.

### Changes
- `app/supplier/ship-product/page.tsx` — Loads all active `supplier_products` on mount via `getSupplierProducts`. Search input now filters locally instead of calling `searchSupplierProductsForShipment` with 300ms debounce. Focus shows all products, typing narrows instantly. After adding an item, search re-focuses for quick successive adds.

---

## [2026-02-08] - [FEATURE] Supplier Own Inventory System

Built a separate inventory system for the supplier (Johnny). His product catalog is independent from our `products` table — he has his own product codes, quantities, pricing, and categories. Ship Product now pulls from his own inventory and auto-decrements his stock.

### New Features
- **Supplier Inventory Management** (`/supplier/inventory`): Full CRUD for Johnny's own product catalog. Add/edit/delete products with name, supplier code, description, category, unit price, stock, restock level, active toggle. Search and filter by category. Stats overview (total products, active, low stock, stock value). Product detail view with all info. Auto-links to our catalog when supplier codes match
- **Ship Product Integration**: Ship Product page now searches from `supplier_products` (Johnny's inventory) instead of our `products` table. Adding items auto-decrements Johnny's stock. Items link to both his `supplier_products` and optionally our `products` via supplier code
- **Product Mapping**: `supplier_products.product_id` (nullable FK) optionally links to our `products` table so we know which of his products correspond to ours

### Database Changes
- Created `supplier_products` table (id, supplier_id FK users, name, supplier_code, description, category, unit_price, current_stock, restock_level, image_url, is_active, product_id FK products nullable, timestamps)
- Unique constraint on (supplier_id, supplier_code) — codes must be unique per supplier
- Added `supplier_product_id` column to `supplier_shipment_items` (FK supplier_products) — links shipment items to supplier's inventory
- RLS policies for supplier CRUD on own products, admin read/write all
- Indexes on supplier_id, supplier_code, product_id, category, is_active

### Files Created
- `supabase/migrations/20260208_supplier_products.sql` — Database migration
- `app/supplier/inventory/page.tsx` — Full CRUD inventory management page (replaced read-only view)

### Files Modified
- `app/actions/supplier-portal.ts` — Added SupplierProduct type, supplier product CRUD actions (get, create, update, delete), category listing, shipment product search, stock decrement. Updated `addItemToShipment` to accept `supplierProductId` and auto-decrement supplier stock
- `app/supplier/ship-product/page.tsx` — Updated to search from `supplier_products` instead of `products`, passes `supplierProductId` when adding items to shipments

---

## [2026-02-08] - [FEATURE] Rep Pricing Tiers + Per-Customer Product Overrides

Added a pricing tier system for sales reps. Reps can create tiers (Gold/Silver/Bronze) with base discount percentages, assign customers to tiers, and override specific product prices for specific customers.

### Pricing Priority Chain
`per-product override > tier discount > customer_type pricing > retail`

### New Features
- **Pricing Tier Management** (`/rep/pricing-tiers`): Create, edit, delete tiers with name, discount %, description. Set default tier for new customers. See customer count per tier
- **Customer Tier Assignment**: On `/rep/customers/[id]` Pricing tab — dropdown to assign customer to a tier, shows current tier details
- **Per-Product Price Overrides**: On `/rep/customers/[id]` Pricing tab — search products, set custom price per product per customer. Overrides take highest priority
- **Storefront Pricing**: Customers with tiers see discounted prices on the storefront catalog and product detail pages
- **Cart API Pricing**: `display_price` in cart reflects tier discounts and per-product overrides
- **Checkout Integration**: Tier pricing is baked into `display_price`, so existing discount system (promo codes, rep-assigned discounts) stacks on top correctly

### Database Changes
- Created `rep_pricing_tiers` table (id, rep_id, name, discount_percentage, description, is_default, timestamps)
- Created `customer_product_pricing` table (id, customer_id, product_id, custom_price, set_by_rep_id, timestamps, UNIQUE on customer_id+product_id)
- Added `pricing_tier_id` column to `customers` table (FK to rep_pricing_tiers)
- RLS policies for rep access to own tiers and customer pricing
- Trigger to ensure only one default tier per rep
- Auto-update `updated_at` triggers

### Files Created
- `supabase/migrations/20260208_rep_pricing_tiers.sql` — Database migration
- `app/actions/rep-tiers.ts` — Server actions: tier CRUD, customer tier assignment, per-product pricing CRUD, batch price resolution, product search
- `app/rep/pricing-tiers/page.tsx` — Tier management page (Chronicles glassmorphism style)

### Files Modified
- `app/rep/page.tsx` — Added "Pricing Tiers" navigation card to rep dashboard
- `app/rep/customers/[id]/page.tsx` — Added Pricing tab with tier dropdown and per-product override section
- `app/api/cart/route.ts` — Updated to fetch and apply tier discounts and per-product overrides to `display_price`
- `app/page.tsx` — Updated storefront to detect and apply tier discounts and product overrides in pricing
- `app/(public)/products/[id]/page.tsx` — Updated product detail `getPrice()` to apply tier and override pricing

---

## [2026-02-08] - [FEATURE] Supplier Portal Buildout - Full Experience

Major expansion of the supplier portal. Johnny's customers now get the full storefront experience at supplier pricing, with orders auto-tagged on the admin dashboard. Supplier gets order management, customer management, and a Ship Product box builder.

### New Features
- **Supplier Orders Dashboard** (`/supplier/orders`): View all customer orders with status filters, search, expandable details, and inline note editing
- **Supplier Customer Management** (`/supplier/customers`): Add, edit, and manage customers. New customers get real accounts with set-password emails
- **Ship Product Box Builder** (`/supplier/ship-product`): Build shipment manifests with product search, keypad quantity entry, photo documentation, seal/ship workflow
- **Enhanced Supplier Dashboard** (`/supplier`): Key metrics (active orders, customers, revenue, shipments), Ship Product CTA, recent orders feed, quick action grid
- **Customer-Type-Based Pricing**: `supplier_customer` type sees `supplier_price` throughout storefront, cart, and checkout
- **Auto-Tagging**: Orders from supplier customers are automatically tagged with `source='supplier'` and linked to the supplier
- **Admin SUPPLIER Badge**: Orders from supplier pipeline show a purple "SUPPLIER" badge on the admin orders page
- **Supplier Shipment System**: Separate from incoming_shipments - supplier builds box manifests with items and photos before shipping

### Database Changes
- Added `supplier_id` column to `customers` table
- Added `source` and `supplier_id` columns to `orders` table
- Created `supplier_shipments`, `supplier_shipment_items`, `supplier_shipment_photos` tables
- RLS policies for supplier access to own customers, orders, and shipments
- Storage bucket `supplier-shipment-photos` for shipment documentation

### Files Created
- `supabase/migrations/20260208_supplier_portal.sql` — Database migration
- `app/actions/supplier-portal.ts` — All supplier CRUD server actions (customers, orders, shipments, dashboard stats)
- `app/supplier/orders/page.tsx` — Supplier orders dashboard
- `app/supplier/customers/page.tsx` — Supplier customer management
- `app/supplier/ship-product/page.tsx` — Shipment box builder with search, keypad, photos

### Files Modified
- `app/supplier/page.tsx` — Enhanced dashboard with stats, Ship Product CTA, recent orders
- `components/global-nav.tsx` — Added Orders, Customers, Ship Product to supplier nav
- `app/api/orders/route.ts` — Auto-tag supplier orders based on customer_type
- `app/api/cart/route.ts` — Set display_price based on customer type (supplier_price for supplier_customer)
- `app/page.tsx` — Customer-type-aware pricing on storefront
- `app/api/admin/orders/route.ts` — Include source field in admin orders query
- `app/admin/orders/page.tsx` — SUPPLIER badge on supplier-sourced orders

## [2026-02-08] - [FEATURE] Invoice Onboarding, Product Pricing Fix, Admin Supplier Shipments

### Invoice-Based Customer Onboarding
- Invoices can now carry a `supplier_id` — when a supplier creates an invoice, the new customer is auto-created as `supplier_customer` type
- Modified invoice creation API to accept `supplier_id` and tag resulting orders as `source='supplier'`
- Modified invoice setup API (account creation) to create `supplier_customer` accounts when invoice has `supplier_id`
- Created `/api/supplier/invoices` API so Johnny can create and list invoices from his dashboard
- Added `supplier_id` column to `authorize_net_invoices` table

### Product Detail Page Pricing
- Fixed `/products/[id]` to detect customer type and show correct price (`supplier_price` for supplier customers, `b2b_price` for B2B)
- All variant selectors and price displays now use the customer-type-aware `getPrice()` helper

### Admin Supplier Shipments
- New admin page at `/admin/supplier-shipments` to view all supplier shipments
- "Receive & Add to Inventory" one-click button that marks shipment received and adds all item quantities to product stock
- "Receive Only" option for when you want to inspect before adding to inventory
- Shows shipment contents, photos, tracking info, and status
- Added to admin navigation as "Supplier Shipments"

### Files Created
- `app/admin/supplier-shipments/page.tsx`
- `app/api/supplier/invoices/route.ts`

### Files Modified
- `app/api/authorize-net/invoices/route.ts` — accepts supplier_id, tags orders
- `app/api/invoice/setup/route.ts` — creates supplier_customer accounts
- `app/(public)/products/[id]/page.tsx` — customer-type-aware pricing
- `app/actions/supplier-portal.ts` — added admin shipment functions
- `components/global-nav.tsx` — added Supplier Shipments to admin nav
- `supabase/migrations/20260208_supplier_portal.sql` — added supplier_id to invoices

## [2026-02-07] - [FEATURE] Admin "View As" / User Impersonation for Debugging

Added a powerful debugging tool that allows admins to view the site as any user role or specific customer. Essential for troubleshooting issues and understanding the customer experience.

### New Features
- **View As Page** (`/admin/view-as`): Central hub for impersonation with two modes:
  - **Quick View**: Instantly switch to Customer, Rep, or Supplier view
  - **User Impersonation**: Search and select a specific user to see exactly what they see
- **Impersonation Banner**: Persistent orange banner shown when impersonating, with "Exit to Admin" button
- **Impersonation Store**: Zustand store that persists impersonation state across page navigation
- **Admin Nav Updates**: Added "View As" and "Supplier" links to admin navigation
- **Admin Dashboard**: Added "Debug & Testing" category with View As and Supplier Portal links

### How It Works
- Impersonation is UI-only — your actual auth session remains as admin (secure)
- The banner stays visible at all times when impersonating, so you always know you're in debug mode
- Click "Exit to Admin" in the banner to return to normal admin view
- State persists in localStorage, so you stay in impersonation mode across page refreshes

### Files Created
- `lib/impersonation-store.ts` — Zustand store for impersonation state
- `app/admin/view-as/page.tsx` — View As admin page with search and role switching
- `components/impersonation-banner.tsx` — Persistent banner component

### Files Modified
- `app/layout.tsx` — Added ImpersonationBanner to root layout
- `components/global-nav.tsx` — Added View As & Supplier links, adjusted spacing for banner
- `app/admin/page.tsx` — Added Debug & Testing category with View As and Supplier links

---

## [2026-02-06] - [FEATURE] QR Code Order Photos with Dual-Purpose Scan Flow

Added a QR code URL to shipping labels that enables both staff photo capture and customer photo viewing.

### New Features
- **Smart QR Route** (`/order-photos/[orderNumber]`): Single URL that detects user role and shows the appropriate experience
  - Admin/Rep: Full upload UI with auto-camera trigger when no photos exist
  - Customer: Read-only photo gallery (ownership verified via customer_id)
  - Unauthenticated: Redirects to login with return URL
- **Order Photos API** (`/api/orders/[orderNumber]/photos`): Role-based API endpoint that accepts order_number (not just UUID), with read-only access for customers and full CRUD for staff
- **Customer Photo Gallery** (`components/customer/order-photo-gallery.tsx`): Read-only gallery with lightbox for customer-facing photo viewing
- **QR Code URL in Label Data**: `qr_code_url` field added to `ShippingLabelData` interface, auto-populated in `createShippingLabelJob()`
- **Auto-Camera on Scan**: When staff scan the QR code and no photos exist, the camera input triggers automatically
- **Login Redirect Support**: Login page now respects `?redirect=` query parameter, redirecting users back to their intended destination after authentication

### Files Created
- `app/order-photos/[orderNumber]/page.tsx` — Smart route page
- `app/api/orders/[orderNumber]/photos/route.ts` — Role-based photos API
- `components/customer/order-photo-gallery.tsx` — Customer read-only gallery

### Files Modified
- `lib/print-job-helpers.ts` — Added `qr_code_url` to interface and label data
- `components/admin/order-photos.tsx` — Added `orderNumber`, `autoOpenCamera` props; uses new API when orderNumber provided
- `app/login/page.tsx` — Added redirect query param support to all login flows

### Print-Agent Note
The print-agent (separate Electron repo) needs to read `label_data.qr_code_url` and render a QR code on the physical label.

## [2026-02-06] - [REFACTOR] Rename /landing route to /login

- Moved `app/landing/page.tsx` to `app/login/page.tsx` — the auth/login page now lives at `/login`
- Updated all route references across the codebase: proxy middleware, auth-provider, auth-store, global-nav, site-header, admin-header, supplier-auth-guard, checkout, support pages, forgot-password, register, set-password, maintenance, and landing settings revalidation
- Previously `/login` didn't exist as a page (only as an API route), causing 404s on logout redirects
- The `/login` route was already in `MAINTENANCE_BYPASS_PATHS` and the middleware unauthenticated redirect, so those required no changes

---

## [2026-02-04] - [FEATURE] Secure Invoice Access & Auto Customer Account Creation

Invoices are now secured behind authentication. New customers receiving an invoice are automatically prompted to create an account (just a password) before viewing. Existing customers must sign in.

### Changes
- **Invoice Access Control**: Only the customer email attached to the invoice, admins, and assigned reps can view invoices
- **Auto Account Setup for New Customers**: When an invoice is sent to a new person, a unique setup token is generated. The email links them to a setup page where they create a password, which auto-creates their full customer profile (user + customer + referral code)
- **Existing Customer Flow**: Existing customers are prompted to sign in to view their invoice
- **Guest Order Linking**: When a new customer completes account setup, any guest orders from their invoice are automatically linked to their new customer profile

### Files Modified
- `app/api/invoice/[id]/route.ts` - Added auth checks: verifies logged-in user's email matches invoice, checks admin/rep roles
- `app/invoice/[id]/page.tsx` - Added setup form, login form, and auth state handling
- `app/api/invoice/setup/route.ts` (new) - Validates setup tokens, creates auth user + user/customer records, signs user in
- `app/api/authorize-net/invoices/route.ts` - Generates setup tokens for new customers, links customer_id, updates email content
- `database/secure-invoices.sql` (new) - Adds `customer_id`, `account_setup_token`, `account_setup_completed` columns

### Database Migration Required
Run `database/secure-invoices.sql` in Supabase SQL editor.

---

## [2026-02-04] - [FEATURE] Auth Flow Refactor - Email Default with Mobile Option

Reverted to email/password as the default login/registration method. Mobile sign-in is now an optional flow accessed via "Use mobile number instead" link.

### Changes
- Default screen: standard email + password login and registration
- "Use mobile number" opens a choice: New Customer or Existing Customer
- New Customer: phone verify → OTP → complete profile
- Existing Customer: verify email/password first → add phone → verify OTP → phone linked
- Prevents duplicate accounts by requiring existing account verification first

### Files Modified
- `app/landing/page.tsx` - Complete rewrite with email-first default + mobile option
- `app/(auth)/register/page.tsx` - Standard email/password registration
- `app/api/register/route.ts` - Supports both phone-first and email-first registration paths

---

## [2026-02-05] - [FEATURE] Editable Email Templates with AI Generation

Added a full admin UI for editing transactional email templates (invoice, payment reminder, commission payment, etc.) with Claude AI-powered HTML generation.

### New Features
- **Email Templates Admin Page** (`/admin/email-templates`): Visual editor for all transactional email templates
- **AI HTML Generation**: Click "AI Generate" to have Claude Sonnet 4 create beautiful, responsive email HTML from a text prompt
- **Style Options**: Dark Modern, Light Clean, or Custom style presets for AI generation
- **Template Variables**: Click-to-insert variables like `{{customer_name}}`, `{{order_number}}`, etc.
- **Live Preview**: Toggle between HTML code view and rendered email preview (using iframe)
- **Send Test Email**: Send a test email to any address to verify the template looks right
- **Fallback System**: If no saved template exists, the original hardcoded HTML is used as fallback

### Database Migration
- `supabase/migrations/20260205100000_create_transactional_email_templates.sql` — Creates `transactional_email_templates` table with default template entries for: Invoice, Payment Reminder, Commission Payment, Welcome, Order Confirmation, Shipping Notification

### Files Created
- `app/admin/email-templates/page.tsx` — Admin email templates editor page
- `app/api/admin/email-templates/route.ts` — GET/PUT API for template CRUD
- `app/api/admin/email-templates/send-test/route.ts` — Send test email endpoint
- `app/api/ai/generate-email/route.ts` — AI email HTML generation using Claude Sonnet 4

### Files Modified
- `lib/notifications.ts` — Added `getEmailTemplate()` and `replaceTemplateVariables()` helpers; wired commission payment email to use saved templates
- `app/api/authorize-net/invoices/route.ts` — Invoice email now uses saved template with fallback
- `app/api/admin/orders/[id]/send-reminder/route.ts` — Payment reminder now uses saved template with fallback
- `app/admin/page.tsx` — Added Email Templates link in Marketing & Growth section

### Email Template Types
| Key | Name | Variables |
|-----|------|-----------|
| `invoice` | Invoice Email | customer_name, invoice_number, total, subtotal, issue_date, due_date, invoice_url |
| `payment_reminder` | Payment Reminder | customer_name, order_number, total_amount, payment_url |
| `commission_payment` | Commission Payment | rep_name, payment_amount, currency, payment_report_url |
| `welcome` | Welcome Email | first_name, login_url |
| `order_confirmation` | Order Confirmation | customer_name, order_number, total_amount, order_url |
| `shipping_notification` | Shipping Notification | customer_name, order_number, tracking_number, carrier, tracking_url |

---

## [2026-02-05] - [FEATURE] Comprehensive Supabase Admin Page + Customer Names

Enhanced the Supabase admin page with full customers table management and improved user editing capabilities.

### New Features
- **Customers Table Tab**: New tab in Supabase admin to browse, search, edit, and delete customers directly
- **Customer first_name/last_name columns**: Added `first_name` and `last_name` directly to the `customers` table for easier identification (no need to join with `users` table)
- **Enhanced Users Editing**: Users table now supports editing email, phone, first name, last name, and role
- **Name Syncing**: Updating names on either the users or customers table automatically syncs to the other
- **Customer Search**: Search customers by name, email, phone, company, city, or customer type

### Database Migration
- `supabase/migrations/20260205000000_add_names_to_customers.sql` - Adds `first_name` and `last_name` columns to `customers` table with indexes, and backfills from `users` table

### Files Modified
- `app/admin/supabase/page.tsx` - Added Customers tab, enhanced Users edit dialog (email, phone fields)
- `app/actions/customers.ts` - Updated `Customer` type and `getCustomers` query to include new name columns
- `app/api/admin/customers/route.ts` - Updated to select and prefer customer-level names
- `app/api/admin/customers/[id]/route.ts` - Updated PATCH to save `first_name`/`last_name` on customers table and sync to users
- `app/admin/customers/customers-client.tsx` - Updated display name and search to use customer-level names
- `app/admin/page.tsx` - Updated Supabase card description

---

## [2026-02-04] - [FEATURE] Phone-First Authentication with Supabase + Twilio Verify

Major overhaul of the authentication system to use phone number verification as the default method for account creation and login.

### New Authentication Flow

**Registration (Phone-First):**
1. Enter phone number → Receive SMS OTP via Supabase/Twilio Verify
2. Verify OTP code → Phone is confirmed
3. Complete profile (name, email, password, referral code)
4. Account created with verified phone

**Login:**
- **Default**: Enter phone → Get OTP → Verify → Logged in
- **Fallback**: "Use email instead" for existing email-only users

### Files Added
- `database/add-phone-verification.sql` - Migration to add phone verification fields
- `components/add-phone-prompt.tsx` - Modal prompt for email-only users to add phone
- `app/api/user/update-phone/route.ts` - API to update user phone after verification

### Files Modified
- `app/landing/page.tsx` - Complete rewrite with phone OTP login/register flow
- `app/(auth)/register/page.tsx` - Updated to phone-first multi-step registration
- `app/api/register/route.ts` - Now works with existing phone-authenticated users
- `.env.example` - Added note about Supabase phone auth configuration

### Database Changes (Migration Required)
Run `database/add-phone-verification.sql` to add:
- `phone_verified` (boolean) - Whether phone is verified
- `phone_verified_at` (timestamp) - When phone was verified
- `preferred_auth_method` (varchar) - 'phone' or 'email'
- `prompted_for_phone` (boolean) - Track if user was prompted to add phone

### Supabase Configuration Required
1. Go to Supabase Dashboard → Authentication → Providers → Phone
2. Enable Phone provider
3. Configure Twilio Verify credentials (Account SID, Auth Token, Verify Service SID)

---

## [2026-02-04] - [FIX] Registration Double-Submit Race Condition

Fixed issue where iPhone users (or users on slow connections) could accidentally submit the registration form multiple times, causing a duplicate key error on the users table.

### Root Cause:
When users tapped the register button multiple times quickly, multiple API requests could be sent before the first one completed. The auth user would be created, but the second request would fail when trying to insert into the users table (duplicate auth_id). The customer record would never be created.

### Backend Fix (`app/api/register/route.ts`):
- Made the registration flow **idempotent** - if the users table insert fails with duplicate key error (23505), we now fetch the existing user instead of failing
- Added check for existing customer record before creating a new one
- Both user and customer records are now properly created even on duplicate submissions

### Frontend Fix (`app/(auth)/register/page.tsx`):
- Added `useRef` based submission tracking (`isSubmittingRef`) for synchronous double-click prevention
- The ref check happens before any async operations, blocking duplicate submissions at the source
- More reliable than state-based checks which are async

---

## [2026-02-04] - [FEATURE] CSV Price Import with AI Matching

Added the ability to upload a CSV file with product names and prices, with AI-powered product matching. Choose which price type to update (Cost, B2B, Retail, or Supplier).

### Features:
- **CSV Upload**: Upload any CSV with product names and prices - AI parses automatically
- **Price Type Selection**: Choose which price field to update (cost_price, b2b_price, retail_price, supplier_price)
- **AI Product Matching**: Claude matches CSV product names to database products with confidence scoring
- **Review Before Apply**: See matched products, confidence levels, and choose alternatives if needed
- **Bulk Update**: Apply all matched prices in one action

### Files Added:
- `app/api/admin/inventory/parse-csv-prices/route.ts` - API endpoint for AI-powered CSV parsing
- `components/csv-price-upload-modal.tsx` - Modal UI for CSV upload and review

### Files Modified:
- `app/actions/inventory.ts` - Added `bulkUpdatePrices()` action and `PriceType` type
- `app/admin/inventory/page.tsx` - Added "Import Prices" button and modal integration

---

## [2026-02-04] - [FEATURE] Supplier Price Field for Inventory

Added a new "Supplier Price" field to the inventory system. This price is admin-only and not visible to customers or reps.

### Changes:
- **New Price Type**: Added `supplier_price` field alongside cost_price, b2b_price, and retail_price
- **Admin Inventory Pages**: Supplier price input appears with amber styling to distinguish it from other prices
- **Add Product**: New products can include supplier price for each variant
- **Edit Variants**: Existing variants can be updated with supplier price
- **Admin Only**: This price is only visible/editable in admin inventory pages, never exposed to customers or reps

### Files Modified:
- `app/actions/inventory.ts` - Added supplier_price to Product, CreateProductInput, CreateVariantInput, and updateVariant types
- `app/admin/inventory/page.tsx` - Added supplier price input to variant editing and new variant forms
- `app/admin/inventory/add/page.tsx` - Added supplier price input to new product creation
- `database/add-supplier-price.sql` - Migration to add supplier_price column to products table

### Database Migration Required:
Run the SQL in `database/add-supplier-price.sql` to add the supplier_price column.

---

## [2026-02-04] - [FEATURE] Invoice Creates Order Automatically

When creating an invoice, an order is now automatically created with all the invoice items and price details. This links invoices to the order management system so you can track fulfillment.

### Changes:
- **Order Creation**: When an invoice is created, a corresponding order is created with:
  - All line items from the invoice (product name, quantity, unit price)
  - Subtotal, discount, and total amounts
  - Customer association (if existing customer found by email) or guest order info
  - Link to the invoice payment URL
- **Invoice-Order Link**: The invoice stores a reference to the created order (`order_id` column)
- **Customer Matching**: Automatically matches invoice customer email to existing customers in the system

### Files Modified:
- `app/api/authorize-net/invoices/route.ts` - Added order creation logic on invoice creation
- `supabase/migrations/20260204000000_add_order_id_to_invoices.sql` - Added order_id column to invoices table

---

## [2026-01-17] - [FEATURE] AI Confirmation Modal - Review Before Applying

Added a confirmation "middleman" step that shows parsed AI data before applying to the invoice. This prevents incorrect data from being automatically applied and gives users a chance to review customer matching, product identification, and pricing before committing.

### Features:
- **Confirmation Modal**: Shows parsed customer, products, quantities, prices, and totals
- **Confidence Indicators**: Color-coded badges showing match confidence (high/medium/low)
- **Ambiguity Warnings**: Highlights when multiple customers match (e.g., multiple Michaels)
- **Cancel/Confirm Actions**: User must explicitly approve before data is applied
- **Works for Quick Command**: Invoice page quick command now shows confirmation
- **Works for AI Import Panel**: Voice/paste/screenshot imports also show confirmation

### Files Modified:
- `app/admin/authorize-net/invoices/page.tsx` - Added confirmation modal state and UI
- `components/invoice/editor/ai-import-panel.tsx` - Added confirmation flow before import

---

## [2026-01-17] - [FIX] AI Customer Identification - Stricter Name Matching

Fixed an issue where the AI was confusing customers with similar first names (e.g., Michael Stroud vs Michael Shahbazian). Implemented server-side customer matching with scoring to ensure accurate identification.

### Changes:
- **parse-request API**: Added `matchCustomer()` function that scores customers based on full name match quality
- **Customer catalog in AI prompt**: Now sends full customer names to Claude so it can match against real customers
- **Strict matching rules**: 
  - Requires BOTH first AND last name to match for high-confidence identification
  - First-name-only matches only work if there's exactly ONE customer with that name
  - Ambiguous matches return alternatives for disambiguation
- **Removed fuzzy matching**: Client-side fuzzy matching was causing false positives; now uses exact matching
- **Logging improvements**: Added detailed logs for customer matching with confidence levels and ambiguity warnings

### Files Modified:
- `app/api/authorize-net/invoices/parse-request/route.ts` - Added customer matching function
- `components/invoice/editor/ai-import-panel.tsx` - Uses server-matched customer, passes customer catalog to API
- `app/admin/authorize-net/invoices/page.tsx` - Stricter findMatchingCustomer(), uses server match
- `app/api/mobile/voice-command/route.ts` - Stricter customer matching with scoring

---

## [2026-01-17] - [FEATURE] Mobile App (React Native / Expo)

Created a complete React Native mobile app for managing the Live Well Shop on the go. Built with Expo SDK 52 and Expo Router for native iOS and Android support.

### Core Features:
- **Push Notifications**: Real-time order alerts using Expo Notifications
- **Quick Actions Dashboard**: One-tap access to Send Invoice, Create Order, Scan QR
- **QR Code Scanner**: Scan product barcodes for instant inventory lookup and stock updates
- **Order Management**: Full order list with search, filters, and detail views
- **Inventory Tracking**: View all products with stock status indicators (In Stock/Low/Out)
- **Real-time Sync**: Supabase real-time subscriptions for live order updates

### Files Created:
```
mobile/
├── app/                    # Expo Router pages
│   ├── _layout.tsx        # Root layout with auth & notifications
│   ├── (tabs)/            # Tab navigation
│   │   ├── _layout.tsx    # Tab bar with order badge
│   │   ├── index.tsx      # Home screen with quick actions
│   │   ├── orders.tsx     # Orders list with search/filter
│   │   ├── inventory.tsx  # Product inventory
│   │   └── settings.tsx   # App settings & notifications
│   ├── orders/[id].tsx    # Order detail screen
│   ├── scanner.tsx        # QR code scanner with stock update
│   ├── send-invoice.tsx   # Send invoice to customer
│   ├── create-order.tsx   # Multi-step order creation
│   └── login.tsx          # Authentication screen
├── src/
│   ├── hooks/useNotifications.ts  # Push notification setup
│   ├── lib/supabase.ts    # Supabase client with SecureStore
│   ├── store/auth.ts      # Auth state management
│   ├── store/orders.ts    # Orders with real-time sync
│   └── types/             # Shared TypeScript types
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
└── README.md              # Setup instructions
```

### Tech Stack:
- React Native with Expo SDK 52
- Expo Router for file-based navigation
- Zustand for state management
- Expo Camera for QR scanning
- Expo Notifications for push alerts
- Expo SecureStore for auth tokens

### To Run:
```bash
cd mobile
pnpm install
pnpm start
```

---

## [2026-01-16] - [FEATURE] Cancel Order Button & Archived Orders Tab

Added order cancellation and archiving features to the admin orders page.

### Changes:
- **Cancel Order Button** - Added in expanded order view with confirmation dialog
  - Shows "Cancel Order" button for active orders (not cancelled or delivered)
  - Confirmation prompt with Yes/No buttons before cancelling
  - Shows "Order Cancelled" badge for cancelled orders

- **Archived Orders Tab** - New filter tab for completed orders
  - Archives orders that are: Delivered, Cancelled, or Refunded
  - Distinct styling with gray/zinc color scheme
  - Archive icon on the tab for visual distinction
  - All other tabs now exclude archived orders from their counts

### Files Modified:
- `app/admin/orders/page.tsx` - Added cancel functionality and archived tab

---

## [2026-01-16] - [FEATURE] Automatic Label Printing System with PL70e-BT Bluetooth Printer

Implemented a complete automatic label printing system that prints shipping labels when payments are confirmed. Includes a desktop print agent that runs in the system tray.

### Architecture:
1. **Payment Webhook** → Creates print job in database
2. **Supabase Realtime** → Pushes job to desktop agent instantly
3. **Print Agent** → Receives job, generates label, prints to PL70e-BT

### Files Created:

#### Backend (Next.js)
- `supabase/migrations/20260116_create_print_jobs.sql` - Print jobs queue table with Realtime enabled
- `app/api/print-jobs/route.ts` - CRUD API for print jobs
- `app/api/print-jobs/[id]/route.ts` - Update job status
- `app/api/print-jobs/create-shipping-label/route.ts` - Create label from order ID
- `lib/print-job-helpers.ts` - Helper functions for creating print jobs

#### Desktop App (Electron)
- `print-agent/package.json` - Electron app configuration
- `print-agent/src/main.ts` - Main process with system tray
- `print-agent/src/print-job-listener.ts` - Supabase Realtime listener
- `print-agent/src/label-printer.ts` - Label generation and printing
- `print-agent/src/types.ts` - TypeScript interfaces
- `print-agent/assets/index.html` - Settings UI
- `print-agent/README.md` - Setup documentation

### Files Modified:
- `app/api/stripe/webhook/route.ts` - Auto-create print job on payment success
- `app/api/authorize-net/webhook/route.ts` - Auto-create print job on payment success
- `app/admin/orders/[id]/page.tsx` - Added "Print Label" button for manual printing

### Features:
- **Automatic printing** - Labels print instantly when payments complete
- **System tray app** - Runs in background, starts on boot
- **Realtime updates** - Uses Supabase Realtime for instant job delivery
- **Polling fallback** - Checks every 30s in case Realtime misses something
- **Manual print button** - Print labels on-demand from order detail page
- **Multiple label types** - Shipping labels, product labels, packing slips
- **Notifications** - Desktop notifications when labels print

### Environment Variables (add to .env):
```
BUSINESS_ADDRESS_LINE1=123 Business St
BUSINESS_CITY=Los Angeles
BUSINESS_STATE=CA
BUSINESS_ZIP=90001
```

### Setup Instructions:
1. Run the migration in Supabase
2. `cd print-agent && npm install`
3. Connect PL70e-BT printer via USB
4. Run `npm run dev` to start the print agent
5. Enter Supabase credentials in the app
6. Labels will print automatically on payment!

---

## [2026-01-14] - [FEATURE] Pricing Formula System for Protected Cost & Rep Commission

Implemented a comprehensive pricing formula system that protects product cost, guarantees minimum profit, and calculates rep commission from the markup margin only. Discounts applied to orders are deducted from the rep's commission pool, not from business profit.

### How the Formula Works:
1. **Cost Protected**: Product cost is the absolute floor and is NEVER touched
2. **Profit Guaranteed**: Minimum Price = Cost × Min Markup (e.g., 2× = 100% guaranteed profit)
3. **Commission Pool**: The amount between min and max markup where rep commission is calculated
4. **Discounts Reduce Commission**: Any discounts applied come out of the rep's commission pool first

### Formula Example (with default 2×-4× settings):
- Cost: $100
- Min Price (2×): $200 ← Profit floor protected
- Max Price (4×): $400 ← Commission ceiling
- Commission Pool: $100-$200 (sale price above min, capped at max)
- If rep has 10% rate on a $300 sale: Pool = $100, Commission = $10

### Files Created:
- `supabase/migrations/20260114_create_pricing_formula_settings.sql` - Database tables for formula settings and order breakdowns
- `app/actions/pricing-formula.ts` - Server actions for formula CRUD, commission calculation, and preview
- `app/admin/pricing-formula/page.tsx` - Admin UI for managing formulas with live calculator

### Files Modified:
- `app/actions/rep.ts` - Updated commission calculations to use pricing formula
- `app/actions/rep-management.ts` - Updated rep stats to use formula-based commission
- `components/global-nav.tsx` - Added Pricing Formula to admin nav

### Database Tables:
- `pricing_formula_settings` - Stores formula configurations (min/max markup, active flag)
- `order_pricing_breakdown` - Records pricing details for each order for transparency

### Admin Features:
- Create/edit/delete pricing formulas
- Set active formula with one click
- Visual explanation of how the formula works
- Shows guaranteed profit and commission pool breakdowns

### Real Order Integration:
- **Automatic calculation** on every order placed
- Uses real `cost_price` from products table
- Stores breakdown in `order_pricing_breakdown` table
- Shows pricing breakdown on order detail page
- Calculates rep commission from their assigned customers
- Discounts reduce commission pool, not your profit

---

## [2026-01-10] - [REFACTOR] Supply Store Chronicles Aesthetic Redesign

Applied the Chronicles Collection style guide to the supply store for a luxurious, editorial aesthetic. All functionality preserved - only styling layer changed.

### Design System Changes:
- **Typography**: Playfair Display serif for headings (font-light, never bold), grey italics for secondary text
- **Colors**: Near-black background (`oklch(0.08 0 0)`), monochromatic palette, white/opacity variations
- **Glass Morphism**: Updated to Chronicles spec with subtle backdrop blur and refined borders
- **Animations**: Added Framer Motion `whileInView` animations with staggered reveals
- **Spacing**: Increased vertical breathing room (py-24 md:py-32 sections)

### Files Modified:
- `app/globals.css` - Chronicles color palette, glass-card/glass-button utilities
- `components/supply-store/glass-card.tsx` - Chronicles glass morphism spec
- `components/supply-store/glass-button.tsx` - Updated hover states and styling
- `components/supply-store/navbar.tsx` - Chronicles typography and glass styling
- `components/supply-store/footer.tsx` - Serif headings, refined typography
- `components/supply-store/product-card.tsx` - Mono prices, serif titles, eyebrow labels
- `app/supply-store/page.tsx` - Full Chronicles aesthetic with animations
- `app/supply-store/products/page.tsx` - Chronicles styling with whileInView animations
- `app/supply-store/products/[sku]/page.tsx` - Product detail with Chronicles layout
- `app/supply-store/cart/page.tsx` - Cart with refined typography and glass cards

### Key Patterns Applied:
- Eyebrow text: `font-mono tracking-[0.3em] text-muted-foreground uppercase`
- Section headers: Two-line with first white, second italic grey
- Headings: `font-serif font-light` (never bold)
- Cards: `bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)]`

---

## [2026-01-09] - [FEATURE] Authorize.net Payment Integration

Replaced Stripe card payment processing with Authorize.net Accept Hosted for PCI SAQ A compliance. Uses hosted payment form (iframe) so card data never touches our servers.

### Files Created:
- `lib/authorize-net.ts` - Authorize.net API library (hosted payment, transactions, refunds, webhooks)
- `app/api/authorize-net/hosted-payment/route.ts` - Creates hosted payment page tokens
- `app/api/authorize-net/webhook/route.ts` - Handles Authorize.net webhook notifications
- `components/authorize-net-checkout.tsx` - Client component for Accept Hosted iframe
- `supabase/migrations/20260109200000_add_authorize_net_support.sql` - Database support

### Files Modified:
- `app/payment/card/page.tsx` - Now uses AuthorizeNetCheckout instead of StripeCheckoutWrapper
- `app/api/orders/confirm-payment/route.ts` - Supports both Stripe and Authorize.net

### Database Changes:
```sql
ALTER TABLE orders ADD COLUMN authorize_net_transaction_id TEXT;
ALTER TABLE orders ADD COLUMN payment_provider TEXT DEFAULT 'stripe';

CREATE TABLE payment_events (
  id UUID PRIMARY KEY,
  order_id UUID,
  provider TEXT, -- 'stripe' or 'authorize_net'
  transaction_id TEXT,
  event_type TEXT,
  status TEXT,
  amount INTEGER,
  ...
);
```

### Environment Variables Required:
```
AUTHORIZE_NET_API_LOGIN_ID=your_api_login_id
AUTHORIZE_NET_TRANSACTION_KEY=your_transaction_key
AUTHORIZE_NET_SIGNATURE_KEY=your_signature_key
AUTHORIZE_NET_ENVIRONMENT=production  # or 'sandbox'
```

### Webhook Setup:
1. Go to Authorize.net Merchant Interface → Account → Settings → Webhooks
2. Add endpoint: `https://modernhealth.pro/api/authorize-net/webhook`
3. Select events: `net.authorize.payment.authcapture.created`, `net.authorize.payment.refund.created`, etc.

### Flow:
1. Customer clicks Pay → Creates hosted payment page token
2. Accept Hosted iframe loads → Customer enters card details
3. Payment processed → Webhook notifies our server
4. Order updated to paid → Customer redirected to confirmation

---

## [2026-01-09] - [FEATURE] PCI Vulnerability Scan Management

Added admin interface for scheduling PCI vulnerability scans and managing scanner IP whitelisting. Enables tracking of scan windows and provides quick access to scanner IPs that need to be whitelisted in Cloudflare.

### Files Created:
- `supabase/migrations/20260109100000_create_pci_scan_schedules.sql` - Tables for scan schedules and scanner IPs
- `app/actions/pci-scan.ts` - Server actions for CRUD operations
- `app/admin/pci-scan/page.tsx` - Admin interface with Chronicles styling

### Files Modified:
- `app/admin/page.tsx` - Added PCI Scan card
- `components/global-nav.tsx` - Added PCI Scan to admin nav
- `components/admin/admin-header.tsx` - Added PCI Scan link
- `components/admin/admin-overlay-nav.tsx` - Added PCI Scan link

### Database Schema:
```sql
CREATE TABLE pci_scan_schedules (
  id UUID PRIMARY KEY,
  scan_name TEXT NOT NULL,
  scanner_provider TEXT DEFAULT 'SecurityMetrics',
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  status TEXT CHECK (status IN ('scheduled', 'active', 'completed', 'cancelled')),
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);

CREATE TABLE pci_scanner_ips (
  id UUID PRIMARY KEY,
  ip_range TEXT UNIQUE NOT NULL,
  description TEXT,
  provider TEXT DEFAULT 'SecurityMetrics',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ
);
```

### Features:
1. **Scanner IP Whitelist**: View, copy, add, toggle, delete scanner IPs
2. **Scan Scheduling**: Schedule scans with name, provider, time window, notes
3. **Status Tracking**: Track scheduled/active/completed/cancelled scans
4. **Live Indicator**: Shows when current time is within scan window
5. **Copy All IPs**: One-click copy of all active IPs for Cloudflare
6. **Instructions Panel**: Cloudflare whitelisting steps

### Pre-populated Scanner IPs (SecurityMetrics):
- 64.39.96.0/20
- 154.59.121.0/24
- 139.87.104.123/32
- 139.87.117.66/32
- 139.87.112.0/23
- 141.144.196.156/32
- 158.101.209.126/32
- 34.33.2.64/26

### Cloudflare Automation:
- `lib/cloudflare.ts` - Cloudflare API integration (list, create, delete IP rules)
- `app/actions/cloudflare.ts` - Server actions for whitelist management
- `app/api/cron/pci-scan/route.ts` - Cron endpoint for automatic whitelist management

**Environment Variables Required:**
```
CLOUDFLARE_API_TOKEN=your_api_token
CLOUDFLARE_ZONE_ID=your_zone_id
```

**Features:**
- One-click enable/disable whitelist from admin panel
- Automatic IP Access Rule creation in Cloudflare
- Automatic cleanup when scan completes
- Optional cron job for fully automated scheduling

---

## [2026-01-09] - [FEATURE] Database-Driven Policy Editor

Added an admin policy editor allowing editing of Privacy Policy and PCI DSS Policy documents directly from the admin panel. Policies are stored in Supabase and rendered with the Chronicles style guide (glassmorphism, Playfair Display typography, Framer Motion animations).

### Files Created:
- `supabase/migrations/20260109000000_create_policies_table.sql` - Policies table with JSONB content storage
- `app/actions/policies.ts` - Server actions for CRUD operations
- `app/api/policies/route.ts` - API route for listing policies
- `app/api/policies/[slug]/route.ts` - API route for fetching individual policy
- `app/admin/policy/page.tsx` - Admin editor with expandable section editing
- `components/policy-content-renderer.tsx` - Shared component for rendering policy sections

### Files Modified:
- `app/privacy/page.tsx` - Now loads content from database
- `app/pci_dss_policy/page.tsx` - Now loads content from database  
- `app/policy/page.tsx` - Now loads policy list from database
- `app/admin/page.tsx` - Added Policies link to admin dashboard

### Database Schema:
```sql
CREATE TABLE policies (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  hero_tagline TEXT,
  effective_date DATE,
  last_updated TIMESTAMPTZ,
  contact_email TEXT,
  content JSONB NOT NULL DEFAULT '[]',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### Features:
1. **Admin Editor**: Edit policy metadata (title, subtitle, dates, contact email)
2. **Section Editor**: Expand/collapse sections to edit content, intros, items
3. **Publish Toggle**: Toggle visibility of each policy
4. **Live Preview**: Link to view policy page in new tab
5. **Auto-Timestamps**: last_updated automatically updated on save
6. **RLS Policies**: Public read for published, admin full access

### Content Types Supported:
- `promise` - Featured promise box
- `section` - Standard section with subsections
- `security-grid` - 2-column security features grid
- `two-column` - Side-by-side comparison columns
- `numbered-list` - Ordered list with labels
- `bullet-list` - Unordered list
- `never-list` - List with X icons
- `rights-grid` - 2-column rights grid
- `simple` - Plain text section
- `policy-review` - Review metadata table

---

## [2026-01-03] - [FEATURE] Payment Fallback Mode (Shopify Invoice System)

Added a Payment Fallback Mode that allows the store to continue accepting orders when payment processing is down by sending invoices through a separate Shopify store.

### Problem Solved:
When payment processors (Stripe, crypto) are experiencing downtime, customers couldn't complete orders. This feature provides a backup payment path using Shopify's draft order and invoice system.

### Files Created:
- `supabase/migrations/20260103000000_add_payment_fallback_mode.sql` - Database migration for settings and order columns
- `supabase/migrations/20260103000001_create_invoice_order_trigger.sql` - Database trigger for automatic invoice sending
- `supabase/functions/send-shopify-invoice/index.ts` - Supabase Edge Function for Shopify API
- `supabase/functions/_shared/cors.ts` - Shared CORS headers for edge functions
- `app/actions/payment-fallback.ts` - Server actions for payment fallback settings
- `docs/PAYMENT_FALLBACK_SETUP.md` - Complete setup guide

### Files Modified:
- `components/streamlined-crypto-checkout.tsx` - Added invoice mode checkout flow
- `app/admin/settings/page.tsx` - Added Payment Fallback settings section
- `app/order-confirmation/page.tsx` - Added invoice order confirmation UI

### Database Changes:
New columns in `site_settings`:
- `payment_fallback_enabled` (boolean)
- `payment_fallback_message` (text)
- `shopify_store_domain` (text)
- `shopify_access_token` (text)
- `shopify_invoice_prefix` (text)

New columns in `orders`:
- `shopify_invoice_id` (text)
- `shopify_invoice_url` (text)
- `invoice_sent_at` (timestamptz)

### Features:
1. **Admin Toggle**: Enable/disable fallback mode from Admin → Settings
2. **Customer Messaging**: Customizable message shown during checkout
3. **Automatic Invoicing**: Edge function creates Shopify draft order and sends invoice
4. **Generic Invoices**: Only order total and customer info sent to Shopify (no product details)
5. **Separate Branding**: Invoices come from Shopify store, not main website
6. **Order Tracking**: Invoice ID and URL stored in orders table

### How It Works:
1. Admin enables Payment Fallback Mode in settings
2. Customer goes to checkout, sees invoice payment notice
3. Customer submits order with email
4. Order created with `payment_method: 'invoice'`
5. Database trigger calls edge function
6. Edge function creates Shopify draft order and sends invoice email
7. Customer pays via Shopify payment link
8. Admin marks order as paid manually (or via webhook)

### Shopify Requirements:
- Separate Shopify store for invoicing
- Custom app with `write_draft_orders` and `read_draft_orders` scopes
- Admin API access token

---

## [2026-01-03] - [FIX] All Reps Default to B2B Pricing

Updated all rep creation functions to automatically set B2B pricing for reps.

### Changes:
- Modified `app/actions/rep-management.ts`:
  - `promoteCustomerToRep` - Updates existing customer record to `customer_type: "b2b"`
  - `createRepWithPassword` - Creates new customer record with `customer_type: "b2b"` for the rep
  - `inviteRep` - Creates new customer record with `customer_type: "b2b"` for the invited rep

### Behavior:
- When a customer is promoted to rep: their existing customer record is updated to B2B pricing
- When a new rep is created with password: a customer record is automatically created with B2B pricing
- When a rep is invited via email: a customer record is automatically created with B2B pricing
- All reps now get B2B pricing by default regardless of how they become a rep

---

## [2025-12-18] - [FEATURE] Supabase Admin Panel with Email Template Editor

Added a comprehensive Supabase management section to the admin dashboard for managing users, auth users, providers, and designing email templates.

### Files Created:
- `components/admin/email-template-editor/email-editor.tsx` - TipTap-based rich text email editor
- `components/admin/email-template-editor/email-toolbar.tsx` - Toolbar with formatting & variable insert buttons
- `components/admin/email-template-editor/index.ts` - Export file
- `app/admin/supabase/page.tsx` - Main Supabase admin page with tabs
- `app/api/admin/auth-users/route.ts` - API to fetch auth.users
- `app/api/admin/auth-users/action/route.ts` - API for auth actions (reset password, magic link, delete)
- `supabase/migrations/create_email_templates.sql` - Database migration for email templates table

### Dependencies Added:
- @tiptap/core, @tiptap/react, @tiptap/starter-kit
- @tiptap/extension-image, @tiptap/extension-link, @tiptap/extension-youtube
- @tiptap/extension-placeholder, @tiptap/extension-underline, @tiptap/extension-text-align
- @tiptap/extension-highlight, @tiptap/extension-text-style, @tiptap/extension-font-family
- @tiptap/pm, @tiptap/html
- @radix-ui/react-toggle

### Features:

**Users Table Tab:**
- Live feed of users from the `users` table
- Search functionality
- Delete users directly from the table
- View user roles and creation dates

**Auth Users Tab:**
- Live feed of Supabase auth.users
- Send password reset emails
- Send magic link emails
- Delete auth users
- View email confirmation status
- View last sign-in dates

**Providers Tab:**
- Display of enabled/disabled auth providers
- User signup settings (display only - configure in Supabase Dashboard)
- Email confirmation toggle display

**Email Templates Tab:**
- WYSIWYG editor using TipTap (adapted from blog editor in p2 project)
- Template types: Confirmation, Invite, Magic Link, Recovery, Email Change
- **Insert Variable buttons** - Click to insert Supabase variables like:
  - `{{ .ConfirmationURL }}`
  - `{{ .Email }}`
  - `{{ .SiteURL }}`
  - `{{ .Token }}`
  - `{{ .TokenHash }}`
  - `{{ .RedirectTo }}`
- **Three view modes:**
  - Design mode - WYSIWYG editing
  - HTML mode - Direct HTML editing
  - Preview mode - See rendered email
- **Export to HTML** - Download email template as HTML file
- Save templates to database
- Subject line editor

### Access:
Navigate to `/admin/supabase` or add link from admin dashboard

---

## [2025-12-17] - [FEATURE] Send Tracking SMS from Order Details

Added a button on the order details page to send tracking information and order link via SMS to the customer.

### Files Modified:
- `app/admin/orders/[id]/page.tsx` - Added SMS tracking notification button and preview

### Features:
- **Send Tracking SMS Button**: Located in Shipping Information section
- **Auto-generates tracking URLs**: USPS, UPS, FedEx, or universal tracking link
- **Includes order details link**: Direct link to customer's order page
- **SMS Preview**: Shows what message will be sent before sending
- **Success/Error States**: Visual feedback on send status
- **Phone Validation**: Checks if customer has phone number before allowing send

### SMS Message Includes:
1. Customer's first name greeting
2. Order number
3. Carrier name (if provided)
4. Tracking number
5. Direct tracking link (carrier-specific when possible)
6. Link to their order details page on dashboard

---

## [2025-12-17] - [FEATURE] AI Agent Webhooks System

Added webhooks and triggers configuration to AI agents for event-driven automation.

### Files Created:
- `app/api/admin/ai-agents/[id]/webhooks/route.ts` - API for managing agent webhooks

### Database (in migration):
- `ai_agent_webhooks` table for storing webhook configurations

### Features:
- **Incoming Webhooks**: Receive events from external services
- **Outgoing Webhooks**: Call external services on triggers
- **Event Triggers**: Fire agent on internal events (sms.incoming, order.created, etc.)
- **Secret Keys**: Auto-generated for incoming webhook authentication
- **Trigger Stats**: Track trigger count and last triggered time

---

## [2025-12-17] - [FEATURE] Stripe Payment Events Tracking & Webhook System

Implemented automatic payment status synchronization with Stripe via webhooks. Orders will now automatically update when payments succeed or fail on Stripe's end, with a full event history and timestamps.

### Problem Solved:
Orders were showing "pending" even after customers paid through Stripe because there was no webhook to capture payment completion events.

### Files Created:
- `supabase/migrations/20251217_create_stripe_payment_events.sql` - Database migration for payment events table and order columns
- `app/api/stripe/webhook/route.ts` - Stripe webhook endpoint handling payment events
- `app/api/admin/orders/[id]/payment-events/route.ts` - API endpoint for fetching payment events for an order
- `components/admin/payment-events-timeline.tsx` - Timeline component displaying payment history

### Files Modified:
- `app/api/admin/orders/route.ts` - Added payment status fields to orders list API
- `app/admin/orders/page.tsx` - Added payment status indicators, failure badges, and payment events timeline
- `app/admin/orders/[id]/page.tsx` - Added payment events timeline, failure alerts, and receipt links

### Database Schema:

**New Table: `stripe_payment_events`**
- `id` - UUID primary key
- `order_id` - Foreign key to orders
- `stripe_event_id` - Unique Stripe event ID (for idempotency)
- `stripe_payment_intent_id` - Payment intent ID
- `stripe_checkout_session_id` - Checkout session ID
- `event_type` - payment_intent.succeeded, payment_intent.payment_failed, etc.
- `status` - succeeded, failed, pending, canceled, requires_action
- `amount` - Amount in cents
- `currency` - Currency code
- `failure_code` - Stripe failure code if failed
- `failure_message` - Human-readable failure message
- `payment_method_type` - card, bank_transfer, ach, etc.
- `payment_method_last4` - Last 4 digits
- `payment_method_brand` - visa, mastercard, etc.
- `customer_email` - Customer email
- `receipt_url` - Stripe receipt URL
- `raw_event` - Full Stripe event payload (JSONB)
- `event_timestamp` - When Stripe recorded the event
- `created_at` - When we received the event

**New columns on `orders` table:**
- `payment_failed_at` - Timestamp of payment failure
- `payment_failure_reason` - Failure message
- `stripe_checkout_session_id` - For checkout session payments
- `payment_method_details` - JSONB with card info (type, last4, brand)
- `stripe_receipt_url` - Link to Stripe receipt

### Webhook Events Handled:
- `payment_intent.succeeded` - Updates order to paid
- `payment_intent.payment_failed` - Records failure with reason
- `payment_intent.canceled` - Logs cancellation
- `payment_intent.requires_action` - Logs 3D Secure requirement
- `checkout.session.completed` - Updates order from payment links
- `checkout.session.expired` - Logs expiration
- `charge.succeeded` - Captures receipt URL
- `charge.failed` - Records charge failure
- `charge.refunded` - Updates refund status

### UI Features:
- **Payment History Timeline** - Shows all payment events with timestamps
- **Payment Failed Badge** - Red badge on orders with failed payments
- **Payment Failed Filter** - New filter tab on orders list
- **Failure Alerts** - Detailed failure messages on order detail
- **Receipt Links** - Direct links to Stripe receipts
- **Payment Method Display** - Shows card brand and last 4 digits

### Setup Required:
1. Run the migration in Supabase
2. Add `STRIPE_WEBHOOK_SECRET` to environment variables
3. Configure Stripe webhook endpoint to: `https://modernhealth.pro/api/stripe/webhook`
4. Enable webhook events: payment_intent.succeeded, payment_intent.payment_failed, checkout.session.completed, charge.succeeded, charge.failed, charge.refunded

### Backfill Existing Orders:
- **Sync Button** added to Orders page header - syncs pending orders with Stripe
- **API Endpoint**: `POST /api/admin/orders/sync-stripe` - syncs all orders with Stripe payment intents
- Creates historical payment events for backfilled orders

---

## [2025-12-17] - [FEATURE] Customer List Order & Support History

Added order history and support ticket display to the inline expanded customer cards on the customers list page.

### Files Created:
- `app/api/admin/customers/[id]/orders/route.ts` - API endpoint for fetching customer orders
- `app/api/admin/customers/[id]/tickets/route.ts` - API endpoint for fetching customer support tickets

### Files Modified:
- `app/admin/customers/customers-client.tsx` - Added order history and support tickets sections to expanded cards

### Features:
- **Recent Orders**: Shows the 3 most recent orders with status, date, and amount
- **Support Tickets**: Shows the 3 most recent tickets with status and priority
- **Quick Stats**: Order count and total spent now display actual data
- **Link to Full Profile**: Easy navigation to complete customer detail page
- **Lazy Loading**: Data loads only when customer card is expanded

---

## [2025-12-17] - [FEATURE] Stripe Refund System

Implemented a comprehensive refund system through Stripe for admin-facing order management.

### Files Created:
- `supabase/migrations/20251217_add_refund_tracking.sql` - Database migration for refund tracking columns and timeline table
- `app/api/admin/orders/[id]/refund/route.ts` - API endpoint for processing Stripe refunds
- `components/admin/refund-modal.tsx` - Modal component for initiating and viewing refunds

### Files Modified:
- `app/admin/orders/page.tsx` - Added refund button and modal integration
- `app/admin/orders/[id]/page.tsx` - Added refund button and modal to individual order page
- `components/admin/admin-order-card.tsx` - Added refund button and modal for customer order history
- `app/actions/customers.ts` - Updated Order interface with refund fields
- `app/api/admin/orders/[id]/route.ts` - Added refund fields to order query

### Database Schema (new columns on orders table):
- `refund_id` - Stripe refund ID
- `refund_amount` - Amount refunded
- `refund_status` - pending/processing/succeeded/failed/cancelled
- `refund_destination` - original_payment/store_credit/manual
- `refund_customer_message` - Message sent to customer
- `refund_initiated_at` - Timestamp of initiation
- `refund_completed_at` - Timestamp of completion
- `refund_initiated_by` - Admin user ID who initiated

### New Table:
- `refund_timeline` - Tracks status updates for refund progress visualization

### Features:
- **Refund from Admin Orders Page**: Click any order → Issue Refund button
- **Refund from Customer Order History**: Admin customer page → Orders tab → Issue Refund
- **Refund from Individual Order Page**: Direct refund button in header
- **Full or Partial Refunds**: Choose exact amount to refund
- **Destination Options**: Original payment method (Stripe), store credit, or manual
- **Customer Messaging**: Optional message sent to customer with notification
- **Timeline View**: Visual timeline showing refund status progression
- **No sensitive data sent to Stripe**: Only payment_intent_id and amount

### UX Flow:
1. Click "Issue Refund" button on any order
2. Select full or partial refund
3. Choose refund destination
4. Add optional internal reason and customer message
5. Confirm refund
6. View real-time status updates in timeline

---

## [2025-12-17] - [FEATURE] Inline Customer Editing on Customers List Page

Replaced "View Full Profile" link with full inline editing directly in the expanded customer card.

### Files Modified:
- `app/admin/customers/customers-client.tsx` - Complete overhaul of expanded card content
- `app/api/admin/customers/[id]/route.ts` - Added PATCH support, fixed params types

### Features:
- **Stats Row**: Shows total spent, order count, wallet count, member since date
- **Inline Editing**: All fields editable without leaving the page:
  - Phone number
  - Customer type (Retail/B2B/B2B VIP)
  - Company name
  - Full shipping address
  - Assigned rep (dropdown)
  - Default wallet (dropdown)
  - Notes
- **Save Button**: Saves all changes with loading state and success feedback
- **Delete Button**: Inline delete with "type DELETE" confirmation
- **Auto-loads**: Reps and wallets loaded on first card expansion

### UX:
- Click customer card to expand
- Edit any field directly
- Click "Save Changes" to persist
- Click "Delete" → type DELETE → confirm to remove
- No page navigation needed

---

## [2025-12-17] - [FEATURE] Delete Customer (Complete Removal)

Added ability to completely delete a customer from all database tables, freeing their email for future use.

### Files Created:
- `app/api/admin/customers/[id]/delete/route.ts` - API endpoint for full customer deletion

### Files Modified:
- `app/admin/customers/[id]/page.tsx` - Added Delete button and confirmation modal

### What Gets Deleted:
1. **Customer record** from `customers` table
2. **User record** from `users` table  
3. **Auth user** from Supabase Authentication
4. **Related data**: assigned discounts, customer messages, reward points log
5. **Orders** are preserved but unlinked (customer_id set to null)

### Safety Features:
- Requires typing "DELETE" to confirm
- Shows clear list of what will be deleted
- Cannot be undone warning
- Auth user deletion frees email for future account creation

### UI:
- Red "Delete" button in customer profile header
- Confirmation modal with typed confirmation requirement
- Loading state during deletion
- Redirects to customers list after successful deletion

---

## [2025-12-17] - [FEATURE] Create Customer Button on Customers Page

Added dedicated "Create Customer" button and modal to the admin customers page.

### Changes:
- `app/admin/customers/customers-client.tsx` - Added create customer modal with full form

### Features:
- **Create Customer Button**: Prominent button in the page header
- **Full Form Modal**: First name, last name, email, phone, company, customer type, and optional shipping address
- **Invite Link Display**: After creation, shows the password setup link for copying
- **Copy to Clipboard**: One-click copy of the invite link
- **View Profile Link**: Quick navigation to the new customer's profile
- **Real-time List Update**: New customer appears immediately in the list

### Flow:
1. Click "Create Customer" button
2. Fill in customer details (name/company required, email optional but needed for login)
3. Click "Create Customer"
4. See success message with invite link
5. Copy link to share with customer
6. Customer uses link to set password and can then log in

---

## [2025-12-16] - [FEATURE] Auto-Verified Customer Creation with Password Setup

Enhanced the admin customer creation flow to properly create Supabase Auth users that can log in.

### Changes:
- `app/api/admin/customers/create/route.ts` - Complete overhaul of customer creation

### Features:
- **Auto-Verification**: Creates auth user with `email_confirm: true` so no email verification needed
- **Password Setup Link**: Generates a recovery link that customers use to set their own password
- **Seamless Flow**: Admin creates customer → link is returned → admin shares link → customer sets password → customer can log in
- **Cleanup on Failure**: If user record creation fails, the auth user is automatically deleted
- **Existing User Handling**: Properly checks both auth users and users table for duplicates

### How It Works:
1. Admin creates customer with email in admin panel
2. API creates auth user (auto-verified) with random temp password
3. API generates password reset link pointing to `/set-password`
4. API returns the `invite_link` in response for admin to share
5. Customer clicks link, lands on `/set-password` page
6. Customer sets their own password
7. Customer is redirected to their dashboard

### API Response:
```json
{
  "id": "customer-id",
  "invite_sent": true,
  "invite_link": "https://yourapp.com/set-password#access_token=...",
  "message": "Customer created! A password setup link has been generated."
}
```

### Options:
- Pass `send_invite: false` to skip generating the password setup link

---

## [2025-12-16] - [FEATURE] Email Tracking Settings Admin UI

Added admin UI for managing automated USPS tracking extraction from email. Replaces Postmark dependency with Cloudflare Email Workers.

### Files Created:
- `app/admin/tracking/page.tsx` - Settings page for email tracking automation
- `app/api/admin/tracking/settings/route.ts` - Save/load tracking settings
- `app/api/admin/tracking/logs/route.ts` - Fetch processing logs
- `supabase/migrations/20251216_create_tracking_email_system.sql` - Database tables

### Files Modified:
- `app/api/tracking/inbound-email/route.ts` - Updated to support both Cloudflare and Postmark formats, added logging
- `cloudflare-email-worker.js` - Updated setup instructions for correct endpoint

### Features:
- **Status Toggle**: Enable/disable automation from admin panel
- **Webhook URL Display**: Copy the webhook URL for Cloudflare worker config
- **API Key Generator**: Generate and copy API keys for authentication
- **Test Connection**: Verify webhook endpoint is working
- **Quick Setup Guide**: Step-by-step Cloudflare configuration instructions
- **Activity Logs**: View recent email processing results with status badges
- **Dual Format Support**: Accepts both Cloudflare (lowercase) and Postmark (PascalCase) payloads

### Database Tables:
- `app_settings` - Key-value store for application configuration
- `tracking_email_logs` - Logs each email processing attempt with status

### How It Works:
1. Forward USPS receipt emails to tracking@yourdomain.com
2. Cloudflare Email Worker receives email and POSTs to webhook
3. Webhook parses email for order numbers and tracking numbers
4. Orders automatically updated with tracking info and marked as shipped
5. All activity logged for visibility in admin panel

---

## [2025-12-16] - [FEATURE] AI Agents Management System

Added comprehensive AI agents configuration system for managing AI assistants that handle SMS support, order confirmations, and payment collection.

### Database Schema:
- `ai_agents` - Main agents table with name, type, system prompt, capabilities
- `ai_agent_resources` - Training documents, FAQs, policies, scripts
- `ai_agent_examples` - Example conversations for training
- `ai_agent_logs` - Activity logging for transparency

### Files Created:
- `supabase/migrations/20251216_create_ai_agents_system.sql` - Full database schema
- `app/api/admin/ai-agents/route.ts` - List/create agents
- `app/api/admin/ai-agents/[id]/route.ts` - Get/update/delete agent
- `app/api/admin/ai-agents/[id]/resources/route.ts` - Manage training resources
- `app/api/admin/ai-agents/[id]/examples/route.ts` - Manage training examples
- `app/admin/ai-agents/page.tsx` - Agent list with stats
- `app/admin/ai-agents/[id]/page.tsx` - Agent detail/edit page

### Features:
- **Agent Types**: SMS Support, Order Confirmation, Payment Collection, Customer Support, Sales, Shipping
- **Capabilities**: Toggle permissions for SMS, email, orders, refunds, escalation
- **Instructions**: System prompt, personality, greeting message, temperature control
- **Resources**: Add documents, FAQs, policies, procedures for agent context
- **Examples**: Training examples with user message and ideal response
- **Activity Logging**: Track agent actions for transparency
- Default agents created: SMS Support, Order Confirmation, Payment Collection

---

## [2025-12-16] - [FIX] SMS Incoming Webhook Nested Payload

Fixed the incoming SMS webhook to handle the nested payload structure from the Android SMS gateway app.

### Issue:
Android app sends `{ event: "sms:received", payload: { phoneNumber, message, receivedAt } }` but API expected flat structure.

### Fix:
- Updated `/api/sms/incoming` to extract nested `payload` object
- Handles both `sms:received` (incoming) and `sms:sent` (delivery status) events
- Better field name mapping for compatibility

---

## [2025-12-16] - [FEATURE] Multi-Payment Options for Admin Order Creation

Added comprehensive payment options when creating admin orders, including ACH bank transfer, Cash App deep links, Ethereum crypto payments, Stripe invoices, and shareable payment links.

### Files Created:
- `app/api/stripe/invoice/route.ts` - Creates and sends Stripe invoices via email
- `app/api/stripe/payment-link/route.ts` - Creates shareable Stripe payment links
- `app/api/sms/send/route.ts` - Wrapper for sending SMS (forwards to FCM gateway)
- `app/api/admin/orders/[id]/assign-wallet/route.ts` - Assigns business wallet to order for crypto payments
- `components/admin-payment-options-modal.tsx` - Full-featured payment options modal

### Files Modified:
- `app/admin/orders/create/page.tsx` - Integrated new payment options modal
- `app/api/admin/orders/[id]/capture-payment/route.ts` - Updated to handle invoice/payment link pending states

### Payment Methods:
1. **Credit/Debit Card** - Instant Stripe payment (existing)
2. **ACH Bank Transfer** - Bank-to-bank transfer via Stripe (1-3 day processing)
3. **Cash App** - Generate shareable Cash App deep link with amount and order note
4. **Ethereum / USDC** - Uses assigned business wallet from database:
   - Auto-assigns wallet to order if none exists
   - Toggle between ETH and USDC currencies
   - Live ETH price conversion from USD
   - Displays exact crypto amount customer should send
   - EIP-681 payment URI for wallet apps
5. **Send Invoice** - Email professional Stripe invoice to customer
6. **Payment Link** - Generate shareable Stripe payment link (copy or SMS)

### Features:
- Beautiful modal with payment method grid selector
- Copy-to-clipboard for all generated links
- SMS integration to send links directly to customer phone
- Invoice tracks customer email and sends automatically
- Payment links redirect to order confirmation on completion
- Order notes updated to reflect payment method used/sent
- Invoice/payment link states properly tracked as "pending"
- Crypto payments use proper wallet assignment system (not hardcoded addresses)

---

## [2025-12-16] - [FEATURE] Admin Custom Order - Customer Management Improvements

Enhanced customer selection in the custom order creation page with guest checkout, new customer creation, and improved search.

### Files Created:
- `app/api/admin/customers/create/route.ts` - API endpoint for creating new customers inline

### Files Modified:
- `app/admin/orders/create/page.tsx` - Added guest checkout, new customer form, improved search UI
- `app/api/admin/orders/create/route.ts` - Added guest checkout support (auto-creates guest customer record)

### Features:
- **Guest Checkout**: One-click guest checkout button that creates an anonymous customer record
- **New Customer Form**: Inline form to create customers without leaving the order page
  - First/Last Name, Email, Phone, Company fields
  - Customer Type toggle (Retail/B2B)
  - Creates user record if email provided
- **Improved Customer Search**: 
  - Search icon in input field
  - Click-outside to close dropdown
  - Shows total orders and amount spent per customer
  - "Create new customer" option when no results found
- **Better Customer Display**: Shows phone, type badge, and full address when selected

---

## [2025-12-16] - [FEATURE] Admin Custom Order Creation

Added a comprehensive custom order creation feature for admin users to manually build orders from inventory or add custom items.

### Files Created:
- `app/admin/orders/create/page.tsx` - Full custom order creation page with inventory browser
- `app/api/admin/orders/create/route.ts` - API endpoint for creating custom orders

### Files Modified:
- `app/admin/orders/page.tsx` - Added "Create Order" button with navigation
- `app/api/admin/products/route.ts` - Updated to include full category data (id, name, color)

### Features:
- **Inventory Browser**: Expandable product list with variant selection
- **Quantity & Price Controls**: Per-variant quantity input with adjustable pricing
- **Custom Items**: Add items not in inventory with custom name, quantity, and price
- **Customer Selection**: Searchable customer dropdown with B2B/Retail badges
- **Order Summary**: Live-updating sidebar with subtotal, shipping, discount, and total
- **Shipping & Discount**: Adjustable shipping and discount amounts
- **Notes**: Internal order notes field
- **Stock Deduction**: Automatically deducts stock for inventory items on order creation
- **Custom Numeric Keypad**: Mobile-optimized on-screen keypad for all number inputs

### UI Highlights:
- Matches existing inventory and order detail styling
- Dark glassmorphism design with backdrop blur
- Motion animations for feedback
- Responsive layout (desktop sidebar, mobile stacked)
- Visual indicators for items in order (green highlight)
- Purple highlight for custom items
- Full-screen numeric keypad on mobile (bottom sheet) and desktop (centered modal)

---

## [2025-12-16] - [FEATURE] Privacy Policy Page

Added a comprehensive privacy policy page at `/privacy` that matches the store's design system.

### Files Created:
- `app/privacy/page.tsx` - Full privacy policy page with all 15 sections

### Features:
- Dark glassmorphism design matching store aesthetic
- Responsive layout with proper typography hierarchy
- Numbered section markers with circular badges
- Highlighted commitment and never-sell sections
- California (CCPA/CPRA) privacy rights section
- Contact section with email link
- SEO metadata included
- Uses GlobalNav and standard footer

### Sections Included:
1. Introduction
2. Information We Collect
3. How We Use Your Information
4. Information We Will Never Sell or Disclose
5. Limited Exceptions to Non-Disclosure
6. Data Security
7. Data Retention
8. Cookies and Tracking Technologies
9. Your Rights and Choices
10. Children's Privacy
11. California Privacy Rights
12. International Users
13. Changes to This Privacy Policy
14. Contact Us
15. Governing Law

---

## [2025-12-16] - [FEATURE] Revolut Business API Integration

Added full Revolut Business API integration for business banking operations including transfers, exchanges, and counterparty management.

### Files Created:
- `lib/revolut.ts` - Revolut API client library with full type definitions
- `app/api/revolut/accounts/route.ts` - List accounts and balances
- `app/api/revolut/counterparties/route.ts` - List/create counterparties
- `app/api/revolut/transactions/route.ts` - Transaction history
- `app/api/revolut/transfers/route.ts` - Create transfers/payments
- `app/api/revolut/exchange/route.ts` - Currency exchange and rates
- `app/api/revolut/transfer-reasons/route.ts` - Transfer reason codes
- `app/api/revolut/webhooks/route.ts` - Webhook management
- `app/admin/revolut/page.tsx` - Full admin dashboard for Revolut

### Features:
- Multi-currency account overview with balance cards
- View all business accounts with detailed information
- Create transfers to counterparties (individuals and businesses)
- Transaction history with search and type filtering
- Counterparty management (add IBAN, SWIFT, local accounts)
- Currency exchange with live rate preview
- API status and settings panel
- Revolut brand styling with blue accent color
- Quick actions (send transfer, exchange, add counterparty)
- Direct links to Revolut Business dashboard

### Environment Variables Required:
```
REVOLUT_API_KEY=your_api_key
REVOLUT_ENVIRONMENT=sandbox|production
```

### Documentation:
- [Revolut Business API Docs](https://developer.revolut.com/docs/business/)
- [Create Transfer Guide](https://developer.revolut.com/docs/business/create-payment)

---

## [2025-12-16] - [FEATURE] Stripe Elements Card Payment Integration

Added credit/debit card payment support using Stripe Elements with Payment Intents API.

### Files Created:
- `app/api/stripe/payment/route.ts` - Simple proxy endpoint for creating PaymentIntent (only sends amount to Stripe)
- `app/api/orders/confirm-payment/route.ts` - Updates order status after successful payment
- `components/stripe-payment-form.tsx` - Payment Element form component
- `components/stripe-checkout-wrapper.tsx` - Stripe Elements provider wrapper
- `app/payment/card/page.tsx` - Card payment page
- `supabase/migrations/add_stripe_payment_intent.sql` - Database migration

### Files Modified:
- `components/payment-icons.tsx` - Added CreditCardIcon component
- `app/payment/page.tsx` - Added card payment option to payment hub
- `package.json` - Added @stripe/stripe-js and @stripe/react-stripe-js

### Features:
- Secure card payments via Stripe Elements
- Dark theme UI matching site design
- Automatic payment method detection (supports Apple Pay, Google Pay)
- Client-side payment confirmation (no webhook needed)
- Order status updates on successful payment

### Environment Variables Required:
- `STRIPE_SECRET_KEY` - Stripe secret key (already exists)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (already exists)

### Database Migration:
Run `supabase/migrations/add_stripe_payment_intent.sql` to add stripe_payment_intent_id column.

---

## [2025-12-12] - [FIX] Email Confirmation Loading Loop

Fixed an issue where users clicking the email confirmation link would get stuck in an infinite loading loop on the login page.

### Problem:
- When users clicked the confirmation link from their email, Supabase redirected them to `/login#access_token=...&type=signup`
- The login page wasn't processing these URL hash tokens
- This caused the page to hang in a loading state

### Solution:
- Added a `useEffect` hook in the login page to detect and process email confirmation tokens from the URL hash
- The hook extracts `access_token`, `refresh_token`, and `type` from the hash
- Calls `supabase.auth.setSession()` to validate the tokens and establish the session
- Shows a "Email Confirmed!" success message with automatic redirect to dashboard
- Clears the URL hash after processing to prevent reprocessing

### Files Modified:
- `app/(auth)/login/page.tsx` - Added email confirmation callback handler and success UI

---

## [2025-12-10] - [FEATURE] Supplier Portal

Added a custom supplier portal with restricted access to inventory and payments sections.

### Files Created:
- `app/supplier/layout.tsx` - Supplier layout with auth guard
- `app/supplier/page.tsx` - Supplier dashboard with quick links and stats
- `app/supplier/inventory/page.tsx` - Read-only inventory view with search, stats, and product details
- `app/supplier/payments/page.tsx` - Payments view with overview, customers, wire transfers, and messaging
- `components/supplier-auth-guard.tsx` - Client-side authentication guard for supplier routes

### Files Modified:
- `lib/auth-utils.ts` - Added `verifySupplier()` function for server-side auth
- `components/global-nav.tsx` - Added supplier navigation items and route detection
- `ARCHITECTURE.md` - Documented supplier role and portal

### Features:
- **Dashboard** - Quick links to inventory and payments, overview stats
- **Inventory** - View products, variants, stock levels, pricing (read-only)
- **Payments** - View payment records, wire transfers, customer payment history
- **Messaging** - Two-way communication with admin
- **Navigation** - Dedicated supplier menu in GlobalNav

### Access Control:
- Users must have `role: 'supplier'` in the users table
- Protected by client-side `SupplierAuthGuard` component
- Server-side validation via `verifySupplier()` function

