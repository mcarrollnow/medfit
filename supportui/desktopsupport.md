Thought for 3s### Desktop Health Pro Agent - Complete System Documentation

## System Overview

A desktop-optimized AI-powered customer support interface built with Next.js 16, React 19, AI SDK v5, and Anthropic's Claude. The system features a split-screen layout with a main chat interface on the left and a persistent, collapsible sidebar on the right for support ticket management, customer profiles, and administrative tools. Designed for large screens (1024px and above) with enhanced productivity features and multi-column layouts.

---

## Core Architecture

### Technology Stack

- **Framework**: Next.js 16 (App Router)
- **AI Integration**: Vercel AI SDK v5 with Anthropic Claude
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui component library
- **State Management**: React hooks (useState, useEffect) + AI SDK's useChat hook


### Design System

- **Color Scheme**: Monochromatic black and white theme
- **Theme Support**: Light and dark mode with system preference detection
- **Typography**: Clean, readable fonts optimized for extended desktop use
- **Layout**: Split-screen design with resizable sidebar (400px default width)


### Desktop-Specific Optimizations

- **Multi-column layouts**: Better use of horizontal space
- **Persistent sidebar**: Always visible, collapsible for focus mode
- **Hover states**: Enhanced interactivity with mouse
- **Keyboard shortcuts**: Quick navigation and actions (future)
- **Larger content areas**: More information visible at once


---

## 1. Main Chat Interface (Left Panel)

### Purpose

Primary customer-facing interface where support agents interact with the AI and customers through text, voice, images, and files. Occupies the left side of the screen with a maximum width for optimal readability.

### Layout

- **Width**: Flexible, expands when sidebar is collapsed
- **Max Width**: 1200px for comfortable reading
- **Height**: Full viewport height (100vh)
- **Position**: Fixed left panel


### Features

#### 1.1 Header Section

**Components:**

- Eagle logo (theme-aware: black for light mode, white for dark mode)
- App title: "Medfit 90 Agent"
- Theme toggle button (sun/moon icon)
- Sidebar toggle button (menu icon with collapse/expand functionality)


**Functionality:**

- Logo displays appropriate version based on current theme (32x32px)
- Theme toggle switches between light/dark mode with localStorage persistence
- Sidebar toggle collapses/expands right panel for focused chat view
- Header remains fixed at top during scroll


**Desktop Enhancements:**

- Larger logo size (32px vs 24px mobile)
- More spacing between elements
- Hover states on all interactive elements
- Smooth transitions for theme changes


#### 1.2 Message Display Area

**Components:**

- Scrollable message container with custom scrollbar
- User messages (right-aligned, max-width for readability)
- AI messages (left-aligned, max-width for readability)
- Empty state with welcome message and large eagle logo
- Message timestamps
- Read receipts (future)


**Functionality:**

- Auto-scrolls to bottom when new messages arrive
- Displays chronological conversation history
- Shows typing indicator during AI response generation
- Messages styled with appropriate background colors based on sender
- Smooth scroll behavior
- Message grouping by sender and time


**Desktop Enhancements:**

- Wider message bubbles (max 600px vs 280px mobile)
- Better typography with larger font sizes
- More padding and spacing for comfortable reading
- Custom scrollbar styling
- Hover effects on messages for actions (copy, delete, etc.)


#### 1.3 Hot Buttons (Quick Actions)

**Components:**

- Three action buttons: Summarize, Quick Answer, Explain
- Icon-based design with labels
- Horizontal layout above input area


**Functionality:**

- Pre-defined prompts that users can click for common actions
- Sends formatted message to AI with specific instruction
- Provides quick access to frequently used commands
- Reduces typing for common support requests
- Visual feedback on hover and click


**Desktop Enhancements:**

- Larger buttons with more padding (h-10 vs h-9 mobile)
- Hover states with subtle background changes
- Keyboard shortcuts displayed on hover (future)
- More spacing between buttons


#### 1.4 Input Area

**Components:**

- Multi-line text input field with placeholder
- File attachment button (paperclip icon)
- Camera capture button
- Voice memo button (microphone icon)
- Send button (arrow icon)


**Functionality:**

- **Text Input**:

- Auto-expanding textarea (up to 5 lines)
- Shift+Enter for new line, Enter to send
- Character count indicator (future)
- Typing indicators sent to AI (future)



- **File Attachment**:

- Opens file picker for document uploads
- Supports PDF, images, documents
- Drag-and-drop support
- File preview before sending
- Multiple file selection



- **Camera Capture**:

- Activates webcam for photo capture
- Preview before sending
- Annotation tools (future)



- **Voice Memo**:

- Records audio messages
- Waveform visualization during recording
- Playback before sending
- Automatic transcription (future)



- **Send Button**:

- Submits message to AI via API route
- Disabled when input is empty
- Loading state during submission
- Keyboard shortcut (Enter)





**Technical Implementation:**

- Uses AI SDK v5's `useChat` hook for message management
- Handles file uploads with base64 encoding
- Manages loading states automatically
- Streams AI responses in real-time
- Error handling with retry logic


**Desktop Enhancements:**

- Larger input area with more height
- Better file drag-and-drop zone
- Hover states on all buttons
- Keyboard shortcuts prominently displayed
- More spacing between action buttons


---

## 2. Sidebar System (Right Panel)

### Purpose

Comprehensive administrative interface for managing support tickets, viewing customer data, and accessing support tools. Persistent panel on the right side of the screen.

### Architecture

- **Width**: 400px default (collapsible to 0px)
- **Height**: Full viewport height
- **Position**: Fixed right panel
- **Behavior**: Collapsible with smooth animation
- **Content**: Scrollable with custom scrollbar


### Layout Features

- Fixed header with tabs
- Scrollable content area
- Smooth collapse/expand animation
- Maintains state when collapsed
- Remembers active tab


---

### 2.1 Support Tickets Tab

#### Overview

Displays all active support tickets with filtering, search, and expandable detail views. Optimized for desktop with better information density.

#### Features

**Ticket List View:**

- Displays ticket cards with:

- Ticket ID (larger, more prominent)
- Customer name
- Issue subject (longer preview on desktop)
- Priority badge (High/Medium/Low with color coding)
- Timestamp (relative time with hover for absolute)
- Status indicator
- Chevron icon for expansion
- Quick action buttons on hover





**Filter System:**

- Filter by status: All, Open, In Progress, Resolved
- Horizontal button group layout
- Active filter highlighted
- Updates ticket list in real-time based on selection
- Filter count badges


**Search Functionality:**

- Search bar at top with icon
- Filters tickets by ID, customer name, or subject
- Real-time search as you type
- Clear button when search is active
- Search history dropdown (future)


**Desktop Enhancements:**

- More tickets visible at once (better vertical space)
- Hover states show quick actions (assign, close, etc.)
- Right-click context menu (future)
- Keyboard navigation (arrow keys, Enter to expand)
- Multi-select for batch operations (future)


#### Expandable Ticket Cards

When a ticket is clicked, it expands to show:

1. **Collapsed preview** (always visible at top)
2. **Four rotating tab views** below the preview


**Desktop Layout Differences:**

- Wider cards with more horizontal space
- Better typography and spacing
- More information visible without scrolling
- Side-by-side layouts where appropriate


---

#### 2.1.1 Order Details (Default View)

**Purpose:** Display complete order information for the support ticket

**Components:**

**Itemized Receipt Section:**

- Product table with columns:

- Product name
- Quantity
- Unit price
- Total price



- Subtotal row
- Tax row (with percentage)
- Shipping cost row
- **Total amount** (bold, larger font)


**Payment Information Card:**

- Payment method label
- Crypto wallet address (monospace font, copyable)
- Copy button with success feedback
- Transaction ID
- Payment timestamp
- Payment status badge


**Order Timeline:**

- Vertical timeline with connecting lines
- Five stages with icons and timestamps:

1. **Order Placed** - Shopping bag icon
2. **Order Approved** - Check circle icon
3. **Payment Made** - Dollar sign icon
4. **Order Shipped** - Truck icon
5. **Order Delivered** - Package icon



- Completed stages in accent color
- Current stage highlighted
- Future stages in muted color
- Estimated times for pending stages


**Tracking Information Card:**

- Carrier name with logo
- Tracking number (large, copyable)
- Copy button
- Current status badge
- Last update timestamp
- Estimated delivery date
- "Track Package" external link button


**Desktop Enhancements:**

- Two-column layout for better space usage
- Receipt and payment info side-by-side
- Timeline more spacious with larger icons
- Hover states on copyable elements
- Quick actions visible on hover


**Functionality:**

- Default view when ticket expands
- Provides complete order context for support agents
- Copy buttons for wallet address and tracking number
- External link to carrier tracking page
- All information read-only but actionable


---

#### 2.1.2 Conversation Tab

**Purpose:** View and manage all communication related to the ticket

**Layout:**

- Horizontal sub-tabs at top
- Full-height scrollable message area
- Message input at bottom (for admin responses)


**Sub-Tabs:**

**A. Full Conversation**

**Components:**

- Complete chronological thread of all messages
- Message bubbles with sender identification
- Date separators for multi-day conversations
- Timestamp for each message
- Sender avatars (customer, AI, admin)
- Message status indicators (sent, delivered, read)


**Message Types:**

- **Customer messages**: Right-aligned, distinct color
- **AI agent responses**: Left-aligned, AI badge
- **Admin messages**: Left-aligned, admin badge


**Features:**

- Auto-scroll to latest message
- Scroll to top loads older messages (pagination)
- Search within conversation
- Filter by sender type
- Export conversation as PDF/text


**Desktop Enhancements:**

- Wider message bubbles for better readability
- Hover actions on messages (reply, copy, delete)
- Right-click context menu
- Keyboard shortcuts for navigation
- Better timestamp formatting


**B. Admin Only**

**Purpose:** Private thread between AI and human admins

**Components:**

- Private message thread (not visible to customers)
- AI system updates and notifications
- Admin internal notes and strategy discussions
- Action logs (ticket assigned, status changed, etc.)


**Message Types:**

- **AI System Updates**:

- "Ticket assigned to AI Agent"
- "Customer responded after 2 hours"
- "Sentiment analysis: Customer frustrated"
- "Suggested resolution: Offer 15% discount"



- **Admin Internal Notes**:

- Strategy discussions
- Escalation notes
- Customer history context
- Resolution plans





**Features:**

- Timestamp and sender identification
- Color-coded by message type
- Searchable and filterable
- Add new admin note with rich text editor
- Tag other admins (future)
- Pin important messages


**Desktop Enhancements:**

- Split view option (full conversation + admin only side-by-side)
- Rich text editor for admin notes
- Markdown support
- @mentions for team collaboration
- Threaded replies (future)


**Functionality:**

- Horizontal sub-tabs switch between Full and Admin views
- Provides context for support decisions
- Enables AI-human collaboration on complex issues
- Maintains audit trail of all communications
- Real-time updates when new messages arrive


---

#### 2.1.3 Customer Profile Tab

**Purpose:** Comprehensive customer information and history

**Layout:**

- Scrollable content area
- Card-based sections
- Collapsible sections for better organization


**Components:**

**Customer Overview Card:**

- Customer avatar/initials
- Full name (large, prominent)
- Email address (clickable to compose)
- Phone number (clickable to call)
- Customer since date
- Account status badge (Active, VIP, At Risk, etc.)


**Customer Statistics Grid:**

- **Total Amount Spent**: Large number with currency
- **Total Orders**: Count with trend indicator
- **Average Order Value**: Calculated metric
- **Lifetime Value**: Projected value
- **Support Tickets**: Total count with resolved percentage
- **Satisfaction Rating**: Star rating with score
- **Response Time**: Average time to respond
- **Return Rate**: Percentage with comparison to average


**Order History Section:**

- Section header with total order count
- Search and filter controls
- Sortable order list (by date, amount, status)


**Order Cards:**
Each order displays:

- Order number (clickable)
- Order date
- Total amount
- Status badge (Delivered, Shipped, Processing, Cancelled)
- Item count
- Quick view icon


**Expandable Order Details:**
When an order card is clicked:

- Expands inline to show full order details
- Same information as Order Details tab:

- **Itemized Receipt**: Product list with prices
- **Payment Information**: Payment method and wallet
- **Order Timeline**: Visual timeline with stages
- **Tracking Info**: Carrier and tracking number



- Collapse button to return to list view
- "View Full Order" button to open in new context


**Admin Notes Section:**

- Section header with note count
- Add new note button (prominent)
- List of historical notes


**Note Cards:**
Each note displays:

- Note content (expandable if long)
- Author name and avatar
- Timestamp (relative with hover for absolute)
- Edit/delete buttons (if author)
- Tags/categories
- Linked ticket reference (if applicable)


**Add Note Interface:**

- Rich text editor
- Category/tag selector
- Visibility toggle (private vs. team-wide)
- Save and cancel buttons


**Customer Tags:**

- Visual tags for customer attributes
- Examples: "VIP", "High Value", "Frequent Buyer", "At Risk"
- Color-coded by category
- Clickable to filter other customers with same tag


**Desktop Enhancements:**

- Two-column layout for overview and stats
- More orders visible without scrolling
- Hover states on order cards show quick actions
- Inline editing of customer information
- Drag-and-drop to reorder notes by priority
- Export customer data as CSV/PDF


**Functionality:**

- Provides complete customer context for support decisions
- Helps identify VIP customers or repeat issues
- Order history cards are clickable for detailed view
- Admin notes persist across all tickets for this customer
- Stats help prioritize support efforts
- Real-time updates when customer places new order
- Integration with CRM system (future)


---

#### 2.1.4 Resolve Tab

**Purpose:** Tools and actions to resolve the support ticket efficiently

**Layout:**

- Vertical sections with clear separation
- Action buttons prominently placed
- Form inputs with validation
- Success/error feedback


**Components:**

**1. Discount Code Section**

**Header:** "Apply Discount Code"

**Two Modes (Toggle):**

**A. Generator Mode:**

- **Discount Type Selector:**

- Radio buttons: Percentage or Fixed Amount
- Visual indication of selected type



- **Discount Value Input:**

- Number input with validation
- Percentage: 1-100 with % symbol
- Fixed: Currency input with $ symbol
- Real-time preview of discount



- **Expiration Date Picker:**

- Calendar popup
- Quick select options (1 day, 1 week, 1 month, custom)
- Timezone display
- "No expiration" checkbox



- **Usage Limit Settings:**

- Number input for max uses
- "Unlimited" checkbox
- Per-customer limit toggle
- Minimum order value (optional)



- **Generate Button:**

- Large, prominent button
- Generates unique alphanumeric code
- Shows loading state during generation
- Success animation on completion



- **Generated Code Display:**

- Large, monospace font
- Copy to clipboard button
- Success feedback on copy
- "Apply to Order" button
- "Send to Customer" button





**B. Custom Code Mode:**

- **Code Input Field:**

- Text input for manual code entry
- Validation (checks if code exists)
- Format requirements displayed



- **Same Configuration Options:**

- Discount type and value
- Expiration date
- Usage limits
- Minimum order value



- **Apply Button:**

- Validates code
- Applies to current order
- Shows confirmation





**Code History:**

- List of recently generated/applied codes
- Code, discount, expiration, uses remaining
- Quick copy and reapply buttons


---

**2. Admin Notes to Customer Profile**

**Header:** "Add Note to Customer Profile"

**Components:**

- **Rich Text Editor:**

- Bold, italic, underline formatting
- Bullet and numbered lists
- Link insertion
- Markdown support
- Preview mode



- **Note Category Selector:**

- Dropdown: General, Issue, Preference, Warning, VIP
- Color-coded categories
- Custom category option



- **Visibility Toggle:**

- Private (only you)
- Team (all admins)
- Public (visible to customer - future)



- **Priority Selector:**

- Low, Medium, High, Urgent
- Affects note ordering in profile



- **Save Button:**

- Validates input
- Saves to customer's permanent profile
- Shows success confirmation
- Note appears immediately in Customer Profile tab





**Functionality:**

- Notes are saved to customer's permanent profile
- Visible in future tickets for this customer
- Timestamp and author automatically recorded
- Searchable across all customer notes
- Can be edited/deleted by author
- Audit trail maintained


---

**3. Action Buttons**

**A. Request More Info**

**Button:** Large, secondary style

**Functionality:**

- Opens modal with message template
- Pre-filled with common questions based on issue type
- Editable message field
- Send button
- On send:

- Message sent to customer via email/SMS
- Ticket status changed to "Waiting on Customer"
- Follow-up reminder set (configurable time)
- Tracks response time
- Notification when customer responds





**Desktop Enhancement:**

- Modal with larger text area
- Template selector with preview
- Scheduled send option
- Multiple contact method selection


---

**B. Assign to AI**

**Button:** Large, with AI icon

**Functionality:**

- Transfers ticket to AI agent for autonomous handling
- Confirmation dialog with AI capabilities summary
- AI takes over conversation with customer
- Admin can monitor in Admin Only thread
- AI provides regular updates on resolution progress
- Admin can take back control at any time


**AI Updates Include:**

- "Analyzing customer issue..."
- "Proposed solution: [details]"
- "Waiting for customer response"
- "Issue resolved, closing ticket"
- "Escalation needed: [reason]"


**Desktop Enhancement:**

- Shows AI confidence score
- Displays AI's proposed action plan
- Option to set AI parameters (tone, aggressiveness, etc.)
- Real-time AI thinking process visible


---

**C. Mark as Resolved**

**Button:** Large, primary style (green accent)

**Functionality:**

- Opens resolution modal
- **Resolution Summary:**

- Text area for resolution notes
- Resolution category selector
- Time spent on ticket (auto-calculated)



- **Customer Satisfaction:**

- Option to send satisfaction survey
- Survey template selector
- Scheduled send time



- **Follow-up:**

- Schedule follow-up check-in (optional)
- Set reminder for admin



- **Confirm Button:**

- Closes ticket
- Updates ticket status to "Resolved"
- Sends survey to customer (if selected)
- Archives conversation
- Updates ticket statistics
- Triggers any post-resolution workflows





**Desktop Enhancement:**

- Larger modal with more options
- Resolution analytics preview
- Related ticket suggestions
- Export ticket summary as PDF


---

**4. Additional Quick Actions**

**Escalate Ticket:**

- Button to escalate to senior support
- Reason selector
- Urgency level
- Notification to escalation team


**Transfer Ticket:**

- Assign to specific admin
- Department selector
- Transfer note
- Notification to recipient


**Merge Tickets:**

- Search for related tickets
- Select tickets to merge
- Combined view of all conversations


**Desktop Enhancements:**

- All actions have keyboard shortcuts
- Hover tooltips explain each action
- Confirmation dialogs prevent accidents
- Undo functionality for recent actions
- Batch actions for multiple tickets (future)


---

#### Rotating Tab Navigation

**How It Works:**

- Four views: Order Details, Conversation, Customer Profile, Resolve
- Three tabs always visible showing the OTHER views
- Active view is not shown in tabs
- Clicking a tab navigates to that view and rotates the tab bar
- Smooth transition animation between views


**Example Flow:**

1. Ticket expands → Shows **Order Details** by default
2. Tabs visible: `Conversation | Customer Profile | Resolve`
3. Click "Conversation" → Now viewing **Conversation**
4. Tabs update to: `Order Details | Customer Profile | Resolve`
5. Click "Resolve" → Now viewing **Resolve**
6. Tabs update to: `Order Details | Conversation | Customer Profile`


**Desktop Enhancements:**

- Tabs have hover states
- Keyboard shortcuts (Ctrl+1, Ctrl+2, etc.)
- Tab history (back/forward navigation)
- Breadcrumb trail showing navigation path
- Quick jump menu (Ctrl+K) to any section


**Purpose:**

- Maximizes screen space
- Always shows available navigation options
- Intuitive carousel-style navigation
- Reduces cognitive load by hiding current view from tabs
- Maintains context with collapsed preview always visible


---

### 2.2 Conversation History Tab

#### Purpose

Searchable archive of all past chat conversations across all customers. Provides historical context and training data for AI improvements.

#### Layout

- Search bar at top
- Filter controls below search
- Scrollable conversation list
- Conversation detail view (expandable or modal)


#### Features

**Search Functionality:**

- **Search Bar:**

- Large input field with search icon
- Placeholder: "Search conversations..."
- Real-time search as you type
- Clear button when search is active
- Search suggestions dropdown



- **Search Capabilities:**

- Customer name
- Message content (full-text search)
- Date range
- Ticket ID
- Order number
- Keywords and tags





**Filter Controls:**

- **Date Range Selector:**

- Calendar popup for start and end dates
- Quick select options:

- Today
- Last 7 days
- Last 30 days
- Last 90 days
- Custom range



- Clear filter button



- **Customer Filter:**

- Dropdown with customer list
- Search within dropdown
- Multi-select capability
- "All Customers" option



- **Status Filter:**

- Resolved vs. Unresolved
- Active vs. Archived
- Multi-select checkboxes



- **Handler Filter:**

- AI-handled
- Admin-handled
- Mixed (both AI and admin)
- Specific admin selector



- **Tag Filter:**

- Common tags (Refund, Shipping, Product Question, etc.)
- Custom tags
- Multi-select





**Conversation List:**

Each conversation card displays:

- **Customer Name/ID:** Bold, prominent
- **Last Message Preview:** Truncated to 2 lines
- **Timestamp:** Relative time (e.g., "2 hours ago")
- **Message Count Badge:** Total messages in thread
- **Unread Indicator:** Red dot if unread messages
- **Status Badge:** Resolved, Active, Archived
- **Handler Badge:** AI or Admin icon
- **Tags:** Visual tag chips
- **Quick Actions (on hover):**

- View full conversation
- Create new ticket from conversation
- Export conversation
- Delete conversation





**Sorting Options:**

- Sort by: Most Recent, Oldest, Most Messages, Customer Name
- Ascending/Descending toggle


**Pagination:**

- Load more button at bottom
- Or infinite scroll
- Shows "X of Y conversations" count


**Conversation Detail View:**

When a conversation is clicked:

- **Modal or Expandable Panel:**

- Full conversation thread (read-only)
- All messages with timestamps
- Sender identification
- Date separators
- Message search within conversation



- **Conversation Metadata:**

- Customer information
- Ticket ID (if linked)
- Order ID (if linked)
- Start and end timestamps
- Total duration
- Handler(s)
- Resolution status
- Tags



- **Actions:**

- Create New Ticket from this conversation
- Export as PDF/Text/JSON
- Print conversation
- Share link (internal)
- Delete conversation (with confirmation)





**Desktop Enhancements:**

- Two-column layout: list on left, detail on right
- More conversations visible at once
- Advanced search with boolean operators
- Saved search filters
- Bulk actions (export multiple, delete multiple)
- Conversation analytics (sentiment, topics, etc.)
- Export filtered results as CSV


**Functionality:**

- Provides searchable archive of all interactions
- Helps identify recurring issues and patterns
- Training data for AI improvements
- Compliance and record-keeping
- Customer history for context in new tickets
- Analytics on conversation trends
- Quality assurance and admin performance review


---

### 2.3 Support Tools Tab

#### Purpose

Collection of administrative utilities for customer support operations. Provides quick access to common tasks and tools.

#### Layout

- **Tool Grid:**

- 2-column grid layout
- Icon-based cards for each tool
- Tool name and brief description
- Click to open full tool interface



- **Tool Categories (future):**

- Customer Management
- Order Management
- Financial Tools
- Analytics & Reporting





#### Available Tools

---

**1. Discount Code Generator**

**Card Display:**

- Icon: DollarSign
- Title: "Discount Code Generator"
- Description: "Create promotional codes"


**Full Tool Interface:**

**Header:**

- Tool title
- Back button to tool grid
- Help icon with tooltip


**Form Sections:**

**A. Code Configuration:**

- **Code Type:**

- Auto-generate (random alphanumeric)
- Custom code (manual entry)
- Toggle between modes



- **Discount Type:**

- Radio buttons: Percentage or Fixed Amount
- Visual indication of selection



- **Discount Value:**

- Number input with validation
- Percentage: 1-100 with % symbol
- Fixed: Currency input with $ symbol
- Real-time discount preview





**B. Restrictions:**

- **Expiration Date:**

- Date picker with calendar
- Time picker for specific expiration time
- "No expiration" checkbox
- Timezone selector



- **Usage Limits:**

- Total uses: Number input or "Unlimited"
- Per customer: Number input or "Unlimited"
- Minimum order value: Currency input (optional)
- Maximum discount amount: Currency input (optional)



- **Product Restrictions:**

- Apply to: All products, Specific products, Categories
- Product/category selector (multi-select)
- Exclude products option



- **Customer Restrictions:**

- All customers
- Specific customers (multi-select)
- Customer segments (VIP, New, etc.)
- First-time customers only





**C. Additional Settings:**

- **Code Prefix:** Text input (e.g., "SAVE", "VIP")
- **Description:** Text area for internal notes
- **Active Status:** Toggle (active/inactive)
- **Stackable:** Can be combined with other codes


**Actions:**

- **Generate/Create Button:** Large, primary
- **Save as Draft:** Secondary button
- **Cancel:** Tertiary button


**Generated Code Display:**

- Large code in monospace font
- Copy to clipboard button with feedback
- QR code for code (future)
- Share options (email, SMS)
- "Create Another" button


**Code Management:**

- **Active Codes List:**

- Table view of all active codes
- Columns: Code, Type, Value, Uses, Expiration, Status
- Sort by any column
- Search codes
- Quick actions: Edit, Deactivate, Delete, Copy



- **Code Analytics:**

- Total codes created
- Total uses
- Total discount amount given
- Most popular codes
- Conversion rate





**Desktop Enhancements:**

- Split view: form on left, preview on right
- Bulk code generation
- Import codes from CSV
- Export code list
- Code templates for common discounts
- A/B testing for codes (future)


---

**2. Order History Search**

**Card Display:**

- Icon: Package
- Title: "Order History"
- Description: "Search and manage orders"


**Full Tool Interface:**

**Search Section:**

- **Search Bar:**

- Large input field
- Placeholder: "Search by order #, customer, email..."
- Search button
- Advanced search toggle



- **Advanced Search Filters:**

- Date range picker
- Order status multi-select
- Amount range (min-max)
- Payment method
- Shipping method
- Product filter
- Customer filter





**Results Display:**

**Order Table:**

- Columns:

- Order Number (clickable)
- Customer Name
- Date
- Total Amount
- Status Badge
- Payment Method
- Actions



- **Sorting:** Click column headers to sort
- **Pagination:** 25/50/100 per page
- **Export:** Export results as CSV/Excel


**Order Detail View:**

When order number is clicked:

- **Modal or Expandable Row:**

- Full order details
- Same as Order Details in ticket view:

- Itemized receipt
- Payment information
- Order timeline
- Tracking information






- **Quick Actions:**

- View Customer Profile
- Create Support Ticket
- Process Refund
- Resend Confirmation Email
- Cancel Order
- Edit Order (if not shipped)
- Print Invoice
- Print Packing Slip





**Order Statistics:**

- Total orders in results
- Total revenue
- Average order value
- Most common products
- Status breakdown (pie chart)


**Desktop Enhancements:**

- Multi-column table with more data visible
- Inline editing of order details
- Bulk actions (export, refund, cancel multiple)
- Saved search filters
- Order timeline visualization
- Revenue charts and graphs


---

**3. Customer Lookup**

**Card Display:**

- Icon: User
- Title: "Customer Lookup"
- Description: "View customer profiles"


**Full Tool Interface:**

**Search Section:**

- **Search Bar:**

- Input field with icon
- Placeholder: "Search by name, email, phone, or customer ID..."
- Real-time search suggestions
- Recent searches dropdown



- **Search Results:**

- List of matching customers
- Each result shows:

- Name
- Email
- Phone
- Customer since
- Total orders
- Total spent



- Click to view full profile





**Customer Profile View:**

**Same as Customer Profile Tab in Tickets:**

**A. Customer Overview:**

- Avatar/initials
- Full name
- Contact information (email, phone)
- Customer since date
- Account status


**B. Customer Statistics:**

- Total amount spent
- Total orders
- Average order value
- Lifetime value
- Support tickets count
- Satisfaction rating
- Response time average
- Return rate


**C. Order History:**

- List of all orders
- Expandable order details
- Search and filter orders
- Sort by date, amount, status


**D. Support Ticket History:**

- List of all tickets
- Ticket status and resolution
- Click to view full ticket


**E. Admin Notes:**

- All notes for this customer
- Add new note
- Edit/delete existing notes
- Filter by category


**F. Customer Tags:**

- Visual tags (VIP, High Value, etc.)
- Add/remove tags
- Tag management


**G. Communication History:**

- All emails sent
- All SMS sent
- All chat conversations
- Timeline view


**Actions:**

- Edit Customer Information
- Merge with Another Customer
- Delete Customer (with confirmation)
- Export Customer Data
- Send Email
- Send SMS
- Create Support Ticket
- Apply Discount Code


**Desktop Enhancements:**

- Split view: search on left, profile on right
- Tabbed interface for different profile sections
- Inline editing of customer information
- Customer comparison (side-by-side profiles)
- Customer segmentation tools
- Export customer list


---

**4. Refund Processor**

**Card Display:**

- Icon: CreditCard
- Title: "Refund Processor"
- Description: "Process customer refunds"


**Full Tool Interface:**

**Step 1: Order Lookup**

- **Order Number Input:**

- Text field
- "Look Up Order" button
- Or select from recent orders dropdown





**Step 2: Order Details Display**

- Shows order information:

- Customer name
- Order date
- Original amount
- Payment method
- Order items





**Step 3: Refund Configuration**

**Refund Amount:**

- **Full Refund:** Radio button (auto-fills total amount)
- **Partial Refund:** Radio button

- Amount input field
- Percentage slider (0-100%)
- Real-time calculation of refund amount
- Shows remaining amount





**Refund Reason:**

- Dropdown selector:

- Damaged Item
- Wrong Item Sent
- Customer Changed Mind
- Product Defect
- Shipping Delay
- Customer Service Gesture
- Other (with text field)





**Refund Method:**

- Original payment method (default)
- Store credit
- Different payment method (manual entry)


**Restocking:**

- "Restock items" checkbox
- Affects inventory automatically


**Additional Notes:**

- Text area for internal notes
- Notes for accounting/records
- Customer-facing message (optional)


**Step 4: Review & Confirm**

- Summary of refund:

- Order number
- Customer name
- Refund amount
- Refund reason
- Refund method
- Restocking status



- **Confirmation Checkboxes:**

- "I have verified the refund details"
- "Customer has been notified"



- **Process Refund Button:**

- Large, primary button
- Shows loading state during processing
- Success confirmation on completion





**Post-Refund Actions:**

- Send confirmation email to customer
- Update order status
- Create refund record
- Update inventory (if restocked)
- Log action in customer profile
- Generate refund receipt


**Refund History:**

- List of recent refunds
- Filter by date, customer, amount
- Export refund report
- Refund analytics


**Desktop Enhancements:**

- Multi-step wizard with progress indicator
- Side-by-side order details and refund form
- Bulk refund processing
- Refund templates for common scenarios
- Approval workflow for large refunds
- Integration with accounting software


---

**5. Shipping Manager**

**Card Display:**

- Icon: Truck
- Title: "Shipping Manager"
- Description: "Track and manage shipments"


**Full Tool Interface:**

**Tracking Lookup:**

- **Tracking Number Input:**

- Text field
- "Track Package" button
- Or enter order number to find tracking



- **Carrier Selector:**

- Auto-detect carrier from tracking number
- Or manual selection from dropdown





**Tracking Results:**

**Shipment Overview:**

- Carrier name and logo
- Tracking number (large, copyable)
- Current status badge
- Estimated delivery date
- Actual delivery date (if delivered)


**Shipment Timeline:**

- Visual timeline with events:

- Label Created
- Picked Up
- In Transit (with locations)
- Out for Delivery
- Delivered



- Each event shows:

- Timestamp
- Location
- Status description
- Facility name





**Shipment Details:**

- **Origin:**

- Address
- Facility name
- Ship date



- **Destination:**

- Address
- Recipient name
- Delivery instructions



- **Package Information:**

- Weight
- Dimensions
- Service type (Ground, Express, etc.)
- Signature required?





**Actions:**

- **Update Customer:**

- Send tracking update email
- Send SMS with tracking link
- Template message editor



- **Contact Carrier:**

- Phone number
- Website link
- File claim (if issue)



- **Modify Shipment:**

- Change delivery address (if allowed)
- Hold at location
- Reschedule delivery
- Add delivery instructions



- **Issue Resolution:**

- Report lost package
- Report damaged package
- Request investigation
- File insurance claim





**Bulk Tracking:**

- Upload CSV of tracking numbers
- Track multiple packages at once
- Export tracking status report


**Shipping Analytics:**

- Average delivery time
- On-time delivery rate
- Carrier performance comparison
- Shipping cost analysis
- Problem shipment rate


**Desktop Enhancements:**

- Map view of package location
- Real-time tracking updates
- Multiple package tracking side-by-side
- Shipping label generation
- Rate comparison tool
- Carrier integration for automated updates


---

**6. Analytics Dashboard**

**Card Display:**

- Icon: BarChart3
- Title: "Analytics Dashboard"
- Description: "View support metrics"


**Full Tool Interface:**

**Dashboard Layout:**

- Grid of metric cards and charts
- Customizable layout (drag-and-drop)
- Date range selector at top
- Export dashboard as PDF


**Key Metrics (Cards):**

**1. Support Ticket Metrics:**

- **Total Tickets:**

- Count with trend indicator
- Comparison to previous period
- Sparkline chart



- **Open Tickets:**

- Current count
- Aging breakdown (`< 1 day, 1-3 days, >` 3 days)
- Priority distribution



- **Resolved Tickets:**

- Count with resolution rate
- Trend over time
- Average time to resolution



- **Ticket Volume by Day:**

- Line chart
- Shows daily ticket creation
- Highlights peak days





**2. Response Time Metrics:**

- **Average First Response Time:**

- Time in hours/minutes
- Trend indicator
- Goal comparison



- **Average Resolution Time:**

- Time in hours/days
- By priority level
- By ticket type



- **Response Time Distribution:**

- Histogram chart
- Shows response time ranges
- Identifies outliers





**3. Customer Satisfaction:**

- **Overall Satisfaction Score:**

- Average rating (1-5 stars)
- Trend over time
- Comparison to goal



- **CSAT by Agent:**

- Table of agents with scores
- Sort by score
- Individual trends



- **NPS Score:**

- Net Promoter Score
- Promoters, Passives, Detractors breakdown
- Trend chart





**4. AI Performance:**

- **AI Resolution Rate:**

- Percentage of tickets resolved by AI
- Trend over time
- Comparison to human resolution



- **AI Accuracy:**

- Percentage of correct AI responses
- False positive/negative rates
- Improvement over time



- **AI Escalation Rate:**

- Percentage of tickets escalated to humans
- Reasons for escalation
- Trend analysis



- **AI vs Human Comparison:**

- Side-by-side metrics
- Resolution time
- Customer satisfaction
- Cost per ticket





**5. Revenue Impact:**

- **Support-Driven Revenue:**

- Revenue from support interactions
- Upsells and cross-sells
- Discount codes applied



- **Refund Amount:**

- Total refunds issued
- Refund rate
- Trend over time



- **Customer Lifetime Value:**

- Average LTV
- Impact of support on LTV
- Retention rate





**6. Agent Performance:**

- **Tickets per Agent:**

- Bar chart
- Shows workload distribution
- Identifies top performers



- **Agent Efficiency:**

- Average handling time
- Tickets resolved per hour
- Multitasking capability



- **Agent Satisfaction Scores:**

- Individual CSAT scores
- Trend over time
- Coaching opportunities





**Charts and Visualizations:**

**Ticket Status Breakdown:**

- Pie chart
- Shows Open, In Progress, Resolved, Closed
- Clickable segments for details


**Ticket Volume Trend:**

- Line chart
- Daily/weekly/monthly views
- Multiple metrics on same chart


**Top Issues:**

- Bar chart
- Most common ticket categories
- Trend over time


**Customer Sentiment:**

- Sentiment analysis chart
- Positive, Neutral, Negative breakdown
- Trend over time


**Peak Hours:**

- Heatmap
- Shows busiest hours/days
- Helps with staffing decisions


**Filters and Controls:**

- **Date Range:**

- Today, Yesterday, Last 7 days, Last 30 days, Custom
- Date picker for custom range



- **Agent Filter:**

- All agents, Specific agent, AI only, Human only



- **Ticket Type:**

- All types, Specific categories



- **Priority:**

- All, High, Medium, Low



- **Status:**

- All, Open, Resolved, etc.





**Export Options:**

- Export dashboard as PDF
- Export data as CSV/Excel
- Schedule automated reports (email)
- Share dashboard link (internal)


**Desktop Enhancements:**

- Full-screen dashboard mode
- Real-time data updates
- Drill-down into any metric
- Custom metric creation
- Dashboard templates
- Comparison mode (period over period)
- Forecasting and predictions
- Anomaly detection alerts


---

## 3. Theme System

### Purpose

Provide comfortable viewing experience in different lighting conditions and user preferences.

### Implementation

**Theme Provider:**

- React context for global theme state management
- localStorage persistence of user preference
- System preference detection on first load (prefers-color-scheme)
- Theme toggle propagates to all components instantly
- Smooth transition animations between themes


**Color Tokens:**

- Defined in globals.css using CSS custom properties
- Separate values for light and dark modes
- Semantic naming for maintainability:

- `--background`: Main background color
- `--foreground`: Main text color
- `--primary`: Primary accent color
- `--secondary`: Secondary accent color
- `--muted`: Muted backgrounds
- `--border`: Border colors
- `--input`: Input field backgrounds
- `--ring`: Focus ring colors





**Light Mode Colors:**

- Background: White (`#FFFFFF`)
- Foreground: Black (`#000000`)
- Muted: Light gray (`#F5F5F5`)
- Borders: Medium gray (`#E5E5E5`)
- Clean, bright, high contrast


**Dark Mode Colors:**

- Background: Near black (`#0A0A0A`)
- Foreground: White (`#FAFAFA`)
- Muted: Dark gray (`#1A1A1A`)
- Borders: Dark gray (`#262626`)
- Easy on eyes, reduced blue light


**Theme-Aware Components:**

- **Logo:** Switches between black (light mode) and white (dark mode) versions
- **All UI Components:** Use semantic color tokens, not hard-coded colors
- **Charts:** Color schemes adapt to theme
- **Syntax Highlighting:** Code blocks use theme-appropriate colors
- **Images:** Optional dark mode variants for graphics


**Proper Contrast Ratios:**

- WCAG AA compliance minimum
- Text contrast ratio ≥ 4.5:1
- Large text contrast ratio ≥ 3:1
- Interactive elements clearly distinguishable
- Focus indicators highly visible


**User Controls:**

- **Toggle Button in Header:**

- Sun icon for light mode
- Moon icon for dark mode
- Smooth icon transition
- Instant theme switching
- Tooltip on hover





**Preference Persistence:**

- Saved to localStorage as `theme` key
- Persists across sessions
- Syncs across tabs (storage event listener)
- Respects system preference on first visit
- Can be reset to system default


**System Integration:**

- Detects OS dark mode setting
- Updates automatically when OS setting changes (future)
- Respects user's explicit choice over system preference


---

## 4. AI Integration (AI SDK v5)

### Architecture

**API Route (`/api/chat/route.ts`):**

**Purpose:** Server-side endpoint for AI chat interactions

**Implementation:**

```typescript
import { streamText, convertToModelMessages, toUIMessageStreamResponse } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const result = streamText({
    model: 'anthropic/claude-sonnet-4.5',
    system: 'You are a helpful customer support agent...',
    messages: convertToModelMessages(messages),
  })
  
  return toUIMessageStreamResponse(result)
}
```

**Features:**

- Handles POST requests from chat interface
- Uses AI SDK v5's `streamText` function
- Integrates with Anthropic Claude via model string
- Streams responses back to client in real-time
- Error handling with try-catch
- Request validation
- Rate limiting (future)


**Model Configuration:**

- **Model:** `anthropic/claude-sonnet-4.5`

- Latest Claude model
- Balanced performance and cost
- Excellent reasoning capabilities
- Multimodal support (text + images)



- **System Prompt:**

- Defines AI behavior as customer support agent
- Sets tone (professional, helpful, empathetic)
- Provides context about company/products
- Includes guidelines for handling common issues
- Specifies when to escalate to human



- **Parameters:**

- Temperature: 0.7 (balanced creativity/consistency)
- Max tokens: 2048 (long responses allowed)
- Top P: 0.9 (nucleus sampling)
- Frequency penalty: 0.3 (reduce repetition)





**Message Conversion:**

- `convertToModelMessages()` transforms UI messages to Anthropic format
- Handles different message types (text, images, files)
- Maintains conversation context
- Preserves message metadata


**Streaming Response:**

- `toUIMessageStreamResponse()` converts AI stream to UI format
- Real-time token streaming
- Partial message updates
- Completion detection
- Error handling in stream


---

**Client Integration:**

**useChat Hook:**

```typescript
const {
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
} = useChat({
  api: '/api/chat',
})
```

**Features:**

- **Automatic State Management:**

- Messages array (user + AI)
- Input field value
- Loading state
- Error state



- **Built-in Functions:**

- `handleInputChange`: Updates input as user types
- `handleSubmit`: Sends message to API
- `append`: Add message programmatically
- `reload`: Regenerate last AI response
- `stop`: Cancel ongoing generation



- **Real-time Streaming:**

- AI responses appear token-by-token
- Smooth typing animation effect
- No waiting for complete response
- Better perceived performance



- **Error Handling:**

- Network errors caught automatically
- Retry logic built-in
- User-friendly error messages
- Graceful degradation





---

**Message Flow:**

1. **User Input:**

1. User types message in input field
2. `handleInputChange` updates input state
3. User clicks send or presses Enter
4. `handleSubmit` triggered



2. **Client Processing:**

1. Input validated (not empty)
2. Message added to messages array (optimistic update)
3. Loading state set to true
4. POST request sent to `/api/chat`



3. **Server Processing:**

1. API route receives messages array
2. Messages converted to Anthropic format
3. `streamText` called with model and messages
4. AI begins generating response



4. **Streaming Response:**

1. Server streams tokens back to client
2. Client receives tokens in real-time
3. UI updates with partial message
4. Smooth typing animation



5. **Completion:**

1. AI finishes generating response
2. Complete message added to messages array
3. Loading state set to false
4. Input field cleared
5. Auto-scroll to bottom



6. **Error Handling:**

1. If error occurs at any step
2. Error state updated
3. User shown error message
4. Option to retry





---

**Multimodal Support:**

**Image Uploads:**

- User selects image via file input or camera
- Image converted to base64
- Included in message with `image` type
- AI analyzes image and responds
- Supports: JPG, PNG, WebP, GIF


**File Attachments:**

- User selects file via file input
- File converted to base64 or uploaded to storage
- File metadata included in message
- AI can reference file content
- Supports: PDF, TXT, CSV, JSON, etc.


**Voice Input (Future):**

- User records voice memo
- Audio transcribed to text (Whisper API)
- Text sent to AI as normal message
- AI responds with text
- Text-to-speech for AI response (optional)


---

**Environment Variables:**

**Required:**

- `ANTHROPIC_API_KEY`: API key for Anthropic Claude

- Obtained from Anthropic console
- Stored in `.env.local` file
- Never exposed to client-side code
- Accessed via `process.env.ANTHROPIC_API_KEY`





**Optional:**

- `AI_MODEL`: Override default model
- `AI_TEMPERATURE`: Override default temperature
- `AI_MAX_TOKENS`: Override default max tokens
- `RATE_LIMIT_MAX`: Max requests per minute


**Security:**

- API keys stored securely in environment
- Never committed to version control
- Server-side only (not in client bundle)
- Rotated regularly
- Monitored for unusual usage


---

**AI Capabilities:**

**Customer Support Tasks:**

- Answer product questions
- Troubleshoot issues
- Process returns/refunds
- Track orders
- Provide recommendations
- Handle complaints
- Upsell/cross-sell
- Collect feedback


**Context Awareness:**

- Remembers conversation history
- References previous messages
- Maintains customer context
- Accesses order information
- Knows customer preferences


**Escalation Logic:**

- Recognizes when human help needed
- Escalates complex issues
- Transfers to appropriate department
- Provides context to human agent
- Learns from escalations


**Continuous Improvement:**

- Learns from human corrections
- Improves over time
- A/B testing of responses
- Feedback loop from satisfaction scores
- Regular model updates


---

## 5. Desktop Optimization

### Design Principles

**Screen Real Estate:**

- Utilize horizontal space effectively
- Multi-column layouts where appropriate
- Persistent sidebar (not overlay)
- Wider content areas for better readability
- More information visible without scrolling


**Interaction Patterns:**

- **Mouse Hover States:**

- Buttons change color on hover
- Tooltips appear on hover
- Quick actions visible on hover
- Preview on hover (future)



- **Click Interactions:**

- Single click to select/open
- Double click for quick actions (future)
- Right-click context menus (future)
- Drag-and-drop support (future)



- **Keyboard Shortcuts:**

- Ctrl/Cmd + K: Quick search
- Ctrl/Cmd + /: Show shortcuts
- Ctrl/Cmd + 1-9: Switch tabs
- Esc: Close modals/panels
- Tab: Navigate form fields
- Enter: Submit forms
- Arrow keys: Navigate lists





**Typography:**

- Larger base font size (16px vs 14px mobile)
- More line height for comfortable reading
- Wider line length (up to 80 characters)
- Better hierarchy with size variations
- More whitespace between elements


**Touch Targets:**

- Standard button sizes (40x40px minimum)
- Not as large as mobile (44x44px)
- Adequate spacing between clickable elements
- Hover states provide visual feedback
- Focus indicators for keyboard navigation


**Performance:**

- Lazy loading of sidebar content
- Virtual scrolling for long lists
- Optimized image loading
- Code splitting for faster initial load
- Prefetching for anticipated navigation


**Responsive Behavior:**

- Optimized for screens 1024px and wider
- Adapts to various desktop sizes
- Sidebar can be resized (future)
- Full-screen mode available (future)
- Multi-monitor support (future)


---

### Layout Structure

**Split-Screen Design:**

- **Left Panel (Chat):**

- Width: Flexible (expands when sidebar collapsed)
- Max width: 1200px for readability
- Centered content
- Full height



- **Right Panel (Sidebar):**

- Width: 400px default
- Collapsible to 0px
- Full height
- Fixed position
- Scrollable content





**Sidebar Behavior:**

- **Expanded State:**

- 400px wide
- Content fully visible
- Smooth slide-in animation
- Overlay shadow on chat area



- **Collapsed State:**

- 0px wide (hidden)
- Chat area expands to full width
- Smooth slide-out animation
- Toggle button remains visible



- **Toggle Button:**

- Located in chat header
- Menu icon when sidebar closed
- X icon when sidebar open
- Smooth icon transition
- Keyboard shortcut (Ctrl+B)





**Content Organization:**

- **Fixed Headers:**

- Chat header always visible
- Sidebar tab bar always visible
- Sticky positioning



- **Scrollable Content:**

- Chat messages scroll independently
- Sidebar content scrolls independently
- Custom scrollbar styling
- Smooth scroll behavior



- **Modals and Overlays:**

- Centered on screen
- Backdrop blur effect
- Smooth fade-in animation
- Click outside to close
- Esc key to close





---

### Desktop-Specific Features

**Multi-Column Layouts:**

- Order details: 2-column (receipt + payment)
- Customer profile: 2-column (overview + stats)
- Analytics: Grid layout (2-3 columns)
- Tool interfaces: Form + preview side-by-side


**Enhanced Tables:**

- Sortable columns (click header)
- Resizable columns (drag border)
- Fixed header row (sticky)
- Row hover highlighting
- Inline editing (future)
- Bulk selection with checkboxes
- Context menu on right-click


**Advanced Search:**

- Search suggestions dropdown
- Recent searches
- Saved searches
- Boolean operators (AND, OR, NOT)
- Field-specific search (name:John)
- Fuzzy matching
- Search history


**Drag-and-Drop:**

- File uploads (drag files to input area)
- Reorder lists (drag to reorder)
- Dashboard customization (drag widgets)
- Ticket assignment (drag to agent)


**Tooltips and Help:**

- Hover tooltips on all icons
- Contextual help text
- Inline documentation
- Help icon with modal
- Keyboard shortcut hints


**Notifications:**

- Toast notifications (bottom-right)
- Desktop notifications (browser API)
- Sound alerts (optional)
- Badge counts on tabs
- Real-time updates


---

## 6. Data Flow & State Management

### Message State

**Managed by AI SDK's useChat Hook:**

- **Messages Array:**

- Contains all conversation messages
- User messages and AI responses
- Persists during session
- Can be extended to persist in database



- **Message Structure:**

```typescript
{
  id: string,
  role: 'user' | 'assistant',
  content: string,
  createdAt: Date,
  attachments?: Array<{
    type: 'image' | 'file',
    url: string,
    name: string,
  }>,
}
```


- **State Updates:**

- Optimistic updates (user message appears immediately)
- Streaming updates (AI response appears token-by-token)
- Error rollback (remove message if send fails)





### Sidebar State

**Local Component State:**

- **Sidebar Open/Closed:**

- Boolean state
- Persisted to localStorage
- Smooth animation on toggle



- **Active Tab:**

- String state ('tickets' | 'history' | 'tools')
- Persisted to localStorage
- Determines which content to render



- **Expanded Ticket ID:**

- String or null
- Tracks which ticket is expanded
- Only one ticket expanded at a time
- Resets when switching tabs



- **Active Ticket View:**

- String state ('order' | 'conversation' | 'profile' | 'resolve')
- Determines which tab content to show
- Rotating tab navigation



- **Active Tool:**

- String or null
- Tracks which tool detail view is open
- Null when showing tool grid



- **Expanded Order ID:**

- String or null (in Customer Profile)
- Tracks which order is expanded
- Shows full order details inline



- **Conversation Sub-Tab:**

- String state ('full' | 'admin')
- Determines which conversation view to show





### Theme State

**React Context for Global Access:**

- **Theme Value:**

- 'light' | 'dark' | 'system'
- Accessible from any component
- Updates all components instantly



- **localStorage Persistence:**

- Saved as 'theme' key
- Loaded on app initialization
- Syncs across browser tabs



- **System Preference Detection:**

- Uses `window.matchMedia('(prefers-color-scheme: dark)')`
- Respects OS setting on first visit
- User choice overrides system preference





### Form State

**Controlled Inputs with useState:**

- **Input Values:**

- Each form field has state variable
- Controlled components (value prop)
- onChange handlers update state



- **Validation:**

- Real-time validation as user types
- Error messages displayed inline
- Submit button disabled if invalid
- Form-level validation on submit



- **Loading States:**

- Boolean state during async operations
- Disables form inputs while loading
- Shows loading spinner
- Prevents duplicate submissions



- **Success/Error States:**

- Boolean states for feedback
- Success message displayed
- Error message displayed
- Auto-dismiss after timeout





### Data Persistence

**Current Implementation:**

- Session-based (in-memory)
- Lost on page refresh
- No database integration yet


**Future Implementation:**

- **Database Storage:**

- Messages persisted to database
- Conversation history saved
- Customer profiles stored
- Ticket data stored
- Admin notes saved



- **Real-time Sync:**

- WebSocket connection
- Live updates across devices
- Collaborative editing
- Presence indicators



- **Caching:**

- Redis for frequently accessed data
- Browser cache for static assets
- Service worker for offline support





---

## 7. Responsive Breakpoints

### Desktop-Only Display

**Breakpoint:** `lg` (1024px and above)

**Implementation:**

```typescriptreact
<div className="hidden lg:block">
  <DesktopChatInterface />
</div>
<div className="lg:hidden">
  <MobileChatInterface />
</div>
```

**Behavior:**

- Desktop version shows on screens ≥ 1024px
- Mobile version shows on screens < 1024px
- No overlap or duplication
- Smooth transition when resizing


### Desktop Size Variations

**Large Desktop (1440px+):**

- Sidebar can be wider (500px)
- More columns in grids (3-4 columns)
- Larger font sizes
- More whitespace


**Standard Desktop (1024-1439px):**

- Standard sidebar width (400px)
- 2-3 column grids
- Standard font sizes
- Balanced spacing


**Small Desktop/Laptop (1024-1279px):**

- Narrower sidebar (350px)
- 2 column grids
- Slightly smaller fonts
- Tighter spacing


---

## 8. Future Enhancements

### Planned Features

**1. Advanced AI Capabilities:**

- Sentiment analysis in real-time
- Automatic ticket categorization
- Predictive issue resolution
- Proactive customer outreach
- Multi-language support with translation
- Voice-to-voice conversations
- AI-powered knowledge base search


**2. Collaboration Features:**

- Multi-agent support (multiple admins)
- Internal chat between admins
- Ticket assignment and routing
- Workload balancing
- Team performance dashboards
- Shared notes and annotations
- @mentions and notifications


**3. Integration Ecosystem:**

- CRM integration (Salesforce, HubSpot)
- E-commerce platforms (Shopify, WooCommerce)
- Payment processors (Stripe, PayPal)
- Shipping carriers (FedEx, UPS, USPS)
- Email marketing (Mailchimp, SendGrid)
- Analytics (Google Analytics, Mixpanel)
- Helpdesk software (Zendesk, Intercom)


**4. Advanced Analytics:**

- Predictive analytics (forecast ticket volume)
- Customer churn prediction
- Revenue attribution
- A/B testing framework
- Custom report builder
- Automated insights and recommendations
- Anomaly detection


**5. Automation & Workflows:**

- Automated ticket routing
- Trigger-based actions
- Custom workflow builder
- SLA management
- Escalation rules
- Auto-responses for common issues
- Scheduled tasks


**6. Customer Self-Service:**

- Knowledge base integration
- FAQ chatbot
- Video tutorials
- Community forum
- Customer portal
- Self-service returns/refunds
- Order tracking without login


**7. Mobile Apps:**

- Native iOS app
- Native Android app
- Push notifications
- Offline support
- Biometric authentication
- Camera integration
- Location services


**8. Security & Compliance:**

- Two-factor authentication
- Role-based access control (RBAC)
- Audit logs
- Data encryption at rest and in transit
- GDPR compliance tools
- HIPAA compliance (if needed)
- SOC 2 certification


**9. Performance Optimizations:**

- Server-side rendering (SSR)
- Edge caching
- CDN integration
- Image optimization
- Code splitting
- Lazy loading
- Service workers for offline


**10. Customization:**

- White-label branding
- Custom themes beyond light/dark
- Configurable workflows
- Custom fields
- API for third-party integrations
- Webhook support
- Plugin system


---

### Scalability Considerations

**Infrastructure:**

- **Load Balancing:**

- Distribute traffic across multiple servers
- Auto-scaling based on demand
- Health checks and failover



- **Database:**

- PostgreSQL for relational data
- Redis for caching and real-time features
- Elasticsearch for full-text search
- Database replication and sharding



- **Message Queue:**

- RabbitMQ or AWS SQS
- Async processing of heavy tasks
- Retry logic for failed jobs



- **CDN:**

- CloudFlare or AWS CloudFront
- Static asset delivery
- Edge caching for API responses





**Monitoring:**

- Application performance monitoring (APM)
- Error tracking (Sentry)
- Log aggregation (Datadog, Splunk)
- Uptime monitoring
- Real-time alerts
- Performance metrics dashboard


**Cost Optimization:**

- AI model caching (reduce API calls)
- Efficient database queries
- Image compression and optimization
- Code minification and bundling
- Resource usage monitoring
- Auto-scaling policies


---

## 9. Security & Compliance

### Data Protection

**API Security:**

- API keys stored securely in environment variables
- Never exposed to client-side code
- HTTPS required for all communications
- Rate limiting to prevent abuse
- Input sanitization and validation
- SQL injection prevention
- XSS protection


**Authentication & Authorization:**

- Secure session management
- JWT tokens for API authentication
- Refresh token rotation
- Password hashing (bcrypt)
- Account lockout after failed attempts
- Two-factor authentication (future)


**Data Encryption:**

- TLS 1.3 for data in transit
- AES-256 for data at rest
- Encrypted database backups
- Secure key management


**Access Control:**

- Admin-only sections protected
- Role-based permissions (future)
- Principle of least privilege
- Audit logs for all actions
- IP whitelisting (optional)


### Privacy

**Customer Data:**

- Minimal data collection
- Clear privacy policy
- Consent management
- Data retention policies
- Right to access data
- Right to delete data
- Data portability


**AI Transparency:**

- Disclosure of AI usage to customers
- Explanation of AI decisions
- Human oversight of AI actions
- Opt-out option for AI handling


### Compliance

**GDPR (General Data Protection Regulation):**

- Lawful basis for processing
- Data minimization
- Purpose limitation
- Storage limitation
- Data subject rights (access, rectification, erasure)
- Data breach notification
- Privacy by design


**CCPA (California Consumer Privacy Act):**

- Right to know what data is collected
- Right to delete personal information
- Right to opt-out of data sale
- Non-discrimination for exercising rights


**PCI DSS (Payment Card Industry):**

- Secure payment processing
- No storage of full card numbers
- Tokenization of payment data
- Regular security audits


**SOC 2:**

- Security controls
- Availability guarantees
- Processing integrity
- Confidentiality measures
- Privacy protections


### Audit & Logging

**Activity Logs:**

- All admin actions logged
- Timestamp and user identification
- Before/after values for changes
- IP address and user agent
- Searchable and filterable
- Retention for compliance period


**Security Logs:**

- Failed login attempts
- Permission changes
- Data access logs
- API usage logs
- Anomaly detection
- Real-time alerts for suspicious activity


---

## 10. Accessibility (A11y)

### WCAG 2.1 AA Compliance

**Perceivable:**

- **Text Alternatives:**

- Alt text for all images
- ARIA labels for icons
- Descriptive link text



- **Color Contrast:**

- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Not relying on color alone for information



- **Responsive Design:**

- Text can be resized up to 200%
- No horizontal scrolling at 320px width
- Content reflows properly





**Operable:**

- **Keyboard Navigation:**

- All functionality accessible via keyboard
- Visible focus indicators
- Logical tab order
- Skip to main content link



- **Timing:**

- No time limits on interactions
- Or ability to extend/disable time limits
- Pause/stop for moving content



- **Seizures:**

- No flashing content
- Or flashing less than 3 times per second





**Understandable:**

- **Readable:**

- Clear, simple language
- Consistent terminology
- Abbreviations explained



- **Predictable:**

- Consistent navigation
- Consistent identification
- No unexpected context changes



- **Input Assistance:**

- Clear error messages
- Suggestions for correction
- Error prevention for important actions





**Robust:**

- **Compatible:**

- Valid HTML
- ARIA attributes used correctly
- Works with assistive technologies
- Tested with screen readers





### Assistive Technology Support

**Screen Readers:**

- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)


**Keyboard-Only Users:**

- Full keyboard navigation
- Visible focus indicators
- Keyboard shortcuts documented


**Voice Control:**

- Voice commands for common actions
- Clear button labels for voice targeting


---

## Summary

The Desktop Health Pro Agent provides a comprehensive, professional-grade customer support interface optimized for large screens and desktop workflows. With a persistent sidebar, multi-column layouts, and enhanced productivity features, it enables support teams to efficiently manage tickets, access customer information, and utilize powerful administrative tools. The split-screen design maximizes screen real estate while maintaining a clean, focused user experience. Combined with AI-powered automation, real-time analytics, and extensive customization options, this desktop interface delivers enterprise-level support capabilities in a modern, accessible package.

**Key Differentiators from Mobile:**

- Persistent, collapsible sidebar (vs. full-screen overlay)
- Multi-column layouts for better information density
- Hover states and enhanced mouse interactions
- Keyboard shortcuts for power users
- Wider content areas for comfortable reading
- More information visible without scrolling
- Advanced features like drag-and-drop and context menus
- Optimized for extended work sessions


**Shared Features with Mobile:**

- All core functionality (tickets, tools, chat)
- Same AI integration and capabilities
- Identical theme system
- Consistent design language
- Feature parity across platforms