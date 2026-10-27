import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/store';
import { openApiSpec } from './server/swagger';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body parsing
  app.use(express.json());

  // Logging & Enterprise telemetry middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[REST API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // CORS headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Helper response wrapper
  const sendSuccess = (res: Response, data: any, message?: string, statusCode = 200, extra?: any) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      count: Array.isArray(data) ? data.length : undefined,
      timestamp: new Date().toISOString(),
      ...extra,
    });
  };

  const sendError = (res: Response, message: string, statusCode = 400, errors?: string[]) => {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors || [message],
      timestamp: new Date().toISOString(),
    });
  };

  // ==========================================
  // SWAGGER & OPENAPI SPECIFICATION
  // ==========================================
  app.get('/api/docs/openapi.json', (req: Request, res: Response) => {
    res.json(openApiSpec);
  });

  // ==========================================
  // ENTERPRISE HEALTH & METRICS
  // ==========================================
  app.get('/api/health', (req: Request, res: Response) => {
    const stats = db.getSummaryStats();
    res.json({
      status: 'UP',
      uptimeSeconds: db.getUptimeSeconds(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      service: 'SERENO Genève E-Commerce Platform',
      database: {
        engine: 'Transactional Catalog & Orders Engine',
        ...stats,
        connected: true,
      },
    });
  });

  // Reset demo data
  app.post('/api/seed/reset', (req: Request, res: Response) => {
    db.reset();
    return sendSuccess(res, db.getSummaryStats(), 'Store database reset to original demo seed state');
  });

  // ==========================================
  // 1. PRODUCTS RESOURCE (CRUD)
  // ==========================================
  // GET /api/products
  app.get('/api/products', (req: Request, res: Response) => {
    try {
      const { category, search, minPrice, maxPrice, sort, featured } = req.query;
      const products = db.getProducts({
        category: category as string,
        search: search as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sort: sort as string,
        featured: featured !== undefined ? featured === 'true' : undefined,
      });

      return sendSuccess(res, products);
    } catch (err: any) {
      return sendError(res, 'Failed to fetch products', 500, [err.message]);
    }
  });

  // GET /api/products/:id
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return sendError(res, `Product with ID '${req.params.id}' was not found.`, 404);
    }
    return sendSuccess(res, product);
  });

  // POST /api/products (CREATE)
  app.post('/api/products', (req: Request, res: Response) => {
    try {
      const { name, price, categoryId, stock } = req.body;
      const errors: string[] = [];

      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        errors.push('Product name is required (minimum 2 characters).');
      }
      if (price === undefined || isNaN(Number(price)) || Number(price) <= 0) {
        errors.push('Product price must be a valid number greater than 0.');
      }
      if (stock === undefined || isNaN(Number(stock)) || Number(stock) < 0) {
        errors.push('Product stock must be a non-negative integer.');
      }

      if (errors.length > 0) {
        return sendError(res, 'Validation error creating product', 400, errors);
      }

      const created = db.createProduct(req.body);
      return sendSuccess(res, created, 'Product created successfully', 201);
    } catch (err: any) {
      return sendError(res, 'Failed to create product', 500, [err.message]);
    }
  });

  // PUT /api/products/:id (UPDATE)
  app.put('/api/products/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const existing = db.getProductById(id);
      if (!existing) {
        return sendError(res, `Cannot update: Product '${id}' not found.`, 404);
      }

      const { price, stock } = req.body;
      const errors: string[] = [];

      if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
        errors.push('Price must be a positive number.');
      }
      if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
        errors.push('Stock cannot be negative.');
      }

      if (errors.length > 0) {
        return sendError(res, 'Validation error updating product', 400, errors);
      }

      const updated = db.updateProduct(id, req.body);
      return sendSuccess(res, updated, `Product '${id}' updated successfully`);
    } catch (err: any) {
      return sendError(res, 'Failed to update product', 500, [err.message]);
    }
  });

  // DELETE /api/products/:id (DELETE)
  app.delete('/api/products/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const existing = db.getProductById(id);
      if (!existing) {
        return sendError(res, `Cannot delete: Product '${id}' not found.`, 404);
      }

      const deleted = db.deleteProduct(id);
      if (!deleted) {
        return sendError(res, 'Failed to delete product', 500);
      }

      return sendSuccess(res, { id }, `Product '${existing.name}' (${id}) deleted successfully`);
    } catch (err: any) {
      return sendError(res, 'Failed to delete product', 500, [err.message]);
    }
  });

  // ==========================================
  // 2. CATEGORIES RESOURCE (CRUD)
  // ==========================================
  // GET /api/categories
  app.get('/api/categories', (req: Request, res: Response) => {
    const categories = db.getCategories();
    return sendSuccess(res, categories);
  });

  // GET /api/categories/:id
  app.get('/api/categories/:id', (req: Request, res: Response) => {
    const cat = db.getCategoryById(req.params.id);
    if (!cat) {
      return sendError(res, `Category '${req.params.id}' not found.`, 404);
    }
    return sendSuccess(res, cat);
  });

  // POST /api/categories (CREATE)
  app.post('/api/categories', (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      if (!name || typeof name !== 'string' || name.trim().length < 2) {
        return sendError(res, 'Category name is required (minimum 2 characters).', 400);
      }

      const created = db.createCategory(req.body);
      return sendSuccess(res, created, 'Category created successfully', 201);
    } catch (err: any) {
      return sendError(res, 'Failed to create category', 500, [err.message]);
    }
  });

  // PUT /api/categories/:id (UPDATE)
  app.put('/api/categories/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const existing = db.getCategoryById(id);
      if (!existing) {
        return sendError(res, `Category '${id}' not found.`, 404);
      }

      const updated = db.updateCategory(id, req.body);
      return sendSuccess(res, updated, `Category '${id}' updated successfully`);
    } catch (err: any) {
      return sendError(res, 'Failed to update category', 500, [err.message]);
    }
  });

  // DELETE /api/categories/:id (DELETE)
  app.delete('/api/categories/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const existing = db.getCategoryById(id);
      if (!existing) {
        return sendError(res, `Category '${id}' not found.`, 404);
      }

      const deleted = db.deleteCategory(id);
      return sendSuccess(res, { id }, `Category '${existing.name}' deleted`);
    } catch (err: any) {
      return sendError(res, 'Failed to delete category', 500, [err.message]);
    }
  });

  // ==========================================
  // 3. ORDERS RESOURCE (CRUD)
  // ==========================================
  // GET /api/orders
  app.get('/api/orders', (req: Request, res: Response) => {
    try {
      const { status, search } = req.query;
      const orders = db.getOrders({
        status: status as string,
        search: search as string,
      });
      return sendSuccess(res, orders);
    } catch (err: any) {
      return sendError(res, 'Failed to fetch orders', 500, [err.message]);
    }
  });

  // GET /api/orders/:id
  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return sendError(res, `Order '${req.params.id}' not found.`, 404);
    }
    return sendSuccess(res, order);
  });

  // POST /api/orders (CREATE / CHECKOUT)
  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        postalCode,
        country,
        items,
        paymentMethod,
        couponCode,
        notes,
      } = req.body;

      const errors: string[] = [];
      if (!customerName || customerName.trim().length < 2) errors.push('Customer full name is required.');
      if (!customerEmail || !customerEmail.includes('@')) errors.push('Valid email address is required.');
      if (!customerPhone || customerPhone.trim().length < 6) errors.push('Contact phone number is required.');
      if (!shippingAddress || shippingAddress.trim().length < 5) errors.push('Shipping street address is required.');
      if (!city || city.trim().length < 2) errors.push('City is required.');
      if (!postalCode || postalCode.trim().length < 2) errors.push('Postal/ZIP code is required.');
      if (!items || !Array.isArray(items) || items.length === 0) {
        errors.push('Cart items array cannot be empty.');
      }

      if (errors.length > 0) {
        return sendError(res, 'Order validation failed', 400, errors);
      }

      const order = db.createOrder({
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        city,
        postalCode,
        country: country || 'United States',
        items,
        paymentMethod: paymentMethod || 'Credit / Debit Card',
        couponCode,
        notes,
      });

      return sendSuccess(res, order, 'Order confirmed and placed successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to place order', 400, [err.message]);
    }
  });

  // PUT /api/orders/:id/status (UPDATE)
  app.put('/api/orders/:id/status', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

      if (!status || !validStatuses.includes(status)) {
        return sendError(res, `Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }

      const updated = db.updateOrderStatus(id, status);
      if (!updated) {
        return sendError(res, `Order '${id}' not found.`, 404);
      }

      return sendSuccess(res, updated, `Order status updated to '${status}'`);
    } catch (err: any) {
      return sendError(res, 'Failed to update order status', 500, [err.message]);
    }
  });

  // DELETE /api/orders/:id (DELETE / ARCHIVE)
  app.delete('/api/orders/:id', (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const existing = db.getOrderById(id);
      if (!existing) {
        return sendError(res, `Order '${id}' not found.`, 404);
      }

      db.deleteOrder(id);
      return sendSuccess(res, { id }, `Order '${existing.orderNumber}' deleted successfully`);
    } catch (err: any) {
      return sendError(res, 'Failed to delete order', 500, [err.message]);
    }
  });

  // ==========================================
  // 4. REVIEWS RESOURCE (CRUD)
  // ==========================================
  app.get('/api/reviews', (req: Request, res: Response) => {
    const { productId } = req.query;
    const reviews = db.getReviews(productId as string);
    return sendSuccess(res, reviews);
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    try {
      const { productId, customerName, rating, title, comment } = req.body;
      const errors: string[] = [];

      if (!productId) errors.push('Product ID is required.');
      if (!customerName || customerName.trim().length < 2) errors.push('Customer name is required.');
      if (!rating || isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
        errors.push('Rating must be between 1 and 5 stars.');
      }
      if (!title || title.trim().length < 2) errors.push('Review title is required.');
      if (!comment || comment.trim().length < 5) errors.push('Review comment is required (min 5 chars).');

      if (errors.length > 0) {
        return sendError(res, 'Review validation failed', 400, errors);
      }

      const review = db.createReview(req.body);
      return sendSuccess(res, review, 'Review submitted successfully', 201);
    } catch (err: any) {
      return sendError(res, err.message || 'Failed to submit review', 400, [err.message]);
    }
  });

  app.delete('/api/reviews/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = db.deleteReview(id);
    if (!deleted) {
      return sendError(res, `Review '${id}' not found.`, 404);
    }
    return sendSuccess(res, { id }, 'Review deleted');
  });

  // ==========================================
  // 5. COUPONS VALIDATION ENDPOINT
  // ==========================================
  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    if (!code) {
      return sendError(res, 'Coupon code is required', 400);
    }

    const result = db.validateCoupon(code, Number(subtotal) || 0);
    if (!result.valid) {
      return sendError(res, result.message, 400);
    }

    return sendSuccess(res, result, result.message);
  });

  // ==========================================
  // VITE MIDDLEWARE / STATIC ASSETS
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Enterprise Server Exception:', err);
    res.status(500).json({
      success: false,
      message: 'Internal Enterprise Server Error',
      errors: [err.message || 'Unknown exception'],
      timestamp: new Date().toISOString(),
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`  SERENO E-COMMERCE REST API RUNNING ON PORT ${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`  OpenAPI Spec: http://localhost:${PORT}/api/docs/openapi.json`);
    console.log(`=======================================================`);
  });
}

startServer();
