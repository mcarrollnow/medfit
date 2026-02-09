-- Populate ratings column with default values based on product base_name
-- This updates products that have empty or null ratings

-- Semaglutide
UPDATE products SET ratings = '[
  {"label": "Weight Loss Efficacy", "value": 9.5},
  {"label": "Appetite Suppression", "value": 9.2},
  {"label": "Metabolic Improvement", "value": 8.8}
]'::jsonb
WHERE base_name ILIKE '%Semaglutide%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Tirzepatide
UPDATE products SET ratings = '[
  {"label": "Weight Loss Efficacy", "value": 10.0},
  {"label": "Glycemic Control", "value": 9.8},
  {"label": "Metabolic Health", "value": 9.5}
]'::jsonb
WHERE base_name ILIKE '%Tirzepatide%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Cagrilintide
UPDATE products SET ratings = '[
  {"label": "Appetite Control", "value": 10.0},
  {"label": "Metabolic Health", "value": 10.0},
  {"label": "Weight Management", "value": 10.0}
]'::jsonb
WHERE base_name ILIKE '%Cagrilintide%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Retatrutide
UPDATE products SET ratings = '[
  {"label": "Weight Loss", "value": 9.2},
  {"label": "Glucose Control", "value": 8.5},
  {"label": "Cardiovascular Protection", "value": 8.2}
]'::jsonb
WHERE base_name ILIKE '%Retatrutide%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- BPC-157
UPDATE products SET ratings = '[
  {"label": "Tissue Repair", "value": 8.7},
  {"label": "Inflammation Reduction", "value": 8.2},
  {"label": "Recovery Speed", "value": 8.5}
]'::jsonb
WHERE base_name ILIKE '%BPC-157%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- TB-500
UPDATE products SET ratings = '[
  {"label": "Tissue Repair", "value": 8.5},
  {"label": "Recovery Speed", "value": 8.2},
  {"label": "Cardiac Protection", "value": 7.5}
]'::jsonb
WHERE base_name ILIKE '%TB-500%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- AOD-9604
UPDATE products SET ratings = '[
  {"label": "Fat Reduction", "value": 6.4},
  {"label": "Metabolic Health", "value": 5.5},
  {"label": "Recovery Support", "value": 4.8}
]'::jsonb
WHERE base_name ILIKE '%AOD-9604%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- CJC-1295
UPDATE products SET ratings = '[
  {"label": "Muscle Growth", "value": 7.8},
  {"label": "Recovery Enhancement", "value": 7.5},
  {"label": "Performance Improvement", "value": 7.2}
]'::jsonb
WHERE base_name ILIKE '%CJC-1295%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Ipamorelin
UPDATE products SET ratings = '[
  {"label": "Growth Hormone", "value": 7.8},
  {"label": "Muscle Development", "value": 7.2},
  {"label": "Recovery", "value": 7.5}
]'::jsonb
WHERE base_name ILIKE '%Ipamorelin%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- DSIP (Delta Sleep Inducing Peptide)
UPDATE products SET ratings = '[
  {"label": "Sleep Quality Enhancement", "value": 9.0},
  {"label": "Stress Reduction", "value": 8.5},
  {"label": "Pain Tolerance", "value": 7.0}
]'::jsonb
WHERE base_name ILIKE '%DSIP%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Epithalon
UPDATE products SET ratings = '[
  {"label": "Cellular Health", "value": 6.5},
  {"label": "Longevity Enhancement", "value": 5.8},
  {"label": "Tumor Reduction", "value": 4.2}
]'::jsonb
WHERE base_name ILIKE '%Epithalon%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- GHK-Cu
UPDATE products SET ratings = '[
  {"label": "Skin Rejuvenation", "value": 9.0},
  {"label": "Collagen Enhancement", "value": 9.0},
  {"label": "Hair Growth", "value": 9.0}
]'::jsonb
WHERE base_name ILIKE '%GHK-Cu%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- GHRP-2
UPDATE products SET ratings = '[
  {"label": "Growth Hormone Release", "value": 8.2},
  {"label": "Muscle Growth", "value": 7.4},
  {"label": "Fat Reduction", "value": 6.8}
]'::jsonb
WHERE base_name ILIKE '%GHRP-2%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- HCG
UPDATE products SET ratings = '[
  {"label": "Testosterone Production", "value": 8.8},
  {"label": "Ovulation Induction", "value": 9.2},
  {"label": "Fertility Preservation", "value": 8.5}
]'::jsonb
WHERE base_name ILIKE '%HCG%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Hexarelin
UPDATE products SET ratings = '[
  {"label": "Growth Hormone", "value": 8.5},
  {"label": "IGF-1 Elevation", "value": 8.2},
  {"label": "Cardiovascular Protection", "value": 7.2}
]'::jsonb
WHERE base_name ILIKE '%Hexarelin%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- HGH
UPDATE products SET ratings = '[
  {"label": "Muscle Growth", "value": 9.2},
  {"label": "Fat Reduction", "value": 8.8},
  {"label": "Bone Density", "value": 8.5}
]'::jsonb
WHERE base_name ILIKE '%HGH%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- HMG
UPDATE products SET ratings = '[
  {"label": "Improves hormones", "value": 8.2},
  {"label": "Increases fertility", "value": 9.0},
  {"label": "Stimulates egg production", "value": 9.2}
]'::jsonb
WHERE base_name ILIKE '%HMG%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- IGF-1 LR3
UPDATE products SET ratings = '[
  {"label": "Muscle Hypertrophy", "value": 8.8},
  {"label": "Recovery Enhancement", "value": 8.2},
  {"label": "Protein Synthesis", "value": 8.5}
]'::jsonb
WHERE base_name ILIKE '%IGF-1%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Kisspeptin
UPDATE products SET ratings = '[
  {"label": "Fertility Enhancement", "value": 7.8},
  {"label": "Ovulation Induction", "value": 8.2},
  {"label": "Hormone Regulation", "value": 7.5}
]'::jsonb
WHERE base_name ILIKE '%Kisspeptin%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Melanotan-2
UPDATE products SET ratings = '[
  {"label": "Skin Pigmentation", "value": 9.0},
  {"label": "Sexual Function", "value": 7.8},
  {"label": "Appetite Suppression", "value": 6.5}
]'::jsonb
WHERE base_name ILIKE '%Melanotan%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- MOTS-c
UPDATE products SET ratings = '[
  {"label": "Diabetes Prevention", "value": 7.2},
  {"label": "Metabolic Enhancement", "value": 9.0},
  {"label": "Physical Performance", "value": 7.0}
]'::jsonb
WHERE base_name ILIKE '%MOTS-c%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- NAD+
UPDATE products SET ratings = '[
  {"label": "Cognitive Enhancement", "value": 6.8},
  {"label": "Energy & Performance", "value": 7.2},
  {"label": "Cellular Health", "value": 7.5}
]'::jsonb
WHERE base_name ILIKE '%NAD%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Oxytocin
UPDATE products SET ratings = '[
  {"label": "Labor Induction", "value": 9.5},
  {"label": "Hemorrhage Prevention", "value": 9.0},
  {"label": "Social Cognition", "value": 8.0}
]'::jsonb
WHERE base_name ILIKE '%Oxytocin%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- PEG-MGF
UPDATE products SET ratings = '[
  {"label": "Muscle Fiber Growth", "value": 8.2},
  {"label": "Satellite Cell Activation", "value": 8.5},
  {"label": "Recovery Enhancement", "value": 8.0}
]'::jsonb
WHERE base_name ILIKE '%PEG-MGF%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- PNC-27
UPDATE products SET ratings = '[
  {"label": "Cancer Cell Targeting", "value": 10.0},
  {"label": "Cellular Selectivity", "value": 10.0},
  {"label": "Membrane Disruption", "value": 10.0}
]'::jsonb
WHERE base_name ILIKE '%PNC-27%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- PT-141
UPDATE products SET ratings = '[
  {"label": "Sexual Desire", "value": 8.5},
  {"label": "Sexual Satisfaction", "value": 8.2},
  {"label": "Distress Reduction", "value": 7.5}
]'::jsonb
WHERE base_name ILIKE '%PT-141%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Selank
UPDATE products SET ratings = '[
  {"label": "Anxiety Reduction", "value": 7.2},
  {"label": "Memory Enhancement", "value": 6.8},
  {"label": "Focus Improvement", "value": 7.0}
]'::jsonb
WHERE base_name ILIKE '%Selank%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Semax
UPDATE products SET ratings = '[
  {"label": "Memory Enhancement", "value": 7.5},
  {"label": "Focus Improvement", "value": 7.8},
  {"label": "Neuroprotection", "value": 7.2}
]'::jsonb
WHERE base_name ILIKE '%Semax%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Sermorelin
UPDATE products SET ratings = '[
  {"label": "Growth Velocity", "value": 7.5},
  {"label": "Lean Mass Increase", "value": 7.2},
  {"label": "Fat Reduction", "value": 6.8}
]'::jsonb
WHERE base_name ILIKE '%Sermorelin%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- SLU-PP-332
UPDATE products SET ratings = '[
  {"label": "Appetite Suppression", "value": 6.0},
  {"label": "Energy Expenditure", "value": 10.0},
  {"label": "Fat Oxidation", "value": 10.0}
]'::jsonb
WHERE base_name ILIKE '%SLU-PP-332%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- SNAP-8
UPDATE products SET ratings = '[
  {"label": "Wrinkle Reduction", "value": 6.8},
  {"label": "Muscle Contraction Reduction", "value": 7.2},
  {"label": "Skin Elasticity", "value": 6.5}
]'::jsonb
WHERE base_name ILIKE '%SNAP-8%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- SS-31
UPDATE products SET ratings = '[
  {"label": "Mitochondrial Function", "value": 8.5},
  {"label": "ATP Production", "value": 8.2},
  {"label": "Cardiac Protection", "value": 7.8}
]'::jsonb
WHERE base_name ILIKE '%SS-31%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Tesamorelin
UPDATE products SET ratings = '[
  {"label": "Visceral Fat Reduction", "value": 8.8},
  {"label": "IGF-1 Enhancement", "value": 8.2},
  {"label": "Physique", "value": 7.8}
]'::jsonb
WHERE base_name ILIKE '%Tesamorelin%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Thymosin Alpha-1
UPDATE products SET ratings = '[
  {"label": "T-Cell Enhancement", "value": 8.2},
  {"label": "Infection Reduction", "value": 7.8},
  {"label": "NK Cell Activity", "value": 9.0}
]'::jsonb
WHERE base_name ILIKE '%Thymosin Alpha%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Thymulin
UPDATE products SET ratings = '[
  {"label": "Strengthens immunity", "value": 7.2},
  {"label": "Reduces inflammation", "value": 6.8},
  {"label": "Restores thymus function", "value": 7.5}
]'::jsonb
WHERE base_name ILIKE '%Thymulin%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Adipotide
UPDATE products SET ratings = '[
  {"label": "Weight Loss Efficacy", "value": 8.5},
  {"label": "Fat Reduction", "value": 8.8},
  {"label": "Metabolic Health", "value": 6.2}
]'::jsonb
WHERE base_name ILIKE '%Adipotide%' AND (ratings IS NULL OR ratings = '[]'::jsonb);

-- Set default ratings for any products that still don't have ratings
UPDATE products SET ratings = '[
  {"label": "Efficacy", "value": 8.0},
  {"label": "Safety Profile", "value": 8.5},
  {"label": "Research Support", "value": 7.5}
]'::jsonb
WHERE ratings IS NULL OR ratings = '[]'::jsonb;

