import { UserEntity, UserRole } from '@/api/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class UserSeeder1722335726360 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);

    const adminUser = await repository.findOneBy({ username: 'admin' });
    if (!adminUser) {
      const user = new UserEntity();
      user.username = 'admin';
      user.email = 'admin@example.com';
      user.role = UserRole.ADMIN;
      user.firstName = 'Admin';
      user.lastName = 'User';
      user.id = '1';
      user.createdAt = new Date();
      user.updatedAt = new Date();
      await repository.insert(user);
    }

    const userFactory = factoryManager.get(UserEntity);
    await userFactory.saveMany(5);
  }
}
