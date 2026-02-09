-- Knowledge Base System for Training Claude AI and Public Documentation
-- Created: 2025-10-22

-- Categories for organizing articles
CREATE TABLE IF NOT EXISTS kb_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT, -- Icon name (lucide icons) or emoji
  parent_id UUID REFERENCES kb_categories(id) ON DELETE CASCADE, -- For subcategories
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Base Articles
CREATE TABLE IF NOT EXISTS kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- URL-friendly identifier
  content TEXT NOT NULL, -- Markdown content
  excerpt TEXT, -- Brief summary for listings
  category_id UUID REFERENCES kb_categories(id) ON DELETE SET NULL,
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Publishing workflow
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, archived
  visibility TEXT NOT NULL DEFAULT 'public', -- public, admin_only, rep_only, customer_only

  -- SEO and search
  search_keywords TEXT[], -- Additional keywords for search
  meta_description TEXT, -- For SEO

  -- Analytics
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  not_helpful_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,

  -- Constraints
  CONSTRAINT kb_articles_status_check CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT kb_articles_visibility_check CHECK (visibility IN ('public', 'admin_only', 'rep_only', 'customer_only'))
);

-- Q&A Training Pairs for AI
CREATE TABLE IF NOT EXISTS ai_qa_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,

  -- Organization
  category TEXT, -- e.g., 'orders', 'shipping', 'returns', 'crypto', 'products'
  tags TEXT[], -- For filtering and search

  -- Priority and control
  priority INTEGER DEFAULT 0, -- Higher priority = AI should prefer this answer
  enabled BOOLEAN DEFAULT true,

  -- Context matching
  trigger_keywords TEXT[], -- Keywords that should trigger this Q&A
  applies_to_roles TEXT[], -- ['customer', 'admin', 'rep'] - who this applies to

  -- Tracking
  times_used INTEGER DEFAULT 0, -- How many times AI has used this
  last_used_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Process Documentation (Step-by-step guides for AI and humans)
CREATE TABLE IF NOT EXISTS process_docs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  process_type TEXT NOT NULL, -- 'order', 'crypto_payment', 'ach_payment', 'return', 'shipping', etc.

  -- Process steps (JSON array)
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  -- Example: [
  --   {
  --     "step_number": 1,
  --     "title": "Verify Order Details",
  --     "description": "Check order status and payment method",
  --     "action": "Use get_order_details() tool",
  --     "ai_instructions": "Always verify before proceeding"
  --   }
  -- ]

  -- When to trigger
  trigger_conditions TEXT[], -- When should AI use this process
  required_role TEXT, -- 'admin', 'rep', 'customer', or null for any

  -- Control
  enabled BOOLEAN DEFAULT true,

  -- Metadata
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Article view tracking
CREATE TABLE IF NOT EXISTS kb_article_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES kb_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- null for anonymous
  ip_address TEXT,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Article feedback (helpful/not helpful)
CREATE TABLE IF NOT EXISTS kb_article_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES kb_articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_helpful BOOLEAN NOT NULL,
  feedback_text TEXT, -- Optional user comment
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_kb_categories_parent_id ON kb_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_kb_categories_sort_order ON kb_categories(sort_order);

CREATE INDEX IF NOT EXISTS idx_kb_articles_category_id ON kb_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_kb_articles_author_id ON kb_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_kb_articles_status ON kb_articles(status);
CREATE INDEX IF NOT EXISTS idx_kb_articles_visibility ON kb_articles(visibility);
CREATE INDEX IF NOT EXISTS idx_kb_articles_slug ON kb_articles(slug);
CREATE INDEX IF NOT EXISTS idx_kb_articles_published_at ON kb_articles(published_at DESC);

-- Full text search index
CREATE INDEX IF NOT EXISTS idx_kb_articles_search ON kb_articles
  USING gin(to_tsvector('english', title || ' ' || content || ' ' || COALESCE(excerpt, '')));

CREATE INDEX IF NOT EXISTS idx_ai_qa_pairs_category ON ai_qa_pairs(category);
CREATE INDEX IF NOT EXISTS idx_ai_qa_pairs_enabled ON ai_qa_pairs(enabled);
CREATE INDEX IF NOT EXISTS idx_ai_qa_pairs_priority ON ai_qa_pairs(priority DESC);

CREATE INDEX IF NOT EXISTS idx_process_docs_process_type ON process_docs(process_type);
CREATE INDEX IF NOT EXISTS idx_process_docs_enabled ON process_docs(enabled);

CREATE INDEX IF NOT EXISTS idx_kb_article_views_article_id ON kb_article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_kb_article_views_viewed_at ON kb_article_views(viewed_at DESC);

CREATE INDEX IF NOT EXISTS idx_kb_article_feedback_article_id ON kb_article_feedback(article_id);

-- Enable RLS
ALTER TABLE kb_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_qa_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_article_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies for kb_categories
CREATE POLICY "Anyone can view categories"
  ON kb_categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON kb_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for kb_articles
CREATE POLICY "Public articles viewable by anyone"
  ON kb_articles FOR SELECT
  USING (
    status = 'published' AND (
      visibility = 'public' OR
      (visibility = 'customer_only' AND auth.uid() IS NOT NULL) OR
      (visibility = 'rep_only' AND EXISTS (
        SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role IN ('rep', 'admin')
      )) OR
      (visibility = 'admin_only' AND EXISTS (
        SELECT 1 FROM users WHERE users.auth_id = auth.uid() AND users.role = 'admin'
      ))
    )
  );

CREATE POLICY "Admins can manage all articles"
  ON kb_articles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for ai_qa_pairs
CREATE POLICY "Admins can view Q&A pairs"
  ON ai_qa_pairs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage Q&A pairs"
  ON ai_qa_pairs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for process_docs
CREATE POLICY "Admins can view process docs"
  ON process_docs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage process docs"
  ON process_docs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for kb_article_views
CREATE POLICY "Anyone can insert views"
  ON kb_article_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all views"
  ON kb_article_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- RLS Policies for kb_article_feedback
CREATE POLICY "Anyone can submit feedback"
  ON kb_article_feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own feedback"
  ON kb_article_feedback FOR SELECT
  USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM users
      WHERE users.auth_id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_kb_categories_updated_at
  BEFORE UPDATE ON kb_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kb_articles_updated_at
  BEFORE UPDATE ON kb_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_qa_pairs_updated_at
  BEFORE UPDATE ON ai_qa_pairs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_process_docs_updated_at
  BEFORE UPDATE ON process_docs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed some default categories
INSERT INTO kb_categories (name, slug, description, icon, sort_order) VALUES
  ('Getting Started', 'getting-started', 'New to Modern Health? Start here!', 'Rocket', 1),
  ('Orders & Payments', 'orders-payments', 'Everything about ordering and paying', 'ShoppingCart', 2),
  ('Shipping & Delivery', 'shipping-delivery', 'Tracking and delivery information', 'Truck', 3),
  ('Products', 'products', 'Product information and FAQs', 'Package', 4),
  ('Crypto Payments', 'crypto-payments', 'How to pay with cryptocurrency', 'Bitcoin', 5),
  ('Account & Support', 'account-support', 'Account management and support', 'User', 6)
ON CONFLICT (slug) DO NOTHING;

-- Seed some example Q&A pairs
INSERT INTO ai_qa_pairs (question, answer, category, tags, priority, trigger_keywords, applies_to_roles, enabled) VALUES
  (
    'How long does shipping take?',
    'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. You''ll receive a tracking number once your order ships.',
    'shipping',
    ARRAY['shipping', 'delivery', 'tracking'],
    10,
    ARRAY['how long', 'shipping time', 'delivery time', 'when will', 'arrive'],
    ARRAY['customer'],
    true
  ),
  (
    'What cryptocurrencies do you accept?',
    'We accept Bitcoin (BTC), Ethereum (ETH), and USDT (Tether). When you choose crypto payment, you''ll see the exact amount to send and our wallet address.',
    'crypto',
    ARRAY['crypto', 'bitcoin', 'payment'],
    10,
    ARRAY['cryptocurrency', 'crypto', 'bitcoin', 'ethereum', 'btc', 'eth', 'usdt'],
    ARRAY['customer'],
    true
  ),
  (
    'Can I change my order after placing it?',
    'Yes, if your order hasn''t shipped yet! Contact support immediately and we''ll help you modify it. Once shipped, we can''t make changes but you can return items.',
    'orders',
    ARRAY['orders', 'changes', 'modifications'],
    8,
    ARRAY['change order', 'modify order', 'update order', 'cancel'],
    ARRAY['customer'],
    true
  )
ON CONFLICT DO NOTHING;

-- Seed an example process doc
INSERT INTO process_docs (name, description, process_type, steps, trigger_conditions, enabled) VALUES
  (
    'Help Customer Complete Crypto Payment',
    'Step-by-step process for helping customers pay with cryptocurrency',
    'crypto_payment',
    '[
      {
        "step_number": 1,
        "title": "Verify Order Status",
        "description": "Check if the order exists and needs payment",
        "action": "Use get_order_details(order_number) to get order info",
        "ai_instructions": "Confirm order is in pending payment status"
      },
      {
        "step_number": 2,
        "title": "Generate Payment Link",
        "description": "Create a secure crypto payment link for the customer",
        "action": "Use generate_payment_link(order_id, ''crypto'')",
        "ai_instructions": "This will create a link to the crypto checkout page"
      },
      {
        "step_number": 3,
        "title": "Explain Payment Process",
        "description": "Guide customer through the crypto payment",
        "action": "Explain: Click link → Choose crypto (BTC/ETH/USDT) → Send exact amount to address → Wait for confirmation",
        "ai_instructions": "Be clear that payment usually confirms in 10-30 minutes"
      },
      {
        "step_number": 4,
        "title": "Offer SMS Notification",
        "description": "Optionally send payment link via SMS",
        "action": "Ask if they want the link via text message",
        "ai_instructions": "Only if customer seems to need extra help"
      }
    ]'::jsonb,
    ARRAY['crypto payment', 'bitcoin', 'ethereum', 'payment help', 'how to pay'],
    true
  )
ON CONFLICT DO NOTHING;

-- Comments
COMMENT ON TABLE kb_categories IS 'Categories for organizing knowledge base articles';
COMMENT ON TABLE kb_articles IS 'Knowledge base articles for public documentation and AI training';
COMMENT ON TABLE ai_qa_pairs IS 'Q&A pairs for training Claude AI with consistent answers';
COMMENT ON TABLE process_docs IS 'Step-by-step process documentation for AI and staff';
COMMENT ON TABLE kb_article_views IS 'Track article views for analytics';
COMMENT ON TABLE kb_article_feedback IS 'User feedback on article helpfulness';
