import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PHIService } from './phi.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [PHIService],
  exports: [PHIService],
})
export class PHIModule {}
