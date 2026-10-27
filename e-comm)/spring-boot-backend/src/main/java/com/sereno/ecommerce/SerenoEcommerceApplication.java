package com.sereno.ecommerce;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SERENO Luxury E-Commerce RESTful Web Service
 * 
 * Enterprise 3-Tier Architecture:
 * - Presentation Layer: React 19 Frontend + Swagger UI
 * - Business Logic Layer: Spring @Service & @RestController
 * - Data Access Layer: Spring Data JPA + Hibernate + H2 Database
 */
@SpringBootApplication
public class SerenoEcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(SerenoEcommerceApplication.class, args);
        System.out.println("==================================================================");
        System.out.println("  SERENO GENÈVE RESTful API STARTED SUCCESSFULLY ON PORT 8080");
        System.out.println("  Swagger OpenAPI Docs: http://localhost:8080/swagger-ui/index.html");
        System.out.println("  H2 In-Memory Console: http://localhost:8080/h2-console");
        System.out.println("==================================================================");
    }
}
