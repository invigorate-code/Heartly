import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import generateModulesSet from './utils/modules-set';
import {
  RlsContextMiddleware,
  RlsContextCleanupMiddleware,
} from './utils/middleware/rls-context.middleware';

@Module({
  imports: generateModulesSet(),
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RlsContextMiddleware, RlsContextCleanupMiddleware)
      .forRoutes('*');
  }
}
