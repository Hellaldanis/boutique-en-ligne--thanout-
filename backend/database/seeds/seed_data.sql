-- ============================================
-- SEED DATA: Données de test pour développement
-- ============================================

-- ============================================
-- 1. USERS (Utilisateurs)
-- ============================================
INSERT INTO users (email, password_hash, first_name, last_name, phone, is_verified, is_active) VALUES
('admin@thanout.com', '$2b$10$abc123...', 'Admin', 'Thanout', '+213555000001', TRUE, TRUE),
('marie.lambert@email.dz', '$2b$10$xyz789...', 'Marie', 'Lambert', '+213555000002', TRUE, TRUE),
('amadou.diallo@email.dz', '$2b$10$def456...', 'Amadou', 'Diallo', '+213555000003', TRUE, TRUE),
('fatou.sow@email.dz', '$2b$10$ghi789...', 'Fatou', 'Sow', '+213555000004', TRUE, TRUE),
('karim.benali@email.dz', '$2b$10$jkl012...', 'Karim', 'Benali', '+213555000005', TRUE, TRUE);

-- ============================================
-- 2. USER ADDRESSES
-- ============================================
INSERT INTO user_addresses (user_id, address_type, full_name, phone, address_line1, city, wilaya, is_default) VALUES
(2, 'both', 'Marie Lambert', '+213555000002', '12 Rue Didouche Mourad', 'Alger Centre', 'Alger', TRUE),
(3, 'shipping', 'Amadou Diallo', '+213555000003', 'Cité 5 Juillet', 'Oran', 'Oran', TRUE),
(4, 'both', 'Fatou Sow', '+213555000004', 'Avenue de l''Independence', 'Constantine', 'Constantine', TRUE);

-- ============================================
-- 3. CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description, is_active, display_order) VALUES
('Électronique', 'electronique', 'Smartphones, ordinateurs et accessoires', TRUE, 1),
('Mode', 'mode', 'Vêtements et accessoires de mode', TRUE, 2),
('Chaussures', 'chaussures', 'Chaussures pour homme et femme', TRUE, 3),
('Accessoires', 'accessoires', 'Sacs, bijoux et accessoires', TRUE, 4),
('Maison', 'maison', 'Décoration et équipement maison', TRUE, 5),
('Sport', 'sport', 'Équipement et vêtements de sport', TRUE, 6),
('Beauté', 'beaute', 'Produits de beauté et cosmétiques', TRUE, 7);

-- ============================================
-- 4. BRANDS
-- ============================================
INSERT INTO brands (name, slug, description, is_active) VALUES
('UrbanStyle', 'urbanstyle', 'Mode urbaine moderne', TRUE),
('LuxeLeather', 'luxeleather', 'Maroquinerie de luxe', TRUE),
('TechPro', 'techpro', 'Électronique professionnelle', TRUE),
('SportMax', 'sportmax', 'Équipement sportif', TRUE),
('BeautyGlow', 'beautyglow', 'Cosmétiques premium', TRUE);

-- ============================================
-- 5. PRODUCTS
-- ============================================
INSERT INTO products (category_id, brand_id, name, slug, description, short_description, price, old_price, discount_percentage, stock_quantity, sku, is_active, is_featured, is_new) VALUES
-- Chaussures
(3, 1, 'Baskets Urbaines Premium', 'baskets-urbaines-premium', 
 'Des baskets urbaines premium conçues pour le confort et le style. Idéales pour un usage quotidien avec une semelle amortissante et un design moderne.',
 'Baskets confortables pour un style urbain',
 15000, 20000, 25, 45, 'SHOE-URB-001', TRUE, TRUE, TRUE),

-- Accessoires
(4, 2, 'Sac à Main en Cuir Véritable', 'sac-main-cuir-veritable',
 'Sac à main élégant en cuir véritable, parfait pour toutes les occasions. Spacieux avec plusieurs compartiments.',
 'Sac en cuir élégant et spacieux',
 32000, NULL, 0, 23, 'BAG-LUX-001', TRUE, TRUE, TRUE),

-- Mode
(2, 1, 'T-Shirt Essentiel Cotton Bio', 'tshirt-essentiel-cotton-bio',
 'T-shirt basique en coton bio 100%, doux et respirant. Coupe moderne et confortable.',
 'T-shirt bio confortable',
 4000, NULL, 0, 150, 'TEE-URB-001', TRUE, FALSE, FALSE),

-- Électronique
(1, 3, 'Écouteurs Sans Fil Pro', 'ecouteurs-sans-fil-pro',
 'Écouteurs Bluetooth avec réduction de bruit active. Autonomie 30h. Qualité audio premium.',
 'Écouteurs Bluetooth premium',
 18000, 25000, 28, 67, 'ELEC-TECH-001', TRUE, TRUE, FALSE),

-- Sport
(6, 4, 'Ensemble Sport Performance', 'ensemble-sport-performance',
 'Ensemble de sport haute performance, respirant et élastique. Parfait pour la course et le fitness.',
 'Tenue de sport respirante',
 12000, 15000, 20, 89, 'SPORT-MAX-001', TRUE, FALSE, TRUE),

-- Beauté
(7, 5, 'Coffret Soin du Visage', 'coffret-soin-visage',
 'Coffret complet de soins du visage : nettoyant, tonique, sérum et crème hydratante.',
 'Routine beauté complète',
 28000, NULL, 0, 34, 'BEAUTY-GLO-001', TRUE, TRUE, FALSE),

-- Maison
(5, NULL, 'Coussin Décoratif Bohème', 'coussin-decoratif-boheme',
 'Coussin décoratif style bohème avec housse en coton. Motifs géométriques.',
 'Coussin déco tendance',
 3500, 5000, 30, 120, 'HOME-DEC-001', TRUE, FALSE, FALSE),

-- Plus de produits...
(3, 1, 'Sneakers Running Elite', 'sneakers-running-elite',
 'Chaussures de running légères avec amorti réactif. Technologies avancées pour performances optimales.',
 'Running shoes pro',
 22000, 28000, 21, 56, 'SHOE-URB-002', TRUE, FALSE, TRUE),

(4, 2, 'Portefeuille Cuir Compact', 'portefeuille-cuir-compact',
 'Portefeuille compact en cuir véritable. Design minimaliste avec protection RFID.',
 'Portefeuille élégant RFID',
 8500, NULL, 0, 78, 'BAG-LUX-002', TRUE, FALSE, FALSE),

(2, 1, 'Veste Jean Vintage', 'veste-jean-vintage',
 'Veste en jean style vintage délavé. Coupe droite intemporelle.',
 'Veste jean tendance',
 16000, 20000, 20, 42, 'TEE-URB-002', TRUE, TRUE, FALSE);

-- ============================================
-- 6. PRODUCT IMAGES
-- ============================================
INSERT INTO product_images (product_id, image_url, alt_text, display_order, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'Baskets Urbaines - Vue principale', 0, TRUE),
(1, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800', 'Baskets Urbaines - Vue côté', 1, FALSE),
(1, 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800', 'Baskets Urbaines - Vue arrière', 2, FALSE),

(2, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800', 'Sac Cuir - Vue principale', 0, TRUE),
(2, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800', 'Sac Cuir - Vue détails', 1, FALSE),

(3, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'T-Shirt Bio - Vue principale', 0, TRUE),

(4, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800', 'Écouteurs Pro - Vue principale', 0, TRUE),
(4, 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800', 'Écouteurs Pro - Vue boîtier', 1, FALSE);

-- ============================================
-- 7. PRODUCT VARIANTS
-- ============================================
INSERT INTO product_variants (product_id, variant_type, variant_value, price_adjustment, stock_quantity) VALUES
-- Baskets - Tailles
(1, 'size', '39', 0, 8),
(1, 'size', '40', 0, 12),
(1, 'size', '41', 0, 10),
(1, 'size', '42', 0, 8),
(1, 'size', '43', 0, 5),
(1, 'size', '44', 0, 2),

-- Baskets - Couleurs
(1, 'color', 'Noir', 0, 20),
(1, 'color', 'Blanc', 0, 15),
(1, 'color', 'Gris', 0, 10),

-- T-Shirt - Tailles
(3, 'size', 'S', 0, 40),
(3, 'size', 'M', 0, 50),
(3, 'size', 'L', 0, 35),
(3, 'size', 'XL', 0, 25),

-- T-Shirt - Couleurs
(3, 'color', 'Blanc', 0, 60),
(3, 'color', 'Noir', 0, 50),
(3, 'color', 'Bleu', 0, 40);

-- ============================================
-- 8. PRODUCT FEATURES
-- ============================================
INSERT INTO product_features (product_id, feature_name, feature_value, display_order) VALUES
(1, 'Semelle', 'Amortissante', 0),
(1, 'Matériau', 'Respirant', 1),
(1, 'Poids', 'Léger (280g)', 2),
(1, 'Design', 'Moderne', 3),

(2, 'Matériau', 'Cuir véritable', 0),
(2, 'Compartiments', 'Multiple', 1),
(2, 'Fermeture', 'Éclair sécurisée', 2),
(2, 'Bandoulière', 'Ajustable', 3),

(4, 'Bluetooth', '5.0', 0),
(4, 'Autonomie', '30 heures', 1),
(4, 'Réduction bruit', 'Active', 2),
(4, 'Charge rapide', 'USB-C', 3);

-- ============================================
-- 9. TAGS
-- ============================================
INSERT INTO tags (name, slug) VALUES
('sport', 'sport'),
('casual', 'casual'),
('confort', 'confort'),
('luxe', 'luxe'),
('élégant', 'elegant'),
('cuir', 'cuir'),
('promo', 'promo'),
('nouveau', 'nouveau'),
('bio', 'bio');

-- ============================================
-- 10. PRODUCT TAGS (Associations)
-- ============================================
INSERT INTO product_tags (product_id, tag_id) VALUES
(1, 1), (1, 2), (1, 3),  -- Baskets: sport, casual, confort
(2, 4), (2, 5), (2, 6),  -- Sac: luxe, élégant, cuir
(3, 2), (3, 3), (3, 9),  -- T-Shirt: casual, confort, bio
(4, 7), (4, 8);          -- Écouteurs: promo, nouveau

-- ============================================
-- 11. PRODUCT REVIEWS
-- ============================================
INSERT INTO product_reviews (product_id, user_id, rating, title, comment, is_verified_purchase, is_approved, created_at) VALUES
(1, 2, 5, 'Excellent produit !', 'Très satisfaite de ma commande. La qualité est au rendez-vous et le confort est exceptionnel.', TRUE, TRUE, NOW() - INTERVAL '3 days'),
(1, 3, 4, 'Très bon rapport qualité-prix', 'Très bon produit. Livraison rapide. Je recommande !', TRUE, TRUE, NOW() - INTERVAL '5 days'),
(1, 4, 5, 'Conforme à mes attentes', 'Je suis ravie de cet achat. Exactement ce que je cherchais.', TRUE, TRUE, NOW() - INTERVAL '7 days'),

(2, 2, 5, 'Magnifique sac', 'Le cuir est de très bonne qualité. Très contente de mon achat.', TRUE, TRUE, NOW() - INTERVAL '2 days'),
(2, 3, 4, 'Beau produit', 'Joli sac, bien fini. Peut-être un peu cher mais la qualité est là.', TRUE, TRUE, NOW() - INTERVAL '4 days');

-- ============================================
-- 12. PROMO CODES
-- ============================================
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_purchase_amount, usage_limit, valid_from, valid_until, is_active) VALUES
('WELCOME10', 'Réduction de bienvenue 10%', 'percentage', 10, 5000, 1000, NOW(), NOW() + INTERVAL '30 days', TRUE),
('THANOUT20', 'Promotion spéciale 20%', 'percentage', 20, 10000, 500, NOW(), NOW() + INTERVAL '7 days', TRUE),
('SAVE5000', 'Réduction de 5000 DA', 'fixed', 5000, 20000, 200, NOW(), NOW() + INTERVAL '15 days', TRUE),
('FREESHIP', 'Livraison gratuite', 'shipping', 0, 15000, NULL, NOW(), NOW() + INTERVAL '60 days', TRUE);

-- ============================================
-- 13. ADMIN USERS
-- ============================================
INSERT INTO admin_users (user_id, role, is_active) VALUES
(1, 'super_admin', TRUE);

-- ============================================
-- 14. NEWSLETTER SUBSCRIBERS
-- ============================================
INSERT INTO newsletter_subscribers (email, is_subscribed) VALUES
('newsletter1@email.dz', TRUE),
('newsletter2@email.dz', TRUE),
('newsletter3@email.dz', FALSE);

-- ============================================
-- Message de confirmation
-- ============================================
DO $$ 
BEGIN 
    RAISE NOTICE 'Données de seed insérées avec succès!';
    RAISE NOTICE 'Utilisateurs: 5 | Produits: 10 | Catégories: 7';
END $$;
