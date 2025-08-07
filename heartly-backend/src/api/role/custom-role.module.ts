import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomRoleEntity } from './entities/custom-role.entity';
import { CustomRoleService } from './custom-role.service';
import { CustomRoleController } from './custom-role.controller';
import { SuperTokensRolesModule } from '../../utils/supertokens/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomRoleEntity]),
    SuperTokensRolesModule,
  ],
  controllers: [CustomRoleController],
  providers: [CustomRoleService],
  exports: [CustomRoleService],
})
export class CustomRoleModule {}