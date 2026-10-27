import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { db } from './server/store';

function apiDevPlugin(): Plugin {
  return {
    name: 'sereno-api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url || '';
        if (!url.startsWith('/api')) {
          return next();
        }

        const method = req.method || 'GET';
        const parsedUrl = new URL(url, 'http://localhost');
        const pathname = parsedUrl.pathname;

        const sendJson = (status: number, payload: any) => {
          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(payload));
        };

        const readBody = (): Promise<any> => {
          return new Promise((resolve) => {
            let body = '';
            req.on('data', (chunk: any) => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                resolve(body ? JSON.parse(body) : {});
              } catch {
                resolve({});
              }
            });
          });
        };

        try {
          if (pathname === '/api/health') {
            return sendJson(200, {
              status: 'UP',
              service: 'SERENO Dev Server API',
              ...db.getSummaryStats(),
            });
          }

          if (pathname === '/api/products' && method === 'GET') {
            const category = parsedUrl.searchParams.get('category') || undefined;
            const search = parsedUrl.searchParams.get('search') || undefined;
            const minPrice = parsedUrl.searchParams.get('minPrice') ? Number(parsedUrl.searchParams.get('minPrice')) : undefined;
            const maxPrice = parsedUrl.searchParams.get('maxPrice') ? Number(parsedUrl.searchParams.get('maxPrice')) : undefined;
            const sort = parsedUrl.searchParams.get('sort') || undefined;
            const featured = parsedUrl.searchParams.get('featured') === 'true' ? true : undefined;
            const prods = db.getProducts({ category, search, minPrice, maxPrice, sort, featured });
            return sendJson(200, { success: true, data: prods });
          }

          if (pathname === '/api/categories' && method === 'GET') {
            return sendJson(200, { success: true, data: db.getCategories() });
          }

          if (pathname === '/api/orders' && method === 'GET') {
            const status = parsedUrl.searchParams.get('status') || undefined;
            const search = parsedUrl.searchParams.get('search') || undefined;
            return sendJson(200, { success: true, data: db.getOrders({ status, search }) });
          }

          if (pathname === '/api/orders' && method === 'POST') {
            const body = await readBody();
            const newOrder = db.createOrder(body);
            return sendJson(201, {
              success: true,
              data: newOrder,
              message: 'Order confirmed and placed successfully',
            });
          }

          if (pathname.startsWith('/api/orders/') && pathname.endsWith('/status') && method === 'PUT') {
            const parts = pathname.split('/');
            const id = parts[3];
            const body = await readBody();
            const updated = db.updateOrderStatus(id, body.status);
            return sendJson(200, { success: true, data: updated });
          }

          if (pathname === '/api/coupons/validate' && method === 'POST') {
            const body = await readBody();
            const result = db.validateCoupon(body.code, Number(body.subtotal) || 0);
            return sendJson(result.valid ? 200 : 400, {
              success: result.valid,
              ...result,
            });
          }

          if (pathname === '/api/reviews' && method === 'GET') {
            const productId = parsedUrl.searchParams.get('productId') || undefined;
            return sendJson(200, { success: true, data: db.getReviews(productId) });
          }

          if (pathname === '/api/reviews' && method === 'POST') {
            const body = await readBody();
            const review = db.createReview(body);
            return sendJson(201, { success: true, data: review });
          }

          if (pathname === '/api/seed/reset' && method === 'POST') {
            db.reset();
            return sendJson(200, { success: true, message: 'Store reset successfully' });
          }

          return sendJson(404, {
            success: false,
            message: `Endpoint ${method} ${pathname} not found`,
          });
        } catch (err: any) {
          return sendJson(500, {
            success: false,
            message: err.message || 'Internal Server Error',
          });
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
