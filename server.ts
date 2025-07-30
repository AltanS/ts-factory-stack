import { createRequestHandler } from '@react-router/express';
import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';

if (process.env.NODE_ENV === 'production' && !process.env.APP_URL) {
  throw new Error('APP_URL is not set');
}

const viteDevServer =
  process.env.NODE_ENV === 'production' ?
    undefined
  : await import('vite').then((vite) =>
      vite.createServer({
        server: { middlewareMode: true },
      }),
    );

// handle SSR requests

const remixHandler = createRequestHandler({
  build:
    viteDevServer ?
      () => viteDevServer.ssrLoadModule('virtual:react-router/server-build')
      // @ts-expect-error this file is generated at build time and relative to build directory
      // eslint-disable-next-line import/no-unresolved
    : await import('#build/server/index.js'),
});

const app = express();
app.use(compression());
app.disable('x-powered-by');

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  app.use(
    '/assets',
    express.static('build/client/assets', {
      immutable: true,
      maxAge: '1y',
    }),
  );
}

app.use(
  morgan('[:date[iso]] :referrer :method :url :status :response-time ms', {
    skip: (req) => {
      const referrer = req.get('referrer');
      const isLocalRequest = referrer?.includes(process.env.APP_URL!);

      return (
        isLocalRequest ||
        req.url.includes('.ts') ||
        req.url.includes('.tsx') ||
        req.url.includes('.css') ||
        req.url.includes('.js') ||
        req.url.includes('.json') ||
        req.url.includes('.data') ||
        req.url.includes('.ico') ||
        req.url.includes('.png') ||
        req.url.includes('.svg') ||
        req.url.includes('@vite') ||
        req.url.includes('@id') ||
        req.url.includes('@fs') ||
        req.url.includes('node_modules') ||
        req.url.includes('__manifest') ||
        req.url.includes('bullboard') ||
        req.url.includes('healthcheck')
      );
    },
  }),
);

// Remix fingerprints its assets so we can cache forever.

app.use(express.static('build/client', { maxAge: '1h' }));

// handle SSR requests
app.all('*', remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Started server at http://localhost:${port}`);
});
