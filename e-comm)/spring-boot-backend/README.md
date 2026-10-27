# SERENO Genève • Java Spring Boot RESTful API

An enterprise 3-tier RESTful Web Service developed with **Java 17+ and Spring Boot 3**, designed for the **SERENO Luxury Timepieces E-Commerce** business process. Fully implements CRUD operations across multiple resources, JSR-380 input validation, relational database modeling with Spring Data JPA, automated JUnit 5 testing, and interactive OpenAPI 3.0 (Swagger) documentation.

---

## 1. Chosen Business Process & Resource Definition

### Business Process: E-Commerce (Luxury Horology Atelier)
The system facilitates the end-to-end sales lifecycle of handcrafted luxury watches, including catalog browsing, category classification, cart checkout, stock decrementing, live shipment tracking, and customer review verification.

### Core Resources Defined (Meets & Exceeds 3-Resource Requirement):
1. **Products (`/api/products`)**: Timepieces with technical attributes (calibre, case size, sapphire glass, water resistance, stock, price, SKU).
2. **Categories (`/api/categories`)**: Horological classifications (Chronograph, Automatic, Diving 300M, Heritage Dress).
3. **Orders (`/api/orders`)**: Customer orders with line items, address, status lifecycle (`Processing` → `Shipped` → `Delivered`), and stock deduction.
4. **OrderItems (`order_items`)**: Relational line items linked to orders and products.
5. **Reviews (`/api/reviews`)**: Verified client ratings and feedback with automatic average rating re-calculation.

---

## 2. Enterprise 3-Tier Architecture

```
+-------------------------------------------------------------------------+
|                        PRESENTATION LAYER                               |
|   React 19 Frontend (Vite)  <--->  Springdoc OpenAPI 3.0 / Swagger UI    |
+-------------------------------------------------------------------------+
                                    | HTTP / JSON (Stateless REST)
+-------------------------------------------------------------------------+
|                       BUSINESS LOGIC LAYER                              |
|   Controllers: ProductController, OrderController, CategoryController   |
|   Services:    ProductService,    OrderService,    CategoryService      |
|   Validation:  Hibernate Validator (JSR-380: @NotBlank, @Min, @Valid)  |
|   Exceptions:  @RestControllerAdvice (GlobalExceptionHandler)           |
+-------------------------------------------------------------------------+
                                    | JPA / Hibernate ORM
+-------------------------------------------------------------------------+
|                        DATA ACCESS LAYER                                |
|   Repositories: JpaRepository interfaces with JPQL queries             |
|   Database:     H2 In-Memory Database (Embedded zero-config)             |
|                 (Plug-and-play with PostgreSQL / MySQL via profile)     |
+-------------------------------------------------------------------------+
```

---

## 3. Adherence to REST Constraints & Best Practices

| REST Constraint | How Implemented in this Spring Boot Service |
| :--- | :--- |
| **Client-Server** | Separation between React client and Spring Boot server communicating purely via standard HTTP/JSON. |
| **Stateless** | No server-side session state stored; each request contains all necessary data. |
| **Uniform Interface** | Standard HTTP verbs (`GET`, `POST`, `PUT`, `DELETE`, `PATCH`), resource URIs (`/api/products`), and JSON envelopes (`ApiResponse<T>`). |
| **Layered System** | Clean decoupling: Controllers → Services → Repositories → Database. |
| **Standard Status Codes** | `200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Error`. |

---

## 4. Endpoints & CRUD Operations Matrix

### Products Resource (`/api/products`)
- `GET /api/products` — Retrieve all watches (supports `?category=`, `?search=`, `?maxPrice=`, `?sort=`).
- `GET /api/products/{id}` — Retrieve single watch details.
- `GET /api/products/sku/{sku}` — Lookup watch by SKU.
- `POST /api/products` — Add a new watch (**Create**). Validates body via `@Valid`.
- `PUT /api/products/{id}` — Update watch specifications (**Update**).
- `DELETE /api/products/{id}` — Remove a watch from catalog (**Delete**).

### Categories Resource (`/api/categories`)
- `GET /api/categories` — List all categories (**Read**).
- `GET /api/categories/{id}` — Get single category details (**Read**).
- `POST /api/categories` — Create category (**Create**).
- `PUT /api/categories/{id}` — Update category (**Update**).
- `DELETE /api/categories/{id}` — Delete category (**Delete**).

### Orders Resource (`/api/orders`)
- `GET /api/orders` — List all orders sorted by creation date (**Read**).
- `GET /api/orders/{id}` — Get order details by ID (**Read**).
- `GET /api/orders/track/{orderNumber}` — Track shipment status by tracking code (e.g. `SRN-89241`).
- `POST /api/orders` — Place order (**Create**). Atomically verifies & decrements stock.
- `PATCH /api/orders/{id}/status` — Update fulfillment status (**Update**).
- `DELETE /api/orders/{id}` — Cancel order & restore inventory (**Delete**).

### Reviews Resource (`/api/reviews`)
- `GET /api/reviews?productId={id}` — List customer reviews (**Read**).
- `POST /api/reviews` — Submit verified customer review (**Create**).
- `DELETE /api/reviews/{id}` — Delete review (**Delete**).

---

## 5. Quick Start: How to Run the Backend

### Prerequisites:
- Java JDK 17 or higher (`java -version`)
- Apache Maven 3.8+ (`mvn -version`) or IntelliJ IDEA / Eclipse

### Step 1: Open the Project
Open the `spring-boot-backend` folder in **IntelliJ IDEA**, **Eclipse**, or **VS Code** as an existing Maven project.

### Step 2: Run via Maven CLI
```bash
cd spring-boot-backend
mvn spring-boot:run
```

### Step 3: Access Live Services
- **Spring Boot API Base**: `http://localhost:8080`
- **Interactive Swagger UI Documentation**: `http://localhost:8080/swagger-ui/index.html`
- **OpenAPI 3.0 Raw JSON Spec**: `http://localhost:8080/v3/api-docs`
- **H2 In-Memory Database Web Console**: `http://localhost:8080/h2-console`
  - JDBC URL: `jdbc:h2:mem:serenodb`
  - User: `sa`
  - Password: *(leave blank)*

---

## 6. Testing the API

### A. Automated Unit & Integration Tests (JUnit 5 & Mockito)
Run the automated test suite with Maven:
```bash
mvn test
```
- `ProductControllerTest.java`: Uses `MockMvc` to verify HTTP `GET`, `POST`, `PUT`, `DELETE`, request JSON serialization, response status codes (`200`, `201`), and 400 Bad Request on validation errors.
- `ProductServiceTest.java`: Uses `Mockito` to test business rules, SKU conflict detection, stock decrements, and `ResourceNotFoundException`.
- `SerenoEcommerceApplicationTests.java`: Validates Spring ApplicationContext dependency injection.

### B. Manual Testing via Postman
Import the included `Sereno_ECommerce_Postman_Collection.json` into Postman:
1. Open Postman.
2. Click **Import** > Select `spring-boot-backend/Sereno_ECommerce_Postman_Collection.json`.
3. Pre-configured requests for all CRUD endpoints are ready to execute against `http://localhost:8080`.

---

## 7. Viva / Examination Preparation Guide

### Q1: What is a RESTful API and what are the main HTTP methods used?
> **Answer:** A RESTful API is an architectural style based on representational state transfer over HTTP. It uses standard HTTP verbs mapped to CRUD operations:
> - `GET`: Read/retrieve resources (safe and idempotent).
> - `POST`: Create a new resource (neither safe nor idempotent).
> - `PUT`: Replace or update an entire existing resource (idempotent).
> - `PATCH`: Partially update resource attributes.
> - `DELETE`: Remove a resource (idempotent).

### Q2: How does your Spring Boot application handle input validation and error responses?
> **Answer:** We use the Jakarta Bean Validation API (JSR-380) with annotations such as `@NotBlank`, `@Min`, `@DecimalMin`, and `@Email` on our Entity/DTO models, triggered by `@Valid` in Controller method signatures. When validation fails, a `MethodArgumentNotValidException` is caught by our centralized `@RestControllerAdvice` class (`GlobalExceptionHandler`), which intercepts the error and returns a clean, structured JSON response with HTTP status `400 Bad Request` listing all field-specific violation messages.

### Q3: How do you maintain database consistency when placing an order?
> **Answer:** In `OrderServiceImpl.java`, the `placeOrder()` method is annotated with `@Transactional`. When a customer orders timepieces, the service verifies inventory stock for each line item. If any product has insufficient stock, an `IllegalArgumentException` is thrown, triggering an automatic transaction rollback so no partial orders are written and stock counts remain consistent.

### Q4: How is Swagger / OpenAPI integrated into Spring Boot 3?
> **Answer:** We integrated `springdoc-openapi-starter-webmvc-ui` version 2.3.0. In our controllers, we annotate resources with `@Tag`, endpoints with `@Operation`, and response codes with `@ApiResponse`. Springdoc dynamically parses these annotations and endpoints during boot-up to generate the live OpenAPI 3.0 specification at `/v3/api-docs` and renders an interactive web GUI at `/swagger-ui/index.html`.

### Q5: What is the role of Spring Data JPA and Hibernate?
> **Answer:** Spring Data JPA abstracts database communication through repository interfaces (e.g. `ProductRepository extends JpaRepository<Product, String>`). Hibernate acts as the underlying Object-Relational Mapping (ORM) provider, mapping Java model classes (`@Entity`, `@Table`) to relational database tables without needing manual SQL boilerplate.
