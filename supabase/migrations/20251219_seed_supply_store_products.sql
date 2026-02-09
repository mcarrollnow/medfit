-- ============================================
-- SEED SUPPLY STORE PRODUCTS
-- Products for gymowner, spaowner, wellnessowner
-- ============================================

-- Clear existing products (optional - comment out if you want to keep existing)
-- DELETE FROM supply_store_products;

-- Insert products
INSERT INTO supply_store_products (sku, product_name, brand, category, description, wholesale_price, retail_price, image_url, source_url, in_stock, features, specs, business_types) VALUES

-- Recovery Equipment
('REC-001', 'Normatec Elite', 'Hyperice', 'Recovery Equipment', 'Professional compression therapy system with cordless dynamic air compression for elite recovery.', 799, 999, '/product_images/recovery/REC-001_normatec_elite.jpg', 'https://hyperice.com/products/normatec-elite', true, '["7 compression levels", "Cordless design", "4-hour battery life", "Bluetooth connectivity"]', '{"weight": "3.2 lbs", "warranty": "2 years"}', ARRAY['gym', 'medspa', 'wellness']),

('REC-002', 'Normatec 3 Legs', 'Hyperice', 'Recovery Equipment', 'Complete leg recovery suite with tailored pressures and dynamic cycles for rapid relief.', 549, 699, '/product_images/recovery/REC-002_normatec_3_legs.jpg', 'https://hyperice.com/products/normatec-3-legs', true, '["Patented Pulse technology", "ZoneBoost feature", "Bluetooth app control"]', '{"warranty": "2 years"}', ARRAY['gym', 'medspa', 'wellness']),

('REC-003', 'RecoveryAir JetBoots', 'Therabody', 'Recovery Equipment', 'Advanced leg compression technology for muscle soreness relief and circulation boost.', 699, 899, '/product_images/recovery/REC-003_recoveryair_jetboots.webp', 'https://www.therabody.com/collections/shop-jetboots', true, '["TruGrade compression", "FastFlush technology", "Quiet operation"]', '{"warranty": "1 year"}', ARRAY['gym', 'medspa', 'wellness']),

('REC-004', 'Theragun Pro Plus', 'Therabody', 'Recovery Equipment', 'Professional-grade percussion massage device with advanced features.', 449, 599, '/product_images/recovery/REC-004_theragun_pro_plus.webp', 'https://www.therabody.com/us/en-us/theragun-pro-plus.html', true, '["5 built-in speeds", "OLED screen", "Wireless charging"]', '{"weight": "2.2 lbs", "battery_life": "150 minutes"}', ARRAY['gym', 'medspa', 'wellness']),

('REC-005', 'Theragun PRO 5th Gen', 'Therabody', 'Recovery Equipment', 'Professional-grade massage gun for deep muscle relief and recovery.', 349, 449, '/product_images/recovery/REC-005_theragun_pro_5th_gen.png', 'https://www.therabody.com/us/en-us/theragun-pro.html', true, '["60 lbs force", "Rotating arm", "Smart app integration"]', '{"weight": "2.2 lbs", "battery_life": "120 minutes", "warranty": "1 year"}', ARRAY['gym', 'medspa', 'wellness']),

('REC-006', 'Theragun Prime', 'Therabody', 'Recovery Equipment', 'Most durable massage gun built for reliable recovery.', 249, 299, '/product_images/recovery/REC-006_theragun_prime.webp', 'https://www.therabody.com/products/theragun-prime-gen-6-massage-gun', true, '["Impact-resistant design", "Deep percussive massage", "4 attachments"]', '{"weight": "32 oz", "warranty": "1 year"}', ARRAY['gym', 'medspa', 'wellness']),

('REC-007', 'Hypervolt 2 Pro', 'Hyperice', 'Recovery Equipment', 'Professional percussion massage device with Bluetooth connectivity.', 279, 349, '/product_images/recovery/REC-007_hypervolt_2_pro.jpg', 'https://hyperice.com/products/hypervolt-2-pro', true, '["5 speed settings", "Pressure sensor", "Quiet Glide technology"]', '{"weight": "2.6 lbs", "battery_life": "3 hours"}', ARRAY['gym', 'medspa', 'wellness']),

('REC-008', 'Hypervolt 2', 'Hyperice', 'Recovery Equipment', 'Powerful percussion massage with 3 speed settings.', 229, 299, '/product_images/recovery/REC-008_hypervolt_2.webp', 'https://hyperice.com/products/hypervolt-2', true, '["3 speed settings", "Lightweight design", "5 attachment heads"]', '{"weight": "1.8 lbs", "battery_life": "2.5 hours"}', ARRAY['gym', 'medspa', 'wellness']),

('REC-009', 'Hypervolt Go 2', 'Hyperice', 'Recovery Equipment', 'Compact percussion massage device for on-the-go recovery.', 149, 199, '/product_images/recovery/REC-009_hypervolt_go_2.webp', 'https://hyperice.com/products/hypervolt-go-2', true, '["Portable design", "2 speed settings", "TSA-approved battery"]', '{"weight": "1.5 lbs", "battery_life": "2.5 hours"}', ARRAY['gym', 'medspa', 'wellness']),

('REC-010', 'Vyper 3 Foam Roller', 'Hyperice', 'Recovery Equipment', 'Vibrating foam roller with 3 speed settings for deep tissue massage.', 149, 199, '/product_images/recovery/REC-010_foam_roller_vyper_3.webp', 'https://hyperice.com/products/vyper-3', true, '["3 vibration speeds", "Rechargeable battery", "Firm density"]', '{"dimensions": "12 inches", "battery_life": "2 hours"}', ARRAY['gym', 'wellness']),

('REC-011', 'Hypersphere Mini', 'Hyperice', 'Recovery Equipment', 'Compact vibrating massage ball for targeted relief.', 89, 119, '/product_images/recovery/REC-011_hypersphere_mini.jpg', 'https://hyperice.com/products/hypersphere-mini', true, '["3 vibration speeds", "Travel-friendly", "High-intensity vibration"]', '{"diameter": "3.15 inches", "battery_life": "2 hours"}', ARRAY['gym', 'wellness']),

('REC-012', 'Wave Series Roller', 'Therabody', 'Recovery Equipment', 'Vibrating foam roller with wave technology for enhanced recovery.', 119, 149, '/product_images/recovery/REC-012_wave_series_roller.webp', 'https://www.therabody.com/products/wave-series-roller', true, '["5 vibration frequencies", "Ergonomic design", "Bluetooth enabled"]', '{"length": "12 inches", "warranty": "1 year"}', ARRAY['gym', 'wellness']),

('REC-013', 'Wave Solo', 'Therabody', 'Recovery Equipment', 'Targeted vibration therapy ball for precise muscle relief.', 79, 99, '/product_images/recovery/REC-013_wave_solo.png', 'https://www.therabody.com/products/wave-solo', true, '["3 vibration patterns", "Compact size", "Rechargeable"]', '{"diameter": "4.7 inches", "battery_life": "3 hours"}', ARRAY['gym', 'wellness']),

-- Cold Plunge & Heat Therapy
('CPH-001', 'Plunge Gen 2 Pro Chiller', 'Plunge', 'Cold Plunge & Heat Therapy', 'Professional cold plunge with integrated chiller for precise temperature control.', 4990, 5990, '/product_images/cold_plunge/CPH-001_the_plunge_gen_2_pro_chiller.png', 'https://www.plunge.com/products/plunge-pro', true, '["39-104°F range", "Self-cleaning", "WiFi enabled", "Ozone sanitation"]', '{"capacity": "130 gallons", "dimensions": "66\" x 30\" x 24\""}', ARRAY['medspa', 'wellness']),

('CPH-002', 'Plunge Standard Chiller', 'Plunge', 'Cold Plunge & Heat Therapy', 'Premium cold plunge with standard chiller for home or commercial use.', 3990, 4790, '/product_images/cold_plunge/CPH-002_the_plunge_standard_chiller.png', 'https://www.plunge.com/products/plunge-standard', true, '["39-104°F range", "Filtration system", "Easy installation"]', '{"capacity": "110 gallons", "dimensions": "60\" x 28\" x 24\""}', ARRAY['medspa', 'wellness']),

('CPH-003', 'Plunge All-In', 'Plunge', 'Cold Plunge & Heat Therapy', 'All-in-one cold plunge solution with integrated chiller.', 6490, 7490, '/product_images/cold_plunge/CPH-003_plunge_all-in.png', 'https://www.plunge.com/products/plunge-all-in', true, '["Integrated design", "Premium filtration", "Touch controls"]', '{"capacity": "140 gallons", "warranty": "3 years"}', ARRAY['medspa', 'wellness']),

('CPH-004', 'Ice Barrel 500', 'Ice Barrel', 'Cold Plunge & Heat Therapy', 'Large capacity ice barrel for cold therapy immersion.', 1099, 1299, '/product_images/cold_plunge/CPH-004_ice_barrel_500.jpg', 'https://icebarrel.com/products/ice-barrel-500', true, '["500L capacity", "Insulated design", "Drainage system"]', '{"capacity": "132 gallons", "material": "Recycled plastic"}', ARRAY['medspa', 'wellness']),

('CPH-005', 'Ice Barrel 400', 'Ice Barrel', 'Cold Plunge & Heat Therapy', 'Medium capacity ice barrel for personal cold therapy.', 899, 1099, '/product_images/cold_plunge/CPH-005_ice_barrel_400.jpg', 'https://icebarrel.com/products/ice-barrel-400', true, '["400L capacity", "Portable design", "UV resistant"]', '{"capacity": "105 gallons", "weight": "55 lbs"}', ARRAY['medspa', 'wellness']),

('CPH-006', 'Ice Barrel 300', 'Ice Barrel', 'Cold Plunge & Heat Therapy', 'Compact ice barrel for efficient cold therapy sessions.', 699, 849, '/product_images/cold_plunge/CPH-006_ice_barrel_300.jpg', 'https://icebarrel.com/products/ice-barrel-300', true, '["300L capacity", "Lightweight", "Easy drainage"]', '{"capacity": "79 gallons", "weight": "45 lbs"}', ARRAY['medspa', 'wellness']),

('CPH-007', 'Ice Barrel Chiller', 'Ice Barrel', 'Cold Plunge & Heat Therapy', 'Electric chiller unit compatible with Ice Barrel products.', 2199, 2699, '/product_images/cold_plunge/CPH-007_ice_barrel_chiller.jpg', 'https://icebarrel.com/products/ice-barrel-chiller', true, '["37-60°F range", "Energy efficient", "Quiet operation"]', '{"power": "110V", "warranty": "2 years"}', ARRAY['medspa', 'wellness']),

('CPH-010', 'Infrared Sauna Blanket V4', 'HigherDOSE', 'Cold Plunge & Heat Therapy', 'Portable infrared sauna blanket for at-home heat therapy.', 399, 499, '/product_images/cold_plunge/CPH-010_infrared_sauna_blanket_v4.jpg', 'https://higherdose.com/products/infrared-sauna-blanket', true, '["Low EMF", "8 heat settings", "Tourmaline layer"]', '{"max_temp": "158°F", "warranty": "1 year"}', ARRAY['medspa', 'wellness']),

('CPH-011', 'Infrared PEMF Go Mat', 'HigherDOSE', 'Cold Plunge & Heat Therapy', 'Portable infrared mat with PEMF technology.', 699, 899, '/product_images/cold_plunge/CPH-011_infrared_pemf_go_mat.jpg', 'https://higherdose.com/products/infrared-pemf-go-mat', true, '["PEMF technology", "Far infrared", "Portable design"]', '{"dimensions": "60\" x 24\"", "warranty": "1 year"}', ARRAY['medspa', 'wellness']),

('CPH-012', 'MiHIGH Sauna Blanket', 'MiHIGH', 'Cold Plunge & Heat Therapy', 'Premium infrared sauna blanket for deep detox.', 349, 449, '/product_images/cold_plunge/CPH-012_mihigh_sauna_blanket.png', 'https://mihigh.com/products/sauna-blanket', true, '["9 temperature settings", "Auto shut-off", "Low EMF"]', '{"max_temp": "176°F", "warranty": "1 year"}', ARRAY['medspa', 'wellness']),

('CPH-013', 'Sunlighten mPulse Smart Sauna', 'Sunlighten', 'Cold Plunge & Heat Therapy', 'Full spectrum infrared sauna with smart controls.', 7999, 9999, '/product_images/cold_plunge/CPH-013_sunlighten_mpulse_smart_sauna.png', 'https://sunlighten.com/products/mpulse-smart-sauna', true, '["Full spectrum infrared", "Chromotherapy", "Android tablet control"]', '{"capacity": "2 person", "warranty": "Lifetime"}', ARRAY['medspa', 'wellness']),

-- Cardio Equipment
('CAR-001', 'Echo Bike V3.0', 'Rogue', 'Cardio Equipment', 'Heavy-duty air bike for high-intensity interval training.', 749, 899, '/product_images/cardio/CAR-001_echo_bike_v30.png', 'https://www.roguefit.com/rogue-echo-bike', true, '["Belt drive system", "LCD console", "Steel construction"]', '{"weight_capacity": "350 lbs", "warranty": "2 years"}', ARRAY['gym']),

('CAR-002', 'Echo Rower', 'Rogue', 'Cardio Equipment', 'Commercial-grade rowing machine with air resistance.', 799, 945, '/product_images/cardio/CAR-002_echo_rower.png', 'https://www.roguefit.com/rogue-echo-rower', true, '["Air resistance", "Adjustable footrests", "Performance monitor"]', '{"max_user_height": "6''6\"", "warranty": "2 years"}', ARRAY['gym']),

('CAR-003', 'RowErg Model D', 'Concept2', 'Cardio Equipment', 'Industry-standard rowing machine used worldwide.', 990, 1095, '/product_images/cardio/CAR-003_rowerg_model_d.png', 'https://www.concept2.com/indoor-rowers/model-d', true, '["PM5 monitor", "Nickel-plated chain", "Separates for storage"]', '{"warranty": "5 years frame, 2 years parts"}', ARRAY['gym']),

('CAR-004', 'RowErg Tall Legs', 'Concept2', 'Cardio Equipment', 'RowErg with tall legs for easier access.', 1040, 1145, '/product_images/cardio/CAR-004_rowerg_tall_legs.png', 'https://www.concept2.com/indoor-rowers/rowerg-tall', true, '["20\" seat height", "PM5 monitor", "Easy entry/exit"]', '{"warranty": "5 years frame, 2 years parts"}', ARRAY['gym']),

('CAR-005', 'BikeErg', 'Concept2', 'Cardio Equipment', 'Air resistance stationary bike with performance monitor.', 1050, 1195, '/product_images/cardio/CAR-005_bikeerg.png', 'https://www.concept2.com/bikeerg', true, '["PM5 monitor", "Air resistance", "Adjustable everything"]', '{"weight": "68 lbs", "warranty": "5 years frame"}', ARRAY['gym']),

('CAR-006', 'SkiErg', 'Concept2', 'Cardio Equipment', 'Nordic skiing simulator for full-body cardio workout.', 950, 1045, '/product_images/cardio/CAR-006_skierg.png', 'https://www.concept2.com/skierg', true, '["PM5 monitor", "Wall or floor mount", "Adjustable resistance"]', '{"warranty": "5 years frame, 2 years parts"}', ARRAY['gym']),

('CAR-007', 'Assault AirBike Classic', 'Assault Fitness', 'Cardio Equipment', 'Original assault bike for CrossFit and HIIT training.', 699, 799, '/product_images/cardio/CAR-007_assault_airbike_classic.png', 'https://www.assaultfitness.com/products/assault-airbike-classic', true, '["Unlimited resistance", "Steel frame", "LCD console"]', '{"weight_capacity": "350 lbs", "warranty": "5 years frame"}', ARRAY['gym']),

('CAR-008', 'Assault AirRunner', 'Assault Fitness', 'Cardio Equipment', 'Curved manual treadmill for natural running motion.', 2999, 3499, '/product_images/cardio/CAR-008_assault_airrunner.webp', 'https://www.assaultfitness.com/products/assault-airrunner', true, '["Self-powered", "Steel frame", "Low maintenance"]', '{"weight_capacity": "350 lbs", "warranty": "Frame lifetime"}', ARRAY['gym']),

('CAR-009', 'TrueForm Runner', 'TrueForm', 'Cardio Equipment', 'Premium curved treadmill with motorless design.', 5499, 6295, '/product_images/cardio/CAR-009_trueform_runner.jpg', 'https://trueformrunner.com/products/trueform-runner', true, '["No motor needed", "Commercial grade", "Quiet operation"]', '{"weight_capacity": "500 lbs", "warranty": "10 years"}', ARRAY['gym']),

('CAR-010', 'REP Strive Curved Treadmill', 'REP Fitness', 'Cardio Equipment', 'Affordable curved treadmill for commercial facilities.', 2999, 3499, '/product_images/cardio/CAR-010_rep_strive_curved_treadmill.png', 'https://repfitness.com/products/strive-curved-treadmill', true, '["Self-powered", "8 resistance levels", "Bluetooth"]', '{"weight_capacity": "400 lbs", "warranty": "3 years"}', ARRAY['gym']),

-- Strength Equipment
('STR-001', 'REP x Pépin Fast Series 85lb Pair', 'REP Fitness', 'Strength Equipment', 'Quick-adjust dumbbells from 5-85 lbs per hand.', 799, 999, '/product_images/strength/STR-001_rep_x_pépin_fast_series_85lb_pair.png', 'https://repfitness.com/products/fast-series-adjustable-dumbbells', true, '["5-85 lb range", "Quick adjustment", "Compact design"]', '{"adjustment_increments": "5 lbs", "warranty": "Lifetime"}', ARRAY['gym']),

('STR-002', 'REP x Pépin Fast Series 105lb Pair', 'REP Fitness', 'Strength Equipment', 'Heavy-duty quick-adjust dumbbells up to 105 lbs.', 999, 1249, '/product_images/strength/STR-002_rep_x_pépin_fast_series_105lb_pair.png', 'https://repfitness.com/products/fast-series-105', true, '["5-105 lb range", "Fast switching", "Durable construction"]', '{"adjustment_increments": "5 lbs", "warranty": "Lifetime"}', ARRAY['gym']),

('STR-003', 'REP x Pépin Fast Series 125lb Pair', 'REP Fitness', 'Strength Equipment', 'Maximum weight quick-adjust dumbbells for serious lifters.', 1199, 1499, '/product_images/strength/STR-003_rep_x_pépin_fast_series_125lb_pair.png', 'https://repfitness.com/products/fast-series-125', true, '["5-125 lb range", "Professional grade", "Space saving"]', '{"adjustment_increments": "5 lbs", "warranty": "Lifetime"}', ARRAY['gym']),

('STR-004', 'SelectTech 552 Pair', 'Bowflex', 'Strength Equipment', 'Adjustable dumbbells replacing 15 sets of weights.', 349, 429, '/product_images/strength/STR-004_selecttech_552_pair.png', 'https://www.bowflex.com/selecttech/552/100131.html', true, '["5-52.5 lb range", "Dial system", "Compact storage"]', '{"adjustment_increments": "2.5 lbs", "warranty": "2 years"}', ARRAY['gym']),

('STR-006', 'SelectTech 840 Kettlebell', 'Bowflex', 'Strength Equipment', 'Adjustable kettlebell with 6 weight settings.', 149, 199, '/product_images/strength/STR-006_selecttech_840_kettlebell.png', 'https://www.bowflex.com/selecttech/840/100790.html', true, '["8-40 lb range", "6 weights in one", "Ergonomic handle"]', '{"weight_settings": "8,12,20,25,35,40 lbs", "warranty": "2 years"}', ARRAY['gym']),

('STR-007', 'Rubber Hex Dumbbells 5-50lb Set', 'REP Fitness', 'Strength Equipment', 'Complete rubber hex dumbbell set for commercial use.', 899, 1099, '/product_images/strength/STR-007_rubber_hex_dumbbells_5-50lb_set.png', 'https://repfitness.com/products/rubber-hex-dumbbells', true, '["Rubber coated", "Hex shape", "Chrome handles"]', '{"pairs": "10 pairs (5-50 lbs)", "warranty": "3 years"}', ARRAY['gym']),

('STR-008', 'Urethane Dumbbells 5-50lb Set', 'REP Fitness', 'Strength Equipment', 'Premium urethane dumbbells for high-end facilities.', 1499, 1899, '/product_images/strength/STR-008_urethane_dumbbells_5-50lb_set.png', 'https://repfitness.com/products/urethane-dumbbells', true, '["Urethane coating", "Low odor", "Premium finish"]', '{"pairs": "10 pairs (5-50 lbs)", "warranty": "5 years"}', ARRAY['gym']),

('STR-009', 'Rubber Hex Dumbbells 5-100lb Set', 'REP Fitness', 'Strength Equipment', 'Extended rubber hex set for full commercial gym setup.', 2499, 2999, '/product_images/strength/STR-009_rubber_hex_dumbbells_5-100lb_set.png', 'https://repfitness.com/products/rubber-hex-full-set', true, '["Full range", "Durable rubber", "Commercial grade"]', '{"pairs": "20 pairs (5-100 lbs)", "warranty": "3 years"}', ARRAY['gym']),

('STR-010', 'Cast Iron Kettlebells Set', 'Rogue', 'Strength Equipment', 'Classic cast iron kettlebell set for functional training.', 599, 749, '/product_images/strength/STR-010_cast_iron_kettlebells_set.png', 'https://www.roguefit.com/rogue-kettlebells', true, '["Single cast construction", "Matte black finish", "Flat bottom"]', '{"weights": "8kg, 12kg, 16kg, 20kg, 24kg", "warranty": "Lifetime"}', ARRAY['gym']),

('STR-011', 'Competition Kettlebell Set', 'Rogue', 'Strength Equipment', 'Competition-spec kettlebells with color coding.', 799, 999, '/product_images/strength/STR-011_competition_kettlebell_set.png', 'https://www.roguefit.com/competition-kettlebells', true, '["Competition spec", "Color coded", "Steel construction"]', '{"weights": "8kg-32kg", "warranty": "Lifetime"}', ARRAY['gym']),

('STR-012', 'TRX PRO4 System', 'TRX', 'Strength Equipment', 'Professional suspension trainer for commercial use.', 249, 299, '/product_images/strength/STR-012_trx_pro4_system.png', 'https://www.trxtraining.com/products/trx-pro4', true, '["Commercial grade", "Rubber handles", "Locking carabiner"]', '{"weight_capacity": "350 lbs", "warranty": "Lifetime"}', ARRAY['gym']),

('STR-013', 'TRX HOME2 System', 'TRX', 'Strength Equipment', 'Home suspension training system with door anchor.', 149, 199, '/product_images/strength/STR-013_trx_home2_system.png', 'https://www.trxtraining.com/products/trx-home2', true, '["Door anchor included", "Mesh carry bag", "Workout guide"]', '{"weight_capacity": "300 lbs", "warranty": "1 year"}', ARRAY['gym']),

('STR-014', 'TRX Commercial Suspension Trainer', 'TRX', 'Strength Equipment', 'Heavy-duty suspension trainer for gym facilities.', 299, 379, '/product_images/strength/STR-014_trx_commercial_suspension_trainer.png', 'https://www.trxtraining.com/products/commercial-trainer', true, '["Steel carabiner", "Heavy-duty straps", "Commercial warranty"]', '{"weight_capacity": "500 lbs", "warranty": "Lifetime commercial"}', ARRAY['gym']),

-- Accessories & Consumables
('ACC-001', 'Resistance Band Set 5 Levels', 'REP Fitness', 'Accessories & Consumables', 'Complete resistance band set with 5 resistance levels.', 39, 59, '/product_images/accessories/ACC-001_resistance_band_set_5_levels.png', 'https://repfitness.com/products/resistance-bands', true, '["5 resistance levels", "Latex-free", "Color coded"]', '{"resistances": "10-50 lbs", "warranty": "1 year"}', ARRAY['gym', 'wellness']),

('ACC-002', 'Mini Bands Set', 'REP Fitness', 'Accessories & Consumables', 'Mini loop bands for activation and mobility work.', 19, 29, '/product_images/accessories/ACC-002_mini_bands_set.png', 'https://repfitness.com/products/mini-bands', true, '["4 resistance levels", "Non-slip fabric", "Portable"]', '{"includes": "Light, Medium, Heavy, X-Heavy"}', ARRAY['gym', 'wellness']),

('ACC-003', 'Speed Rope SR-1S', 'Rogue', 'Accessories & Consumables', 'Competition speed rope for double-unders.', 29, 39, '/product_images/accessories/ACC-003_speed_rope_sr-1s.jpg', 'https://www.roguefit.com/rogue-sr-1s-speed-rope', true, '["Adjustable length", "Ball bearing handles", "Coated cable"]', '{"cable_diameter": "2.4mm", "warranty": "1 year"}', ARRAY['gym']),

('ACC-004', 'Foam Roller 36-inch', 'Rogue', 'Accessories & Consumables', 'High-density foam roller for recovery and mobility.', 29, 39, '/product_images/accessories/ACC-004_foam_roller_36-inch.jpg', 'https://www.roguefit.com/foam-roller-36', true, '["High density", "Full length", "Durable EVA foam"]', '{"length": "36 inches", "diameter": "6 inches"}', ARRAY['gym', 'wellness']),

('ACC-005', 'Lacrosse Ball Set (2)', 'Rogue', 'Accessories & Consumables', 'Firm lacrosse balls for trigger point release.', 9, 15, '/product_images/accessories/ACC-005_lacrosse_ball_set_2.png', 'https://www.roguefit.com/lacrosse-balls', true, '["Firm rubber", "Multi-surface use", "Pack of 2"]', '{"diameter": "2.5 inches"}', ARRAY['gym', 'wellness']),

('ACC-006', 'Lifting Straps', 'Rogue', 'Accessories & Consumables', 'Heavy-duty lifting straps for deadlifts and pulls.', 19, 29, '/product_images/accessories/ACC-006_lifting_straps.jpg', 'https://www.roguefit.com/lifting-straps', true, '["Cotton construction", "Reinforced stitching", "Loop design"]', '{"length": "21.5 inches", "width": "1.5 inches"}', ARRAY['gym']),

('ACC-007', 'Weightlifting Belt 4-inch', 'Rogue', 'Accessories & Consumables', 'Premium leather weightlifting belt for heavy lifts.', 89, 119, '/product_images/accessories/ACC-007_weightlifting_belt_4-inch.png', 'https://www.roguefit.com/ohio-lifting-belt', true, '["Full grain leather", "Single prong", "4-inch width"]', '{"sizes": "S-XXL", "warranty": "Lifetime"}', ARRAY['gym']),

('ACC-008', 'Knee Sleeves Pair', 'Rogue', 'Accessories & Consumables', 'Neoprene knee sleeves for support and warmth.', 59, 79, '/product_images/accessories/ACC-008_knee_sleeves_pair.jpg', 'https://www.roguefit.com/knee-sleeves', true, '["7mm neoprene", "Competition approved", "Reinforced seams"]', '{"sizes": "XS-XXL", "warranty": "1 year"}', ARRAY['gym']),

('ACC-009', 'Wrist Wraps 18-inch', 'Rogue', 'Accessories & Consumables', 'Supportive wrist wraps for pressing movements.', 24, 34, '/product_images/accessories/ACC-009_wrist_wraps_18-inch.png', 'https://www.roguefit.com/wrist-wraps', true, '["Thumb loop", "Hook and loop closure", "Stiff support"]', '{"length": "18 inches", "warranty": "1 year"}', ARRAY['gym']),

('ACC-010', 'Gym Chalk Block 8-Pack', 'Rogue', 'Accessories & Consumables', 'Magnesium carbonate chalk blocks for grip.', 15, 22, '/product_images/accessories/ACC-010_gym_chalk_block_8-pack.png', 'https://www.roguefit.com/gym-chalk', true, '["Pure magnesium carbonate", "Long lasting", "8 blocks"]', '{"total_weight": "1 lb"}', ARRAY['gym']),

('ACC-011', 'Liquid Chalk 250ml', 'Rogue', 'Accessories & Consumables', 'Mess-free liquid chalk for gyms and climbing.', 12, 18, '/product_images/accessories/ACC-011_liquid_chalk_250ml.jpg', 'https://www.roguefit.com/liquid-chalk', true, '["Quick drying", "No mess", "Alcohol-based"]', '{"volume": "250ml"}', ARRAY['gym']),

('ACC-012', 'Microfiber Gym Towels 12-Pack', 'REP Fitness', 'Accessories & Consumables', 'Quick-dry microfiber towels for gym use.', 29, 39, '/product_images/accessories/ACC-012_microfiber_gym_towels_12.png', 'https://repfitness.com/products/gym-towels', true, '["Quick dry", "Antibacterial", "Machine washable"]', '{"size": "16x27 inches", "quantity": "12 pack"}', ARRAY['gym', 'wellness']),

('ACC-013', 'Shaker Bottles 24-Pack', 'BlenderBottle', 'Accessories & Consumables', 'Classic shaker bottles for protein shakes - bulk pack.', 99, 149, '/product_images/accessories/ACC-013_shaker_bottles_24-pack.jpg', 'https://www.blenderbottle.com/products/classic', true, '["BlenderBall wire whisk", "Leak-proof", "BPA-free"]', '{"capacity": "28oz each", "quantity": "24 pack"}', ARRAY['gym', 'wellness']),

('ACC-014', 'Resistance Tube Set', 'REP Fitness', 'Accessories & Consumables', 'Resistance tubes with handles for versatile training.', 49, 69, '/product_images/accessories/ACC-014_resistance_tube_set.png', 'https://repfitness.com/products/resistance-tubes', true, '["5 tubes", "Door anchor", "Ankle straps"]', '{"resistances": "5-40 lbs"}', ARRAY['gym', 'wellness']),

-- Supplements
('SUP-002', 'Plant Protein 2lb', 'Optimum Nutrition', 'Supplements', 'Plant-based protein powder for retail resale.', 29, 45, '/product_images/supplements/SUP-002_plant_protein_2lb.jpg', 'https://www.optimumnutrition.com/products/plant-protein', true, '["24g protein", "Pea & rice blend", "Naturally flavored"]', '{"servings": "20 per container", "flavors": "Chocolate, Vanilla"}', ARRAY['gym', 'medspa', 'wellness']),

('SUP-006', 'Electrolyte Powder 90 Servings', 'LMNT', 'Supplements', 'Zero-sugar electrolyte mix for hydration.', 49, 75, '/product_images/supplements/SUP-006_electrolyte_powder_90_servings.png', 'https://drinklmnt.com/products/lmnt-electrolytes', true, '["Zero sugar", "1000mg sodium", "Keto friendly"]', '{"servings": "90", "flavors": "Multiple available"}', ARRAY['gym', 'medspa', 'wellness']),

('SUP-007', 'Fish Oil 120 Softgels', 'Nordic Naturals', 'Supplements', 'Premium omega-3 fish oil for retail.', 24, 39, '/product_images/supplements/SUP-007_fish_oil_120_softgels.jpg', 'https://www.nordicnaturals.com/products/ultimate-omega', true, '["1280mg omega-3", "Lemon flavor", "Third-party tested"]', '{"count": "120 softgels", "serving_size": "2 softgels"}', ARRAY['gym', 'medspa', 'wellness']),

('SUP-008', 'Vitamin D3 5000IU 360ct', 'Nordic Naturals', 'Supplements', 'High-potency vitamin D3 softgels.', 19, 32, '/product_images/supplements/SUP-008_vitamin_d3_5000iu_360ct.png', 'https://www.nordicnaturals.com/products/vitamin-d3', true, '["5000 IU per softgel", "Olive oil base", "Easy absorption"]', '{"count": "360 softgels", "supply": "1 year"}', ARRAY['gym', 'medspa', 'wellness']),

('SUP-009', 'Magnesium Glycinate 120ct', 'Nordic Naturals', 'Supplements', 'Highly absorbable magnesium for muscle recovery.', 22, 36, '/product_images/supplements/SUP-009_magnesium_glycinate_120ct.png', 'https://www.nordicnaturals.com/products/magnesium', true, '["200mg per capsule", "Glycinate form", "Gentle on stomach"]', '{"count": "120 capsules", "serving_size": "2 capsules"}', ARRAY['gym', 'medspa', 'wellness']),

('SUP-011', 'Collagen Peptides 20oz', 'Vital Proteins', 'Supplements', 'Grass-fed collagen peptides powder.', 32, 49, '/product_images/supplements/SUP-011_collagen_peptides_20oz.jpg', 'https://www.vitalproteins.com/products/collagen-peptides', true, '["20g collagen per serving", "Unflavored", "Grass-fed"]', '{"weight": "20oz", "servings": "28"}', ARRAY['gym', 'medspa', 'wellness']),

('SUP-012', 'Protein Bars 12-Pack', 'Optimum Nutrition', 'Supplements', 'High-protein bars for retail resale.', 24, 36, '/product_images/supplements/SUP-012_protein_bars_12-pack.png', 'https://www.optimumnutrition.com/products/protein-bars', true, '["20g protein per bar", "Low sugar", "Gluten-free"]', '{"quantity": "12 bars", "flavors": "Chocolate, Peanut Butter"}', ARRAY['gym', 'medspa', 'wellness'])

ON CONFLICT (sku) DO UPDATE SET
  product_name = EXCLUDED.product_name,
  brand = EXCLUDED.brand,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  wholesale_price = EXCLUDED.wholesale_price,
  retail_price = EXCLUDED.retail_price,
  image_url = EXCLUDED.image_url,
  source_url = EXCLUDED.source_url,
  in_stock = EXCLUDED.in_stock,
  features = EXCLUDED.features,
  specs = EXCLUDED.specs,
  business_types = EXCLUDED.business_types,
  updated_at = TIMEZONE('utc', NOW());

