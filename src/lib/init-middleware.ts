import { CorsRequest } from "cors";

// File: lib/init-middleware.ts
export default function initMiddleware(middleware: { (req: CorsRequest, res: { statusCode?: number | undefined; setHeader(key: string, value: string): any; end(): any; }, next: (err?: any) => any): void; (arg0: any, arg1: any, arg2: (result: any) => void): void; }) {
    return (req: any, res: any) =>
      new Promise((resolve, reject) => {
        middleware(req, res, (result: unknown) => {
          if (result instanceof Error) {
            return reject(result);
          }
          return resolve(result);
        });
      });
  }