-- Create policies table for editable policy pages
CREATE TABLE IF NOT EXISTS policies (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  hero_tagline TEXT,
  effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  contact_email TEXT,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_policies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.last_updated = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER policies_updated_at
  BEFORE UPDATE ON policies
  FOR EACH ROW
  EXECUTE FUNCTION update_policies_updated_at();

-- Enable RLS
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published policies
CREATE POLICY "Anyone can view published policies"
  ON policies FOR SELECT
  USING (is_published = true);

-- Allow admins to manage policies
CREATE POLICY "Admins can manage policies"
  ON policies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Insert default policies
INSERT INTO policies (id, slug, title, subtitle, hero_tagline, effective_date, contact_email, content, is_published)
VALUES 
  (
    'privacy-policy',
    'privacy',
    'Privacy Policy',
    'Your Data, Protected',
    'Your Data, Your Rights',
    '2026-01-01',
    'privacy@modernhealthpro.com',
    '[
      {
        "id": "promise",
        "type": "promise",
        "title": "Our Privacy Promise",
        "icon": "Shield",
        "content": "At Medfit 90, your personal information is never for sale. We collect only what we need to serve you, protect it with industry-standard encryption, and never share it with third parties for marketing purposes. This isn''t just policy—it''s how we operate."
      },
      {
        "id": "section-1",
        "type": "section",
        "title": "1. Information We Collect",
        "icon": "FileText",
        "subsections": [
          {
            "title": "Information You Provide",
            "items": [
              {"label": "Account Information", "text": "Name, email address, and password when you create an account"},
              {"label": "Contact Information", "text": "Phone number and mailing address for orders and communication"},
              {"label": "Order Information", "text": "Products purchased, shipping details, and order history"},
              {"label": "Communications", "text": "Messages you send us through support channels"}
            ]
          },
          {
            "title": "Information Collected Automatically",
            "items": [
              {"label": "Device Information", "text": "Browser type, operating system, and device identifiers"},
              {"label": "Usage Data", "text": "Pages visited, time spent, and navigation patterns"},
              {"label": "Log Data", "text": "IP address, access times, and referring URLs"}
            ]
          }
        ]
      },
      {
        "id": "section-2",
        "type": "security-grid",
        "title": "2. How We Protect Your Data",
        "icon": "Lock",
        "intro": "We implement multiple layers of security to protect your personal information:",
        "items": [
          {"icon": "Database", "title": "Database Encryption", "text": "All data stored in our database is encrypted at rest using AES-256 encryption. Sensitive information such as authentication tokens and private keys receive additional encryption layers."},
          {"icon": "Globe", "title": "Secure Transmission", "text": "All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher. We enforce HTTPS on all pages."},
          {"icon": "Lock", "title": "Password Security", "text": "Passwords are never stored in plain text. We use industry-standard hashing algorithms to securely store your credentials."},
          {"icon": "Shield", "title": "Access Controls", "text": "Access to customer data is strictly limited to authorized personnel who require it for legitimate business purposes."}
        ]
      },
      {
        "id": "section-3",
        "type": "two-column",
        "title": "3. Payment Information",
        "icon": "Shield",
        "intro": "We take payment security seriously. Credit card and payment information is handled entirely by our PCI DSS-compliant payment processor.",
        "columns": [
          {
            "title": "We Never Store",
            "icon": "XCircle",
            "iconColor": "red",
            "items": ["Credit card numbers", "CVV/security codes", "Full card expiration dates", "Bank account numbers"]
          },
          {
            "title": "We May Store",
            "icon": "CheckCircle",
            "iconColor": "green",
            "items": ["Transaction reference IDs", "Last 4 digits (for your reference)", "Payment confirmation status", "Billing address"]
          }
        ]
      },
      {
        "id": "section-4",
        "type": "numbered-list",
        "title": "4. How We Use Your Information",
        "icon": "Eye",
        "intro": "We use your information only for legitimate business purposes:",
        "items": [
          {"label": "Order Fulfillment", "text": "Processing orders, shipping products, and providing tracking information"},
          {"label": "Customer Support", "text": "Responding to inquiries and resolving issues"},
          {"label": "Account Management", "text": "Maintaining your account and preferences"},
          {"label": "Transactional Emails", "text": "Order confirmations, shipping updates, and account notifications"},
          {"label": "Security", "text": "Protecting against fraud and unauthorized access"}
        ]
      },
      {
        "id": "section-5",
        "type": "never-list",
        "title": "5. What We Never Do",
        "icon": "XCircle",
        "intro": "Your trust is paramount. We commit to never:",
        "items": [
          "Sell your personal information to third parties",
          "Rent or lease your data to marketers",
          "Share your information for third-party advertising",
          "Trade your data with other companies",
          "Disclose your purchase history to outside parties",
          "Use your data for purposes not disclosed in this policy"
        ]
      },
      {
        "id": "section-6",
        "type": "section",
        "title": "6. Third-Party Services",
        "icon": "Users",
        "intro": "We work with trusted service providers who help us operate our business. These include:",
        "items": [
          {"label": "Payment Processors", "text": "To securely process transactions (they only receive information necessary to complete payments)"},
          {"label": "Shipping Carriers", "text": "To deliver your orders (they receive only shipping address and contact info for delivery)"},
          {"label": "Hosting Providers", "text": "To maintain our website infrastructure (bound by strict data protection agreements)"}
        ],
        "footer": "All service providers are contractually bound to protect your information and prohibited from using it for any purpose other than providing their specific service."
      },
      {
        "id": "section-7",
        "type": "section",
        "title": "7. Cookies & Tracking",
        "icon": "Globe",
        "intro": "We use cookies to enhance your browsing experience:",
        "items": [
          {"label": "Essential Cookies", "text": "Required for site functionality (shopping cart, login sessions)"},
          {"label": "Analytics", "text": "Help us understand how visitors use our site to improve the experience"}
        ],
        "footer": "You can control cookies through your browser settings. Disabling cookies may affect site functionality. We do not use cookies for third-party advertising."
      },
      {
        "id": "section-8",
        "type": "rights-grid",
        "title": "8. Your Rights",
        "icon": "CheckCircle",
        "intro": "You have the right to:",
        "items": [
          {"title": "Access", "text": "Request a copy of the personal data we hold about you"},
          {"title": "Correction", "text": "Request correction of inaccurate or incomplete data"},
          {"title": "Deletion", "text": "Request deletion of your personal data (subject to legal requirements)"},
          {"title": "Opt-Out", "text": "Unsubscribe from marketing communications at any time"}
        ],
        "footer": "To exercise any of these rights, please contact us at the email below."
      },
      {
        "id": "section-9",
        "type": "section",
        "title": "9. Data Retention",
        "icon": "Database",
        "intro": "We retain your personal information only as long as necessary:",
        "items": [
          {"label": "Account Data", "text": "While your account is active, plus a reasonable period after"},
          {"label": "Order Records", "text": "As required for tax and legal compliance purposes"},
          {"label": "Communications", "text": "As needed to provide ongoing support"}
        ],
        "footer": "You may request deletion of your data at any time, subject to legal retention requirements."
      },
      {
        "id": "section-10",
        "type": "simple",
        "title": "10. Policy Updates",
        "icon": "FileText",
        "content": "We may update this Privacy Policy from time to time. When we make material changes, we will update the \"Last Updated\" date and, where appropriate, notify you via email. Your continued use of our services after changes constitutes acceptance of the updated policy."
      }
    ]'::jsonb,
    true
  ),
  (
    'pci-dss-policy',
    'pci_dss_policy',
    'PCI DSS Compliance Policy',
    'Payment Security',
    'Information Security Policy',
    '2026-01-01',
    'security@modernhealthpro.com',
    '[
      {
        "id": "section-1",
        "type": "section",
        "title": "1. Purpose & Scope",
        "icon": "FileText",
        "content": "This Information Security Policy establishes our commitment to protecting payment card data in accordance with the Payment Card Industry Data Security Standard (PCI DSS). This policy applies to all systems, personnel, and processes involved in accepting payment cards.",
        "extra": "Scope: Medfit 90 accepts payment cards through a PCI DSS-validated third-party payment processor. We do not store, process, or transmit cardholder data on our systems. All payment card transactions are handled entirely by our payment processor''s secure, PCI-compliant infrastructure."
      },
      {
        "id": "section-2",
        "type": "two-column",
        "title": "2. Payment Processing Model",
        "icon": "Shield",
        "intro": "We utilize a fully outsourced payment model where all cardholder data is handled by our PCI DSS Level 1 validated payment processor. This approach ensures the highest level of security for our customers'' payment information.",
        "columns": [
          {
            "title": "What We Do",
            "icon": "CheckCircle",
            "iconColor": "green",
            "items": ["Redirect customers to secure payment pages", "Receive transaction confirmations (no card data)", "Store order references and transaction IDs only", "Maintain secure website with HTTPS/TLS"]
          },
          {
            "title": "What We Never Do",
            "icon": "AlertCircle",
            "iconColor": "red",
            "items": ["Store credit card numbers (PAN)", "Store CVV/CVC security codes", "Process card data on our servers", "Have access to full cardholder data"]
          }
        ]
      },
      {
        "id": "section-3",
        "type": "security-controls",
        "title": "3. Security Controls",
        "icon": "Lock",
        "intro": "While we do not handle cardholder data directly, we maintain security controls to protect our systems and ensure the integrity of payment transactions.",
        "items": [
          {"icon": "Network", "title": "Website Security", "text": "All web traffic is encrypted using TLS 1.2 or higher. Our website is hosted on secure, managed infrastructure with regular security updates applied promptly."},
          {"icon": "KeyRound", "title": "Access Control", "text": "Administrative access to our systems requires strong, unique passwords and multi-factor authentication where available. Access is limited to authorized personnel only."},
          {"icon": "Server", "title": "System Security", "text": "We use reputable, security-focused hosting providers. All systems are kept up-to-date with security patches. We do not use default passwords or insecure configurations."},
          {"icon": "Eye", "title": "Monitoring", "text": "We monitor our systems for unauthorized access attempts and suspicious activity. Any security concerns are investigated and addressed promptly."}
        ]
      },
      {
        "id": "section-4",
        "type": "simple",
        "title": "4. Third-Party Service Providers",
        "icon": "Users",
        "content": "We only use payment processors that are validated as PCI DSS compliant. Before engaging any service provider that may impact payment security, we verify their PCI DSS compliance status.",
        "extra": "Our payment processor maintains PCI DSS Level 1 certification, the highest level of compliance, and undergoes annual audits by a Qualified Security Assessor (QSA)."
      },
      {
        "id": "section-5",
        "type": "numbered-list",
        "title": "5. Incident Response",
        "icon": "AlertCircle",
        "intro": "In the event of a suspected security incident involving payment systems:",
        "items": [
          {"text": "Immediately investigate and contain the issue"},
          {"text": "Contact our payment processor''s security team"},
          {"text": "Document the incident and actions taken"},
          {"text": "Notify affected parties as required by law"},
          {"text": "Implement measures to prevent recurrence"}
        ]
      },
      {
        "id": "section-6",
        "type": "bullet-list",
        "title": "6. Personnel Security",
        "icon": "Users",
        "intro": "All personnel with access to systems involved in payment processing must:",
        "items": [
          "Understand this security policy and their responsibilities",
          "Use strong, unique passwords for all accounts",
          "Enable multi-factor authentication where available",
          "Never share credentials or access with unauthorized individuals",
          "Report any suspected security issues immediately",
          "Keep workstations and devices secure and updated"
        ]
      },
      {
        "id": "section-7",
        "type": "policy-review",
        "title": "7. Policy Review",
        "icon": "RefreshCw",
        "content": "This policy is reviewed at least annually and updated as needed to reflect changes in our business operations, payment processing methods, or PCI DSS requirements.",
        "metadata": {
          "policyOwner": "Management",
          "reviewFrequency": "Annual",
          "lastReview": "January 9, 2026",
          "nextReview": "January 2027"
        }
      }
    ]'::jsonb,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Add index for slug lookups
CREATE INDEX IF NOT EXISTS idx_policies_slug ON policies(slug);
CREATE INDEX IF NOT EXISTS idx_policies_published ON policies(is_published);

COMMENT ON TABLE policies IS 'Stores editable policy documents (Privacy Policy, PCI DSS, etc.)';
COMMENT ON COLUMN policies.content IS 'JSON array of content sections with type, title, icon, and content fields';
