import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordResetController } from './controllers/password-reset.controller';
import { PasswordResetService } from './services/password-reset.service';
import { PasswordResetAuditEntity } from './entities/password-reset-audit.entity';
import { PasswordResetPermissionGuard } from '../../guards/password-reset-permission.guard';
import { UserModule } from '../user/user.module';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordResetAuditEntity]),
    UserModule,
    MailModule,
  ],
  controllers: [PasswordResetController],
  providers: [
    PasswordResetService,
    PasswordResetPermissionGuard,
  ],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}