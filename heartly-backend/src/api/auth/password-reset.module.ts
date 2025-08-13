import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PasswordResetPermissionGuard } from '../../guards/password-reset-permission.guard';
import { MailModule } from '../../mail/mail.module';
import { UserModule } from '../user/user.module';
import { PasswordResetController } from './controllers/password-reset.controller';
import { PasswordResetAuditEntity } from './entities/password-reset-audit.entity';
import { PasswordResetService } from './services/password-reset.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PasswordResetAuditEntity]),
    UserModule,
    MailModule,
  ],
  controllers: [PasswordResetController],
  providers: [PasswordResetService, PasswordResetPermissionGuard],
  exports: [PasswordResetService],
})
export class PasswordResetModule {}
