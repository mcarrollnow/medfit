-- Add separate columns for product ratings (easier to view/edit in Supabase dashboard)
-- Supporting up to 3 rating types per product

-- Add rating columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS rating_label_1 TEXT DEFAULT 'Efficacy',
ADD COLUMN IF NOT EXISTS rating_value_1 DECIMAL(3,1) DEFAULT 8.0,
ADD COLUMN IF NOT EXISTS rating_label_2 TEXT DEFAULT 'Safety Profile',
ADD COLUMN IF NOT EXISTS rating_value_2 DECIMAL(3,1) DEFAULT 8.5,
ADD COLUMN IF NOT EXISTS rating_label_3 TEXT DEFAULT 'Research Support',
ADD COLUMN IF NOT EXISTS rating_value_3 DECIMAL(3,1) DEFAULT 7.5;

-- Add comments for documentation
COMMENT ON COLUMN products.rating_label_1 IS 'First rating category label (e.g., Weight Loss Efficacy)';
COMMENT ON COLUMN products.rating_value_1 IS 'First rating value 0-10';
COMMENT ON COLUMN products.rating_label_2 IS 'Second rating category label';
COMMENT ON COLUMN products.rating_value_2 IS 'Second rating value 0-10';
COMMENT ON COLUMN products.rating_label_3 IS 'Third rating category label';
COMMENT ON COLUMN products.rating_value_3 IS 'Third rating value 0-10';

-- Migrate existing JSONB ratings data to new columns (if ratings column exists and has data)
UPDATE products 
SET 
  rating_label_1 = COALESCE((ratings->0->>'label'), 'Efficacy'),
  rating_value_1 = COALESCE((ratings->0->>'value')::decimal, 8.0),
  rating_label_2 = COALESCE((ratings->1->>'label'), 'Safety Profile'),
  rating_value_2 = COALESCE((ratings->1->>'value')::decimal, 8.5),
  rating_label_3 = COALESCE((ratings->2->>'label'), 'Research Support'),
  rating_value_3 = COALESCE((ratings->2->>'value')::decimal, 7.5)
WHERE ratings IS NOT NULL AND jsonb_array_length(ratings) > 0;

-- Now populate with product-specific defaults for products that don't have custom ratings

-- Semaglutide
UPDATE products SET 
  rating_label_1 = 'Weight Loss Efficacy', rating_value_1 = 9.5,
  rating_label_2 = 'Appetite Suppression', rating_value_2 = 9.2,
  rating_label_3 = 'Metabolic Improvement', rating_value_3 = 8.8
WHERE base_name ILIKE '%Semaglutide%' AND rating_label_1 = 'Efficacy';

-- Tirzepatide
UPDATE products SET 
  rating_label_1 = 'Weight Loss Efficacy', rating_value_1 = 10.0,
  rating_label_2 = 'Glycemic Control', rating_value_2 = 9.8,
  rating_label_3 = 'Metabolic Health', rating_value_3 = 9.5
WHERE base_name ILIKE '%Tirzepatide%' AND rating_label_1 = 'Efficacy';

-- Cagrilintide
UPDATE products SET 
  rating_label_1 = 'Appetite Control', rating_value_1 = 10.0,
  rating_label_2 = 'Metabolic Health', rating_value_2 = 10.0,
  rating_label_3 = 'Weight Management', rating_value_3 = 10.0
WHERE base_name ILIKE '%Cagrilintide%' AND rating_label_1 = 'Efficacy';

-- Retatrutide
UPDATE products SET 
  rating_label_1 = 'Weight Loss', rating_value_1 = 9.2,
  rating_label_2 = 'Glucose Control', rating_value_2 = 8.5,
  rating_label_3 = 'Cardiovascular Protection', rating_value_3 = 8.2
WHERE base_name ILIKE '%Retatrutide%' AND rating_label_1 = 'Efficacy';

-- BPC-157
UPDATE products SET 
  rating_label_1 = 'Tissue Repair', rating_value_1 = 8.7,
  rating_label_2 = 'Inflammation Reduction', rating_value_2 = 8.2,
  rating_label_3 = 'Recovery Speed', rating_value_3 = 8.5
WHERE base_name ILIKE '%BPC-157%' AND rating_label_1 = 'Efficacy';

-- TB-500
UPDATE products SET 
  rating_label_1 = 'Tissue Repair', rating_value_1 = 8.5,
  rating_label_2 = 'Recovery Speed', rating_value_2 = 8.2,
  rating_label_3 = 'Cardiac Protection', rating_value_3 = 7.5
WHERE base_name ILIKE '%TB-500%' AND rating_label_1 = 'Efficacy';

-- AOD-9604
UPDATE products SET 
  rating_label_1 = 'Fat Reduction', rating_value_1 = 6.4,
  rating_label_2 = 'Metabolic Health', rating_value_2 = 5.5,
  rating_label_3 = 'Recovery Support', rating_value_3 = 4.8
WHERE base_name ILIKE '%AOD-9604%' AND rating_label_1 = 'Efficacy';

-- CJC-1295
UPDATE products SET 
  rating_label_1 = 'Muscle Growth', rating_value_1 = 7.8,
  rating_label_2 = 'Recovery Enhancement', rating_value_2 = 7.5,
  rating_label_3 = 'Performance Improvement', rating_value_3 = 7.2
WHERE base_name ILIKE '%CJC-1295%' AND rating_label_1 = 'Efficacy';

-- Ipamorelin
UPDATE products SET 
  rating_label_1 = 'Growth Hormone', rating_value_1 = 7.8,
  rating_label_2 = 'Muscle Development', rating_value_2 = 7.2,
  rating_label_3 = 'Recovery', rating_value_3 = 7.5
WHERE base_name ILIKE '%Ipamorelin%' AND rating_label_1 = 'Efficacy';

-- DSIP
UPDATE products SET 
  rating_label_1 = 'Sleep Quality Enhancement', rating_value_1 = 9.0,
  rating_label_2 = 'Stress Reduction', rating_value_2 = 8.5,
  rating_label_3 = 'Pain Tolerance', rating_value_3 = 7.0
WHERE base_name ILIKE '%DSIP%' AND rating_label_1 = 'Efficacy';

-- Epithalon
UPDATE products SET 
  rating_label_1 = 'Cellular Health', rating_value_1 = 6.5,
  rating_label_2 = 'Longevity Enhancement', rating_value_2 = 5.8,
  rating_label_3 = 'Tumor Reduction', rating_value_3 = 4.2
WHERE base_name ILIKE '%Epithalon%' AND rating_label_1 = 'Efficacy';

-- GHK-Cu
UPDATE products SET 
  rating_label_1 = 'Skin Rejuvenation', rating_value_1 = 9.0,
  rating_label_2 = 'Collagen Enhancement', rating_value_2 = 9.0,
  rating_label_3 = 'Hair Growth', rating_value_3 = 9.0
WHERE base_name ILIKE '%GHK-Cu%' AND rating_label_1 = 'Efficacy';

-- PT-141
UPDATE products SET 
  rating_label_1 = 'Sexual Desire', rating_value_1 = 8.5,
  rating_label_2 = 'Sexual Satisfaction', rating_value_2 = 8.2,
  rating_label_3 = 'Distress Reduction', rating_value_3 = 7.5
WHERE base_name ILIKE '%PT-141%' AND rating_label_1 = 'Efficacy';

-- Melanotan
UPDATE products SET 
  rating_label_1 = 'Skin Pigmentation', rating_value_1 = 9.0,
  rating_label_2 = 'Sexual Function', rating_value_2 = 7.8,
  rating_label_3 = 'Appetite Suppression', rating_value_3 = 6.5
WHERE base_name ILIKE '%Melanotan%' AND rating_label_1 = 'Efficacy';

-- Selank
UPDATE products SET 
  rating_label_1 = 'Anxiety Reduction', rating_value_1 = 7.2,
  rating_label_2 = 'Memory Enhancement', rating_value_2 = 6.8,
  rating_label_3 = 'Focus Improvement', rating_value_3 = 7.0
WHERE base_name ILIKE '%Selank%' AND rating_label_1 = 'Efficacy';

-- Semax
UPDATE products SET 
  rating_label_1 = 'Memory Enhancement', rating_value_1 = 7.5,
  rating_label_2 = 'Focus Improvement', rating_value_2 = 7.8,
  rating_label_3 = 'Neuroprotection', rating_value_3 = 7.2
WHERE base_name ILIKE '%Semax%' AND rating_label_1 = 'Efficacy';

-- Sermorelin
UPDATE products SET 
  rating_label_1 = 'Growth Velocity', rating_value_1 = 7.5,
  rating_label_2 = 'Lean Mass Increase', rating_value_2 = 7.2,
  rating_label_3 = 'Fat Reduction', rating_value_3 = 6.8
WHERE base_name ILIKE '%Sermorelin%' AND rating_label_1 = 'Efficacy';

-- Tesamorelin
UPDATE products SET 
  rating_label_1 = 'Visceral Fat Reduction', rating_value_1 = 8.8,
  rating_label_2 = 'IGF-1 Enhancement', rating_value_2 = 8.2,
  rating_label_3 = 'Physique', rating_value_3 = 7.8
WHERE base_name ILIKE '%Tesamorelin%' AND rating_label_1 = 'Efficacy';

-- Thymosin Alpha-1
UPDATE products SET 
  rating_label_1 = 'T-Cell Enhancement', rating_value_1 = 8.2,
  rating_label_2 = 'Infection Reduction', rating_value_2 = 7.8,
  rating_label_3 = 'NK Cell Activity', rating_value_3 = 9.0
WHERE base_name ILIKE '%Thymosin Alpha%' AND rating_label_1 = 'Efficacy';

-- NAD+
UPDATE products SET 
  rating_label_1 = 'Cognitive Enhancement', rating_value_1 = 6.8,
  rating_label_2 = 'Energy & Performance', rating_value_2 = 7.2,
  rating_label_3 = 'Cellular Health', rating_value_3 = 7.5
WHERE base_name ILIKE '%NAD%' AND rating_label_1 = 'Efficacy';

-- HGH
UPDATE products SET 
  rating_label_1 = 'Muscle Growth', rating_value_1 = 9.2,
  rating_label_2 = 'Fat Reduction', rating_value_2 = 8.8,
  rating_label_3 = 'Bone Density', rating_value_3 = 8.5
WHERE base_name ILIKE '%HGH%' AND rating_label_1 = 'Efficacy';

-- HCG
UPDATE products SET 
  rating_label_1 = 'Testosterone Production', rating_value_1 = 8.8,
  rating_label_2 = 'Ovulation Induction', rating_value_2 = 9.2,
  rating_label_3 = 'Fertility Preservation', rating_value_3 = 8.5
WHERE base_name ILIKE '%HCG%' AND rating_label_1 = 'Efficacy';

