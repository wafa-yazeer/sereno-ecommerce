package com.sereno.ecommerce.config;

import com.sereno.ecommerce.model.Category;
import com.sereno.ecommerce.model.Order;
import com.sereno.ecommerce.model.OrderItem;
import com.sereno.ecommerce.model.Product;
import com.sereno.ecommerce.model.Review;
import com.sereno.ecommerce.repository.CategoryRepository;
import com.sereno.ecommerce.repository.OrderRepository;
import com.sereno.ecommerce.repository.ProductRepository;
import com.sereno.ecommerce.repository.ReviewRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;

    public DataInitializer(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            OrderRepository orderRepository,
            ReviewRepository reviewRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() > 0) {
            return;
        }

        // 1. Seed Categories
        Category chrono = new Category(
                "cat-chronograph",
                "Chronograph",
                "Precision dual-register stopwatch complications with mechanical flyback sweep.",
                "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800"
        );
        Category automatic = new Category(
                "cat-automatic",
                "Automatic",
                "Self-winding calibres with weighted rotor harvesting kinetic wrist motion.",
                "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800"
        );
        Category diver = new Category(
                "cat-diver",
                "Diving & Professional",
                "Helium release valves, 300M water resistance, and high-contrast lume markers.",
                "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"
        );
        Category dress = new Category(
                "cat-dress",
                "Heritage Dress",
                "Ultra-thin architectural silhouettes paired with genuine Italian calfskin leather.",
                "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800"
        );
        Category aviation = new Category(
                "cat-aviation",
                "Aeronautical GMT",
                "Independent 24-hour second timezone complication with bi-directional ceramic bezel.",
                "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800"
        );

        categoryRepository.save(chrono);
        categoryRepository.save(automatic);
        categoryRepository.save(diver);
        categoryRepository.save(dress);
        categoryRepository.save(aviation);

        // 2. Seed Products
        Product p1 = new Product();
        p1.setId("prod-aurix-chrono");
        p1.setName("Sereno Chrono Classic Ivory");
        p1.setSku("SER-CHR-01");
        p1.setCategory(chrono);
        p1.setPrice(220.0);
        p1.setOriginalPrice(295.0);
        p1.setStock(18);
        p1.setRating(4.9);
        p1.setReviewCount(48);
        p1.setDescription("Hand-finished two-register chronograph inspired by vintage 1960s dashboard timers. Features instant mechanical flyback reset and sunburst ivory dial.");
        p1.setDialColor("Ivory Cream & Midnight Blue");
        p1.setCaseSize("40 MM");
        p1.setMovement("Seiko VK64 Meca-Quartz Hybrid");
        p1.setGlass("Double-Domed Sapphire Crystal with AR Coating");
        p1.setWaterResistance("10 ATM (100 meters / 330 ft)");
        p1.setStrap("Handcrafted Vegetable-Tanned Italian Leather");
        p1.setImageUrl("https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800");
        p1.setBadge("Best Seller");
        p1.setFeatured(true);
        productRepository.save(p1);

        Product p2 = new Product();
        p2.setId("prod-vanguard-auto");
        p2.setName("Vanguard Automatic Noir");
        p2.setSku("SER-AUT-02");
        p2.setCategory(automatic);
        p2.setPrice(340.0);
        p2.setOriginalPrice(420.0);
        p2.setStock(12);
        p2.setRating(5.0);
        p2.setReviewCount(64);
        p2.setDescription("Architectural sports timepiece with integrated H-link bracelet, matte carbon dial, and exhibition sapphire caseback showcasing the decorated rotor.");
        p2.setDialColor("Matte Onyx Black");
        p2.setCaseSize("41 MM");
        p2.setMovement("Miyota 9015 Hi-Beat Automatic (28,800 vph)");
        p2.setGlass("Scratch-Resistant Box Sapphire");
        p2.setWaterResistance("15 ATM (150 meters / 500 ft)");
        p2.setStrap("Solid 316L Stainless Steel Integrated H-Link");
        p2.setImageUrl("https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800");
        p2.setBadge("Staff Pick");
        p2.setFeatured(true);
        productRepository.save(p2);

        Product p3 = new Product();
        p3.setId("prod-abyss-diver");
        p3.setName("Abyss Submariner 300M");
        p3.setSku("SER-DIV-03");
        p3.setCategory(diver);
        p3.setPrice(410.0);
        p3.setOriginalPrice(490.0);
        p3.setStock(8);
        p3.setRating(4.8);
        p3.setReviewCount(32);
        p3.setDescription("Purpose-built maritime diver rated to 300 meters. Features 120-click unidirectional ceramic bezel and Swiss Super-LumiNova BGW9 application.");
        p3.setDialColor("Oceanic Deep Teal");
        p3.setCaseSize("42 MM");
        p3.setMovement("Seiko NH35 Automatic Mechanical (41h reserve)");
        p3.setGlass("Triple-Coated AR Flat Sapphire (3.5mm thick)");
        p3.setWaterResistance("30 ATM (300 meters / 1000 ft)");
        p3.setStrap("Vulcanized FKM Fluoroelastomer Rubber");
        p3.setImageUrl("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800");
        p3.setBadge("Limited Edition");
        p3.setFeatured(true);
        productRepository.save(p3);

        Product p4 = new Product();
        p4.setId("prod-geneve-dress");
        p4.setName("Geneva Heritage Ultra-Slim");
        p4.setSku("SER-DRS-04");
        p4.setCategory(dress);
        p4.setPrice(280.0);
        p4.setOriginalPrice(350.0);
        p4.setStock(24);
        p4.setRating(4.7);
        p4.setReviewCount(29);
        p4.setDescription("Timeless minimalist dress piece measuring only 7.2mm thick. Clean indices, blued leaf hands, and small seconds complication at 6 o'clock.");
        p4.setDialColor("Sunburst Opaline Silver");
        p4.setCaseSize("38 MM");
        p4.setMovement("Calibre S-10 Manual Hand-Wound (42h reserve)");
        p4.setGlass("High-Dome Sapphire Crystal");
        p4.setWaterResistance("5 ATM (50 meters / 165 ft)");
        p4.setStrap("French Baranil Leather in Chestnut Brown");
        p4.setImageUrl("https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800");
        p4.setBadge("Heritage");
        p4.setFeatured(false);
        productRepository.save(p4);

        // 3. Seed Sample Order
        Order order = new Order();
        order.setId("ord-sample-01");
        order.setOrderNumber("SRN-89241");
        order.setCreatedAt(LocalDateTime.now().minusDays(2));
        order.setCustomerName("Jean-Luc Moreau");
        order.setCustomerEmail("jl.moreau@geneve-horlogerie.ch");
        order.setCustomerPhone("+41 22 798 1200");
        order.setShippingAddress("Rue du Rhône 14, 1st Floor");
        order.setCity("Genève");
        order.setPostalCode("1204");
        order.setCountry("Switzerland");
        order.setPaymentMethod("Credit / Debit Card");
        order.setNotes("Complimentary gift wrapping requested");
        order.setSubtotal(560.0);
        order.setDiscount(56.0);
        order.setTax(40.32);
        order.setShipping(0.0);
        order.setTotal(544.32);
        order.setStatus("Shipped");

        OrderItem item1 = new OrderItem(p1.getId(), p1.getName(), p1.getPrice(), 1, p1.getImageUrl());
        OrderItem item2 = new OrderItem(p2.getId(), p2.getName(), p2.getPrice(), 1, p2.getImageUrl());
        order.addItem(item1);
        order.addItem(item2);

        orderRepository.save(order);

        // 4. Seed Reviews
        Review r1 = new Review(
                "rev-01",
                p1.getId(),
                "Marcus Sterling",
                5,
                "Exquisite finishing exceeding luxury timepieces thrice the price",
                "The meca-quartz movement gives the snappy chronograph action of a high-end column wheel, while maintaining dead-on accuracy. The sapphire crystal has virtually zero reflections.",
                true
        );
        Review r2 = new Review(
                "rev-02",
                p2.getId(),
                "Claire Delacroix",
                5,
                "Incredible wrist presence and chronometric stability",
                "I wear this daily to the financial district. The bracelet articulation is silky smooth and the hi-beat second hand glides effortlessly. Top marks to the Sereno atelier.",
                true
        );

        reviewRepository.save(r1);
        reviewRepository.save(r2);

        System.out.println(">>> SEEDED SERENO H2 DATABASE: 5 Categories, 4 Initial Products, 1 Order, 2 Reviews");
    }
}
