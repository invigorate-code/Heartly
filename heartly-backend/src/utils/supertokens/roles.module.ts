import { Module, OnModuleInit } from '@nestjs/common';
import { SuperTokensRolesService } from './roles.service';

@Module({
  providers: [SuperTokensRolesService],
  exports: [SuperTokensRolesService],
})
export class SuperTokensRolesModule implements OnModuleInit {
  constructor(private readonly rolesService: SuperTokensRolesService) {}

  async onModuleInit() {
    // Initialize SuperTokens roles and permissions on application startup
    await this.rolesService.initializeRoles();
  }
}
