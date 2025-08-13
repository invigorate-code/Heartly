import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperTokensRolesModule } from '../../utils/supertokens/roles.module';
import { CustomRoleController } from './custom-role.controller';
import { CustomRoleService } from './custom-role.service';
import { CustomRoleEntity } from './entities/custom-role.entity';

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
