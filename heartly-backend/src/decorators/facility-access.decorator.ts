import { SetMetadata } from '@nestjs/common';

export const RequiresFacilityAccess = () => SetMetadata('requiresFacilityAccess', true);