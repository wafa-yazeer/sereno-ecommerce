export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Sereno Horology E-Commerce RESTful API',
    version: '1.0.0',
    description: `
**HDSE 26.2FT Enterprise Application Development 02 - Coursework 01**
National Institute of Business Management (NIBM)

This RESTful API implements enterprise-grade e-commerce operations for the Sereno luxury watch brand, built according to 3-Tier Enterprise Architecture, stateless REST principles, Spring Boot conventions, and resource-oriented URI design.

### Key Resources:
1. **/api/products**: Full CRUD operations for watch catalog, specifications, inventory, and filtering.
2. **/api/categories**: Full CRUD for watch collections and taxonomy.
3. **/api/orders**: Full CRUD for customer orders, checkout processing, tax & discount calculation, status tracking.
4. **/api/reviews**: Full CRUD for customer feedback and ratings moderation.
5. **/api/coupons**: Validation of promotional codes and enterprise business rule checks.
    `,
    contact: {
      name: 'EAD 02 Academic Project Team',
      email: 'fahadhwafa@gmail.com',
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Primary Enterprise REST Server (/api)',
    },
  ],
  tags: [
    { name: 'Products', description: 'Product catalog & inventory CRUD operations' },
    { name: 'Categories', description: 'Collection categories CRUD management' },
    { name: 'Orders', description: 'Order processing, checkout, and lifecycle management' },
    { name: 'Reviews', description: 'Customer reviews and ratings' },
    { name: 'System & Health', description: 'Enterprise monitoring & test harness endpoints' },
  ],
  paths: {
    '/products': {
      get: {
        tags: ['Products'],
        summary: 'List products with filters & sorting',
        description: 'Retrieve a list of watches with optional query filters (category, search, price range, sorting).',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category ID or slug' },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Keyword search across name, SKU, movement, description' },
          { name: 'minPrice', in: 'query', schema: { type: 'number' }, description: 'Minimum price filter' },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' }, description: 'Maximum price filter' },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['price_asc', 'price_desc', 'rating', 'newest'] }, description: 'Sort criteria' },
          { name: 'featured', in: 'query', schema: { type: 'boolean' }, description: 'Filter featured showcase items' },
        ],
        responses: {
          200: {
            description: 'Successful retrieval of products list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    count: { type: 'integer', example: 8 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Product' },
                    },
                    timestamp: { type: 'string', example: '2026-03-16T12:00:00Z' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product',
        description: 'Add a new watch to the catalog. Validates required fields: name, price, categoryId, and stock.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProductInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Product created successfully' },
                    data: { $ref: '#/components/schemas/Product' },
                    timestamp: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation failed - Missing required attributes',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get product by ID or SKU',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Product details returned',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Product not found',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
            },
          },
        },
      },
      put: {
        tags: ['Products'],
        summary: 'Update an existing product',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProductInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Product updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Product updated successfully' },
                    data: { $ref: '#/components/schemas/Product' },
                  },
                },
              },
            },
          },
          404: { description: 'Product not found' },
        },
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete a product',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Product deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Product deleted successfully' },
                  },
                },
              },
            },
          },
          404: { description: 'Product not found' },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'List all categories with live item counts',
        responses: {
          200: {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Category' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Categories'],
        summary: 'Create a new category',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Tourbillon' },
                  description: { type: 'string', example: 'High complication anti-gravity tourbillon escapes' },
                  imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Category created' },
          400: { description: 'Category name is required' },
        },
      },
    },
    '/categories/{id}': {
      get: {
        tags: ['Categories'],
        summary: 'Get single category',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Category found' },
          404: { description: 'Category not found' },
        },
      },
      put: {
        tags: ['Categories'],
        summary: 'Update category',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        responses: {
          200: { description: 'Category updated' },
          404: { description: 'Category not found' },
        },
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete category',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Category deleted' },
          404: { description: 'Category not found' },
        },
      },
    },
    '/orders': {
      get: {
        tags: ['Orders'],
        summary: 'List orders',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] } },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search order number, customer, email' },
        ],
        responses: {
          200: {
            description: 'List of customer orders',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Order' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Orders'],
        summary: 'Place a new customer order (Checkout)',
        description: 'Validates inventory stock, applies taxes (8%) and optional coupons, decrements stock, and assigns tracking ID.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOrderInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Order successfully created and queued for fulfillment',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Order placed successfully' },
                    data: { $ref: '#/components/schemas/Order' },
                  },
                },
              },
            },
          },
          400: { description: 'Validation failed or insufficient stock' },
        },
      },
    },
    '/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Get order details by ID or Order Number',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Order details' },
          404: { description: 'Order not found' },
        },
      },
      delete: {
        tags: ['Orders'],
        summary: 'Delete or archive an order',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Order deleted' },
          404: { description: 'Order not found' },
        },
      },
    },
    '/orders/{id}/status': {
      put: {
        tags: ['Orders'],
        summary: 'Update order lifecycle status',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: {
                    type: 'string',
                    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
                    example: 'Shipped',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Status updated successfully' },
          400: { description: 'Invalid status value' },
          404: { description: 'Order not found' },
        },
      },
    },
    '/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'List reviews',
        parameters: [{ name: 'productId', in: 'query', schema: { type: 'string' } }],
        responses: {
          200: { description: 'List of reviews' },
        },
      },
      post: {
        tags: ['Reviews'],
        summary: 'Submit customer review',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productId', 'customerName', 'rating', 'title', 'comment'],
                properties: {
                  productId: { type: 'string', example: 'prod-aurix-chrono' },
                  customerName: { type: 'string', example: 'Alexander H.' },
                  rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
                  title: { type: 'string', example: 'Absolute Masterpiece' },
                  comment: { type: 'string', example: 'Incredible dial finishing and weight on the wrist.' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Review posted and product rating recalculated' },
          400: { description: 'Validation failed' },
        },
      },
    },
    '/reviews/{id}': {
      delete: {
        tags: ['Reviews'],
        summary: 'Delete customer review',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Review deleted' },
          404: { description: 'Review not found' },
        },
      },
    },
    '/coupons/validate': {
      post: {
        tags: ['Orders'],
        summary: 'Validate discount coupon voucher',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['code', 'subtotal'],
                properties: {
                  code: { type: 'string', example: 'EAD2026' },
                  subtotal: { type: 'number', example: 350 },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Validation result' },
        },
      },
    },
    '/health': {
      get: {
        tags: ['System & Health'],
        summary: 'System health & enterprise metrics',
        responses: {
          200: { description: 'System UP and operational' },
        },
      },
    },
  },
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'prod-aurix-chrono' },
          name: { type: 'string', example: 'AURIX Chrono AX-C120' },
          sku: { type: 'string', example: 'SER-AX120-BLU' },
          categoryId: { type: 'string', example: 'cat-chronograph' },
          categoryName: { type: 'string', example: 'Chronographs' },
          price: { type: 'number', example: 249 },
          originalPrice: { type: 'number', example: 499 },
          stock: { type: 'integer', example: 24 },
          description: { type: 'string' },
          dialColor: { type: 'string', example: 'Midnight Navy Blue' },
          caseSize: { type: 'string', example: '42 MM' },
          movement: { type: 'string', example: 'Mecha-Quartz Hybrid Calibre VK64' },
          glass: { type: 'string', example: 'Double-Domed Sapphire Crystal' },
          waterResistance: { type: 'string', example: '10 ATM (100m)' },
          strap: { type: 'string', example: 'High-Density Ballistic Woven Nylon' },
          rating: { type: 'number', example: 4.9 },
          reviewCount: { type: 'integer', example: 342 },
          imageUrl: { type: 'string' },
          badge: { type: 'string', example: '50% OFF' },
          featured: { type: 'boolean', example: true },
          createdAt: { type: 'string' },
        },
      },
      CreateProductInput: {
        type: 'object',
        required: ['name', 'price', 'categoryId', 'stock'],
        properties: {
          name: { type: 'string', example: 'CHRONO ROYALE 44' },
          sku: { type: 'string', example: 'SER-CR44-BLK' },
          categoryId: { type: 'string', example: 'cat-chronograph' },
          price: { type: 'number', example: 320 },
          originalPrice: { type: 'number', example: 450 },
          stock: { type: 'integer', example: 15 },
          description: { type: 'string', example: 'Ceramic bezel tactical sports chronograph.' },
          dialColor: { type: 'string', example: 'Obsidian Black' },
          caseSize: { type: 'string', example: '44 MM' },
          movement: { type: 'string', example: 'Automatic Chrono Calibre 7750' },
          glass: { type: 'string', example: 'Sapphire Crystal' },
          waterResistance: { type: 'string', example: '20 ATM (200m)' },
          strap: { type: 'string', example: 'FKM Vulcanized Rubber' },
          imageUrl: { type: 'string', example: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800' },
          badge: { type: 'string', example: 'New Arrival' },
          featured: { type: 'boolean', example: true },
        },
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cat-chronograph' },
          name: { type: 'string', example: 'Chronographs' },
          slug: { type: 'string', example: 'chronographs' },
          description: { type: 'string' },
          imageUrl: { type: 'string' },
          itemCount: { type: 'integer', example: 3 },
        },
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'ord-1001' },
          orderNumber: { type: 'string', example: 'SRN-2026-9042' },
          customerName: { type: 'string', example: 'Alexander Hayes' },
          customerEmail: { type: 'string', example: 'a.hayes@enterprise.io' },
          customerPhone: { type: 'string', example: '+1 555 234 5678' },
          shippingAddress: { type: 'string', example: '742 Evergreen Terrace' },
          city: { type: 'string', example: 'San Francisco' },
          postalCode: { type: 'string', example: '94107' },
          country: { type: 'string', example: 'United States' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                productId: { type: 'string' },
                productName: { type: 'string' },
                price: { type: 'number' },
                quantity: { type: 'integer' },
              },
            },
          },
          subtotal: { type: 'number', example: 448 },
          discount: { type: 'number', example: 44.8 },
          tax: { type: 'number', example: 32.25 },
          shippingFee: { type: 'number', example: 0 },
          total: { type: 'number', example: 435.45 },
          status: { type: 'string', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
          paymentMethod: { type: 'string', example: 'Credit / Debit Card' },
          trackingNumber: { type: 'string', example: 'FEDEX-SRN-9941829' },
          createdAt: { type: 'string' },
        },
      },
      CreateOrderInput: {
        type: 'object',
        required: ['customerName', 'customerEmail', 'customerPhone', 'shippingAddress', 'city', 'postalCode', 'items', 'paymentMethod'],
        properties: {
          customerName: { type: 'string', example: 'Jonathan Davis' },
          customerEmail: { type: 'string', example: 'jdavis@sample.com' },
          customerPhone: { type: 'string', example: '+1 415 555 0192' },
          shippingAddress: { type: 'string', example: '500 Howard Street, Suite 1200' },
          city: { type: 'string', example: 'San Francisco' },
          postalCode: { type: 'string', example: '94105' },
          country: { type: 'string', example: 'United States' },
          couponCode: { type: 'string', example: 'EAD2026' },
          paymentMethod: { type: 'string', enum: ['Credit / Debit Card', 'Cash on Delivery (COD)', 'Bank Transfer'] },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['productId', 'quantity'],
              properties: {
                productId: { type: 'string', example: 'prod-aurix-chrono' },
                quantity: { type: 'integer', example: 1 },
              },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Resource validation failed' },
          errors: {
            type: 'array',
            items: { type: 'string' },
            example: ['Price must be greater than 0', 'Stock cannot be negative'],
          },
          timestamp: { type: 'string' },
        },
      },
    },
  },
};
