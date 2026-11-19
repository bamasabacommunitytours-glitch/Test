import type { Request, Response } from 'express';
import { createApiApp } from '../src/server/createApp.js';

const app = createApiApp();

export default function handler(req: Request, res: Response) {
  const rawPath = req.query?.__path;
  if (typeof rawPath === 'string' && rawPath.length > 0) {
    const clean = rawPath.replace(/^\/+/, '');
    req.url = `/api/${clean}`;
  } else if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }
  return app(req, res);
}
