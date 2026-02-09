-- Add color field to products table for vial icon categorization
-- This will store hex color codes that correspond to different product categories

-- Add color column to products table (only if it doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'color') THEN
        ALTER TABLE products ADD COLUMN color VARCHAR(7) DEFAULT '#fff95e';
    END IF;
END $$;

-- Add comment to explain the color field
COMMENT ON COLUMN products.color IS 'Hex color code for product category vial icons';

-- Update products with correct colors based on product catalog
-- Yellow Labels (#fff95e) - Weight Loss & Metabolic
UPDATE products SET color = '#fff95e' WHERE 
  LOWER(name) LIKE '%semaglutide%' OR
  LOWER(name) LIKE '%tirzepatide%' OR
  LOWER(name) LIKE '%retatrutide%' OR
  LOWER(name) LIKE '%bpc 157%' OR
  LOWER(name) LIKE '%bpc-157%' OR
  LOWER(name) LIKE '%igf lr3%' OR
  LOWER(name) LIKE '%igf-lr3%' OR
  LOWER(name) LIKE '%peg-mgf%' OR
  LOWER(name) LIKE '%nad+%';

-- Purple/Maroon Labels (#6609ff) - Growth Hormone & Peptides  
UPDATE products SET color = '#6609ff' WHERE
  LOWER(name) LIKE '%sermorelin%' OR
  LOWER(name) LIKE '%cjc-1295%' OR
  LOWER(name) LIKE '%triptorelin%' OR
  LOWER(name) LIKE '%pe-22-28%' OR
  LOWER(name) LIKE '%tesamorelin%' OR
  LOWER(name) LIKE '%ss-31%' OR
  LOWER(name) LIKE '%selank%' OR
  LOWER(name) LIKE '%ghrp-6%' OR
  LOWER(name) LIKE '%ghrp-2%' OR
  LOWER(name) LIKE '%melanotan 2%' OR
  LOWER(name) LIKE '%melanotan-2%' OR
  LOWER(name) LIKE '%hcg%' OR
  LOWER(name) LIKE '%hgh%' OR
  LOWER(name) LIKE '%dsip%' OR
  LOWER(name) LIKE '%ipamorelin%' OR
  LOWER(name) LIKE '%aod9604%' OR
  LOWER(name) LIKE '%aod-9604%' OR
  LOWER(name) LIKE '%gnrh%' OR
  LOWER(name) LIKE '%hexarelin%' OR
  LOWER(name) LIKE '%semax%';

-- Red Labels (#e60041) - Reproductive & Sexual Health
UPDATE products SET color = '#e60041' WHERE
  LOWER(name) LIKE '%hmg%' OR
  LOWER(name) LIKE '%pt-141%' OR
  LOWER(name) LIKE '%kisspeptin-10%' OR
  LOWER(name) LIKE '%kisspeptin 10%' OR
  LOWER(name) LIKE '%oxytocin%' OR
  LOWER(name) LIKE '%gonadorelin%';

-- Pink Labels (#ff4dfd) - Anti-Aging Peptides
UPDATE products SET color = '#ff4dfd' WHERE
  LOWER(name) LIKE '%epithalon%' OR
  LOWER(name) LIKE '%pinealon%';

-- Light Blue Labels (#1086ff) - Specialized Metabolic
UPDATE products SET color = '#1086ff' WHERE
  LOWER(name) LIKE '%osglitinide%' OR
  LOWER(name) LIKE '%cagrilintide%';

-- Green Labels (#47ff7b) - Immune & Recovery
UPDATE products SET color = '#47ff7b' WHERE
  LOWER(name) LIKE '%thymulin%' OR
  LOWER(name) LIKE '%tb-500%' OR
  LOWER(name) LIKE '%tb500%' OR
  LOWER(name) LIKE '%thymosin alpha-1%' OR
  LOWER(name) LIKE '%thymosin alpha 1%' OR
  LOWER(name) LIKE '%adipotide%' OR
  LOWER(name) LIKE '%pnc-27%' OR
  LOWER(name) LIKE '%pnc27%';

-- Orange Labels (#ff9845) - Mitochondrial & Performance
UPDATE products SET color = '#ff9845' WHERE
  LOWER(name) LIKE '%mots-c%' OR
  LOWER(name) LIKE '%motsc%' OR
  LOWER(name) LIKE '%epo%' OR
  LOWER(name) LIKE '%humanin%' OR
  LOWER(name) LIKE '%mgf%' OR
  LOWER(name) LIKE '%gdf-8%' OR
  LOWER(name) LIKE '%gdf8%';

-- Gray/Black Labels (#818181) - Cosmetic & Specialized
UPDATE products SET color = '#818181' WHERE
  LOWER(name) LIKE '%ghk-cu%' OR
  LOWER(name) LIKE '%ghkcu%' OR
  LOWER(name) LIKE '%ace-031%' OR
  LOWER(name) LIKE '%ace031%' OR
  LOWER(name) LIKE '%alcar%' OR
  LOWER(name) LIKE '%snap-8%' OR
  LOWER(name) LIKE '%snap8%';

-- Create index on color field for better query performance
CREATE INDEX IF NOT EXISTS idx_products_color ON products(color);
