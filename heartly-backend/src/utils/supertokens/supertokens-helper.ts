import { TenantEntity } from '@/api/tenant/entities/tenant.entity';
import { UserEntity, UserRole } from '@/api/user/entities/user.entity';
import { AppDataSource } from '@/database/data-source';
import { UserResponseDto } from '@/shared/shared.models';

export async function getUserUsingEmail(
  email: string,
): Promise<UserResponseDto | undefined> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const user = await AppDataSource.getRepository(UserEntity).findOne({
    where: { email },
  });

  if (!user) {
    return undefined;
  }

  return user;
}

export async function checkIfEmailAndCompanyNameAvailable(
  email?: string,
  companyName?: string,
): Promise<string | null> {
  if (email === null) return null;
  const userRepository = AppDataSource.getRepository(UserEntity);
  const userEmailLookup = await userRepository.find({
    where: { email },
  });
  const userCompanyLookup = await userRepository.find({
    where: { company: companyName },
  });

  if (userEmailLookup.length > 0) {
    console.log('found user in checkIfEmailAndCompanyNameAvailable', userEmailLookup);
    return 'EMAIL_ALREADY_IN_USE';
  }

  if (userCompanyLookup.length > 0) {
    console.log('found user in checkIfEmailAndCompanyNameAvailable', userCompanyLookup);
    return 'COMPANY_NAME_ALREADY_IN_USE';
  }

  return null;
}

export async function createSubscriberProfileAndTenantRecord(
  formFields: { id: string; value: any }[],
  userId: string,
): Promise<TenantEntity> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const tenantRepository = AppDataSource.getRepository(TenantEntity);
  const tenant = await tenantRepository.create({
    name: formFields.find((f) => f.id === 'company')?.value,
    users: [
      {
        id: userId,
        email: formFields.find((f) => f.id === 'actualEmail')?.value,
        username: formFields.find((f) => f.id === 'email')?.value,
        firstName: formFields.find((f) => f.id === 'firstName')?.value,
        lastName: formFields.find((f) => f.id === 'lastName')?.value,
        company: formFields.find((f) => f.id === 'company')?.value,
        role: UserRole.OWNER,
      },
    ],
  });

  const savedTenant = await tenantRepository.save(tenant);

  return savedTenant;
}

export async function getEmailUsingUserId(
  userId: string,
): Promise<string | undefined> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const userRepository = AppDataSource.getRepository(UserEntity);
  const user = await userRepository.findOne({
    where: { id: userId },
  });

  console.log('user found in getEmailUsingUserId', user);

  return user?.email;
}

export function isInputEmail(input: string): boolean {
  return (
    input.match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    ) !== null
  );
}
