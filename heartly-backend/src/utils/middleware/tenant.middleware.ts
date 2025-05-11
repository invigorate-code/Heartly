import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    // Extract the tenant identifier from a header. You can also use subdomains or tokens.
    const tenantId = req.headers['x-tenant-id'];

    if (!tenantId) {
      throw new BadRequestException('Tenant ID header missing');
    }

    // Attach the tenant ID to the request object for use in controllers/services.
    // Optionally, you might validate or transform the tenantId here.
    req['tenantId'] = tenantId.toString();

    next();
  }
}
