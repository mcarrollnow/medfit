-- Add ratings column to products table for editable efficacy ratings
-- The ratings column stores an array of {label, value} objects as JSON

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS ratings JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN products.ratings IS 'Array of {label: string, value: number} objects for product efficacy ratings displayed on product cards';

-- Example of what the data looks like:
-- [
--   {"label": "Weight Loss Efficacy", "value": 9.5},
--   {"label": "Appetite Suppression", "value": 9.2},
--   {"label": "Metabolic Improvement", "value": 8.8}
-- ]

