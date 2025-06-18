-- Insert categories
INSERT INTO categories (name, description, icon, product_count) VALUES
('RFID Cards', 'Access control and identification solutions', 'Shield', 15),
('NFC Cards', 'Smart cards for modern connectivity', 'Zap', 12),
('3D Models', 'Custom printed objects and prototypes', 'Printer', 25);

-- Insert sample products
INSERT INTO products (name, description, price, original_price, category, image_url, badge, rating, review_count, in_stock, stock_quantity) VALUES
('RFID Access Card - 125kHz', 'High-quality 125kHz RFID card for access control systems. Compatible with most standard readers and perfect for office buildings, hotels, and residential complexes.', 12.99, 15.99, 'RFID Cards', '/placeholder.svg?height=300&width=300', 'Best Seller', 4.8, 124, true, 150),
('NFC Business Card Set (10 pack)', 'Professional NFC business cards with custom programming. Share your contact information instantly with a simple tap. Includes 10 cards and programming service.', 24.99, null, 'NFC Cards', '/placeholder.svg?height=300&width=300', 'New', 4.9, 89, true, 75),
('3D Printed Phone Stand', 'Ergonomic phone stand with adjustable viewing angles. Made from durable PLA plastic with anti-slip base. Perfect for video calls and media consumption.', 18.50, null, '3D Models', '/placeholder.svg?height=300&width=300', 'Popular', 4.7, 156, true, 200),
('Programmable RFID Key Fob', 'Durable RFID key fob with 13.56MHz frequency. Waterproof design with keychain attachment. Ideal for access control and identification systems.', 8.99, null, 'RFID Cards', '/placeholder.svg?height=300&width=300', '', 4.6, 203, true, 300),
('NFC Smart Ring', 'Wearable NFC ring for contactless payments and access. Stylish titanium design with embedded NFC chip. Compatible with most NFC-enabled devices.', 34.99, null, 'NFC Cards', '/placeholder.svg?height=300&width=300', '', 4.5, 67, false, 0),
('Custom 3D Miniature Figure', 'Personalized 3D printed miniature figure from your photo. High-detail printing with multiple color options. Perfect gift or collectible item.', 45.00, null, '3D Models', '/placeholder.svg?height=300&width=300', 'Custom', 4.9, 34, true, 50),
('RFID Card Reader Module', 'Arduino-compatible RFID reader module with USB interface. Supports multiple card types and frequencies. Includes sample cards and documentation.', 29.99, 34.99, 'RFID Cards', '/placeholder.svg?height=300&width=300', '', 4.4, 78, true, 85),
('NFC Stickers Pack (50 pcs)', 'High-quality NFC stickers for automation and smart home applications. Waterproof design with strong adhesive. Compatible with all NFC-enabled devices.', 19.99, null, 'NFC Cards', '/placeholder.svg?height=300&width=300', '', 4.6, 145, true, 120),
('3D Printed Desk Organizer', 'Multi-compartment desk organizer with modern design. Perfect for pens, cables, and small office supplies. Available in multiple colors.', 22.50, null, '3D Models', '/placeholder.svg?height=300&width=300', '', 4.3, 92, true, 180),
('RFID Blocking Wallet', 'Premium leather wallet with RFID blocking technology. Protects your cards from unauthorized scanning while maintaining style and functionality.', 39.99, 49.99, 'RFID Cards', '/placeholder.svg?height=300&width=300', 'Sale', 4.7, 167, true, 95);
