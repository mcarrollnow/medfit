Thought for 5s### Mobile Health Pro Agent - Complete System Documentation

## System Overview

A mobile-first AI-powered customer support chat interface built with Next.js 16, React 19, AI SDK v5, and Anthropic's Claude. The system features a main chat interface for customer interactions and a comprehensive sidebar for support ticket management, customer profiles, and administrative tools.

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
- **Typography**: Clean, readable fonts optimized for mobile
- **Layout**: Mobile-first, edge-to-edge design using dynamic viewport height (dvh)


---

## 1. Main Chat Interface

### Purpose

Primary customer-facing interface where users interact with the AI support agent through text, voice, images, and files.

### Features

#### 1.1 Header Section

**Components:**

- Eagle logo (theme-aware: black for light mode, white for dark mode)
- App title: "Modern Health Pro Agent"
- Theme toggle button (sun/moon icon)
- Menu button to open sidebar


**Functionality:**

- Logo displays appropriate version based on current theme
- Theme toggle switches between light/dark mode with localStorage persistence
- Menu button triggers full-screen sidebar overlay


#### 1.2 Message Display Area

**Components:**

- Scrollable message container
- User messages (right-aligned)
- AI messages (left-aligned)
- Empty state with welcome message and eagle logo


**Functionality:**

- Auto-scrolls to bottom when new messages arrive
- Displays chronological conversation history
- Shows loading indicator during AI response generation
- Messages styled with appropriate background colors based on sender


#### 1.3 Hot Buttons (Quick Actions)

**Components:**

- Three action buttons: Summarize, Quick Answer, Explain
- Icon-based design with labels


**Functionality:**

- Pre-defined prompts that users can tap for common actions
- Sends formatted message to AI with specific instruction
- Provides quick access to frequently used commands
- Reduces typing for common support requests


#### 1.4 Input Area

**Components:**

- Text input field with placeholder
- File attachment button (paperclip icon)
- Camera capture button
- Voice memo button (microphone icon)
- Send button


**Functionality:**

- **Text Input**: Multi-line textarea that expands as user types
- **File Attachment**: Opens file picker for document uploads (PDF, images, etc.)
- **Camera Capture**: Activates device camera for photo capture
- **Voice Memo**: Records audio messages (future implementation for transcription)
- **Send Button**: Submits message to AI via API route


**Technical Implementation:**

- Uses AI SDK v5's `useChat` hook for message management
- Handles file uploads with base64 encoding
- Manages loading states automatically
- Streams AI responses in real-time


---

## 2. Sidebar System

### Purpose

Comprehensive administrative interface for managing support tickets, viewing customer data, and accessing support tools.

### Architecture

Full-screen overlay that slides in from the right side, featuring horizontal tab navigation at the top.

### 2.1 Support Tickets Tab

#### Overview

Displays all active support tickets with filtering, search, and expandable detail views.

#### Features

**Ticket List View:**

- Displays ticket cards with:

- Ticket ID
- Customer name
- Issue subject
- Priority badge (High/Medium/Low with color coding)
- Timestamp
- Status indicator
- Chevron icon for expansion





**Filter System:**

- Filter by status: All, Open, In Progress, Resolved
- Updates ticket list in real-time based on selection


**Search Functionality:**

- Search bar for finding specific tickets
- Filters tickets by ID, customer name, or subject


**Expandable Ticket Cards:**
When a ticket is clicked, it expands to show:

1. Collapsed preview (always visible)
2. Four rotating tab views below


#### 2.1.1 Order Details (Default View)

**Purpose:** Display complete order information for the support ticket

**Components:**

- **Itemized Receipt Section**

- Product names with quantities
- Individual item prices
- Subtotal, tax, shipping costs
- Total amount



- **Payment Information**

- Crypto wallet address (where payment was sent)
- Payment method label
- Transaction timestamp



- **Order Timeline**

- Visual timeline with status indicators
- Five stages with timestamps:

1. Order Placed
2. Order Approved
3. Payment Made
4. Order Shipped
5. Order Delivered



- Color-coded status (completed stages in accent color)



- **Tracking Information**

- Carrier name
- Tracking number (copyable)
- Current status
- Estimated delivery date





**Functionality:**

- Default view when ticket expands
- Provides complete order context for support agents
- Allows quick reference to order details during customer conversations


#### 2.1.2 Conversation Tab

**Purpose:** View and manage all communication related to the ticket

**Sub-Tabs:**

**A. Full Conversation**

- Complete chronological thread of all messages
- Message types:

- Customer messages
- AI agent responses
- Admin messages



- Date separators for multi-day conversations
- Sender labels (Customer, AI Agent, Admin)
- Timestamp for each message
- Auto-scroll to latest message


**B. Admin Only**

- Private thread between AI and human admins
- AI leaves updates and internal notes
- Admins can communicate about ticket strategy
- Not visible to customers
- Message types:

- AI system updates ("Ticket assigned", "Customer responded")
- Admin internal notes
- Strategy discussions



- Timestamp and sender identification


**Functionality:**

- Horizontal sub-tabs switch between Full and Admin views
- Provides context for support decisions
- Enables AI-human collaboration on complex issues
- Maintains audit trail of all communications


#### 2.1.3 Customer Profile Tab

**Purpose:** Comprehensive customer information and history

**Components:**

**Customer Overview Card:**

- Customer name
- Email address
- Phone number
- Customer since date
- Total amount spent
- Total orders count
- Average order value


**Order History Section:**

- List of all previous orders
- Each order card shows:

- Order number
- Date
- Total amount
- Status badge
- Item count





**Expandable Order Details:**

- Click any order to expand full details
- Shows same information as Order Details tab:

- Itemized receipt
- Payment information
- Order timeline
- Tracking info



- Collapse button to return to list view


**Admin Notes Section:**

- Historical notes from previous interactions
- Timestamp and author for each note
- Searchable and filterable
- Add new note functionality


**Customer Stats:**

- Lifetime value
- Average response time
- Satisfaction rating
- Number of support tickets
- Return rate


**Functionality:**

- Provides complete customer context
- Helps identify VIP customers or repeat issues
- Order history cards are clickable for detailed view
- Admin notes persist across all tickets for this customer
- Stats help prioritize support efforts


#### 2.1.4 Resolve Tab

**Purpose:** Tools and actions to resolve the support ticket

**Components:**

**Discount Code Section:**

- **Generator Mode:**

- Percentage or fixed amount selector
- Discount value input
- Expiration date picker
- Usage limit setting
- Generate button creates unique code
- Copy to clipboard functionality



- **Custom Code Mode:**

- Manual code entry
- Same configuration options as generator
- Useful for applying existing promotional codes





**Admin Notes to Customer Profile:**

- Text area for adding notes
- Notes are saved to customer's permanent profile
- Visible in future tickets for this customer
- Timestamp and author automatically recorded


**Action Buttons:**

**Request More Info:**

- Sends templated message to customer
- Marks ticket as "Waiting on Customer"
- Sets follow-up reminder
- Tracks response time


**Assign to AI:**

- Transfers ticket to AI agent for handling
- AI takes over conversation
- Admin can monitor in Admin Only thread
- AI provides updates on resolution progress


**Mark as Resolved:**

- Closes ticket
- Sends satisfaction survey to customer
- Archives conversation
- Updates ticket statistics


**Functionality:**

- Streamlines common resolution actions
- Discount codes integrate with e-commerce system
- Admin notes provide continuity across support interactions
- AI assignment enables scaling support operations
- All actions are logged for audit trail


#### Rotating Tab Navigation

**How It Works:**

- Four views: Order Details, Conversation, Customer Profile, Resolve
- Three tabs always visible showing the OTHER views
- Active view is not shown in tabs
- Clicking a tab navigates to that view and rotates the tab bar
- Example: On Order Details, tabs show: Conversation | Customer Profile | Resolve
- Click "Conversation" → Now on Conversation, tabs show: Order Details | Customer Profile | Resolve


**Purpose:**

- Maximizes screen space on mobile
- Always shows available navigation options
- Intuitive carousel-style navigation
- Reduces cognitive load by hiding current view from tabs


---

### 2.2 Conversation History Tab

#### Purpose

Archive of all past chat conversations across all customers

#### Features

**Search Functionality:**

- Search bar at top
- Filters by customer name, message content, or date
- Real-time filtering as user types


**Conversation List:**

- Each conversation card displays:

- Customer name or identifier
- Last message preview
- Timestamp of last message
- Message count badge
- Unread indicator (if applicable)





**Conversation Details:**

- Click to view full conversation thread
- Read-only view of historical messages
- Option to create new ticket from conversation
- Export conversation functionality


**Filtering Options:**

- Date range selector
- Customer filter
- Resolved vs. unresolved
- AI-handled vs. admin-handled


**Functionality:**

- Provides searchable archive of all interactions
- Helps identify recurring issues
- Training data for AI improvements
- Compliance and record-keeping


---

### 2.3 Support Tools Tab

#### Purpose

Collection of administrative utilities for customer support operations

#### Tool Grid Layout

- 2-column grid on mobile
- Icon-based cards for each tool
- Tool name and brief description
- Click to open full-screen tool interface


#### Available Tools

**1. Discount Code Generator**

- Create promotional codes
- Set percentage or fixed amount
- Configure expiration and usage limits
- Generate unique codes
- Copy to clipboard
- View active codes list


**2. Order History Search**

- Search all orders across customers
- Filter by date, status, amount
- View order details
- Quick actions (refund, reorder, track)


**3. Customer Lookup**

- Search customers by name, email, phone
- View complete customer profile
- Access order history
- See support ticket history
- Edit customer information


**4. Refund Processor**

- Enter order number
- Specify refund amount
- Select refund reason from dropdown
- Add notes for accounting
- Process refund to original payment method
- Send confirmation email


**5. Shipping Tracker**

- Enter tracking number
- View real-time shipping status
- See delivery timeline
- Contact carrier
- Update customer with status


**6. Analytics Dashboard**

- Support ticket metrics
- Response time statistics
- Customer satisfaction scores
- AI vs. human resolution rates
- Revenue impact of support
- Trend charts and graphs


**Functionality:**

- Each tool opens in full-screen view
- Back button returns to tool grid
- Tools integrate with backend systems
- Actions are logged for audit trail
- Mobile-optimized interfaces


---

## 3. Theme System

### Purpose

Provide comfortable viewing experience in different lighting conditions

### Implementation

**Theme Provider:**

- React context for theme state management
- localStorage persistence of user preference
- System preference detection on first load
- Theme toggle propagates to all components


**Color Tokens:**

- Defined in globals.css using CSS variables
- Separate values for light and dark modes
- Semantic naming (background, foreground, primary, etc.)
- Automatic switching based on theme state


**Theme-Aware Components:**

- Logo switches between black and white versions
- All UI components use semantic color tokens
- Proper contrast ratios maintained in both modes
- Smooth transitions between theme changes


**User Controls:**

- Toggle button in header (sun/moon icon)
- Instant theme switching
- Preference saved for future sessions
- Respects system dark mode setting


---

## 4. AI Integration (AI SDK v5)

### Architecture

**API Route (`/api/chat/route.ts`):**

- Handles POST requests from chat interface
- Uses AI SDK v5's `streamText` function
- Integrates with Anthropic Claude via model string
- Streams responses back to client


**Client Integration:**

- `useChat` hook manages message state
- Automatic handling of loading states
- Real-time streaming of AI responses
- Error handling and retry logic


**Message Flow:**

1. User types message and clicks send
2. `useChat` hook sends POST to `/api/chat`
3. API route receives messages array
4. Converts to Anthropic format with `convertToModelMessages`
5. Calls `streamText` with Claude model
6. Streams response back to client
7. `useChat` hook updates UI in real-time
8. Message added to conversation history


**Model Configuration:**

- Model: `anthropic/claude-sonnet-4.5`
- System prompt defines AI behavior as support agent
- Temperature and other parameters configurable
- Supports multimodal inputs (text, images, files)


**Environment Variables:**

- `ANTHROPIC_API_KEY`: Required for API access
- Stored securely in environment
- Not exposed to client-side code


---

## 5. Mobile Optimization

### Design Principles

**Touch Targets:**

- Minimum 44x44px for all interactive elements
- Increased button sizes for header controls
- Adequate spacing between clickable items
- Large, easy-to-tap action buttons


**Viewport Handling:**

- Uses `dvh` (dynamic viewport height) for full-screen layout
- Accounts for mobile browser chrome
- Edge-to-edge design with no margins
- Proper handling of keyboard appearance


**Performance:**

- Lazy loading of sidebar content
- Optimized image loading
- Minimal JavaScript bundle size
- Fast initial page load


**Responsive Behavior:**

- Mobile-first design approach
- Optimized for portrait orientation
- Handles various screen sizes
- Smooth animations and transitions


---

## 6. Data Flow & State Management

### Message State

- Managed by AI SDK's `useChat` hook
- Persists in component state during session
- Can be extended to persist in database


### Sidebar State

- Local component state for open/closed
- Active tab tracked in state
- Expanded ticket ID tracked
- Tool detail views managed with state


### Theme State

- React context for global access
- localStorage for persistence
- Syncs across all components


### Form State

- Controlled inputs with useState
- Validation before submission
- Loading states during async operations


---

## 7. Future Enhancements

### Planned Features

- Voice memo transcription with AI
- Real-time notifications for new tickets
- Multi-language support
- Advanced analytics and reporting
- Integration with CRM systems
- Automated ticket routing
- AI training interface
- Customer self-service portal


### Scalability Considerations

- Database integration for message persistence
- Redis for real-time features
- Webhook support for external integrations
- API rate limiting and caching
- Load balancing for high traffic


---

## 8. Security & Compliance

### Data Protection

- API keys stored securely in environment variables
- No sensitive data in client-side code
- HTTPS required for all communications
- Input sanitization and validation


### Access Control

- Admin-only sections protected
- Customer data privacy maintained
- Audit logs for all actions
- Role-based permissions (future)


### Compliance

- GDPR-compliant data handling
- Customer data export capability
- Right to deletion support
- Transparent AI usage disclosure


---

## Summary

This mobile chat interface provides a comprehensive customer support solution combining AI automation with human oversight. The system enables efficient ticket management, detailed customer insights, and powerful administrative tools, all optimized for mobile devices with a clean, professional black and white design aesthetic.