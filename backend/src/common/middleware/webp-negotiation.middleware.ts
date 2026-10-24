import * as path from 'node:path';
import type { NextFunction, Request, Response } from 'express';

/**
 * Path-preserving WebP delivery for Express/NestJS.
 *
 * Mount it at /uploads BEFORE the existing static-file handler:
 *   app.use('/uploads', webpNegotiationMiddleware(uploadRoot));
 *
 * A request for /uploads/about/banner.jpg remains the same URL. If the
 * request accepts image/webp and /uploads/about/banner.webp exists, this
 * middleware sends the .webp file with Content-Type: image/webp. Otherwise,
 * it calls next() so the existing static handler serves the original file.
 *
 * Do not replace the contents of .jpg/.png files with WebP bytes. Keep the
 * originals as fallback files.
 */

function explicitlyAcceptsWebp(acceptHeader: string | undefined): boolean {
  if (!acceptHeader) return false;

  return acceptHeader.split(',').some((part) => {
    const [mediaType, ...parameters] = part.trim().split(';');

    if (mediaType.trim().toLowerCase() !== 'image/webp') return false;

    const qParameter = parameters.find((parameter) => /^\s*q\s*=/i.test(parameter));
    if (!qParameter) return true;

    const quality = Number(qParameter.split('=')[1]?.trim());
    return Number.isFinite(quality) && quality > 0;
  });
}

function isWithinDirectory(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative);
}

export function webpNegotiationMiddleware(uploadsDirectory: string) {
  const uploadsRoot = path.resolve(uploadsDirectory);

  return async function serveWebpWhenSupported(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }

    // req.path is relative to /uploads when this middleware is mounted there.
    let decodedPath: string;
    try {
      decodedPath = decodeURIComponent(req.path);
    } catch {
      next();
      return;
    }

    if (!/\.(jpe?g|png)$/i.test(decodedPath)) {
      next();
      return;
    }

    // The same URL can return JPEG/PNG or WebP depending on Accept.
    // Tell browsers and shared caches that the response varies by this header.
    res.vary('Accept');

    if (!explicitlyAcceptsWebp(req.headers.accept)) {
      next();
      return;
    }

    const relativePath = decodedPath.replace(/^[/\\]+/, '');
    const originalPath = path.resolve(uploadsRoot, relativePath);

    if (!isWithinDirectory(uploadsRoot, originalPath)) {
      next();
      return;
    }

    const webpPath = originalPath.replace(/\.(jpe?g|png)$/i, '.webp');

    if (!isWithinDirectory(uploadsRoot, webpPath)) {
      next();
      return;
    }

    // Attempt to serve WebP directly.
// If it does not exist, fall back to the original image.
res.sendFile(webpPath, (error) => {
  if (!error) {
    return;
  }

  if (res.headersSent) {
    next(error);
    return;
  }

  const code = (error as NodeJS.ErrnoException).code;

  if (code === 'ENOENT' || code === 'ENOTDIR') {
    // WebP does not exist. Serve the original image.
    next();
    return;
  }

  // Forward unexpected filesystem or serving errors.
  next(error);
});
  };
}
