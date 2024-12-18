// /config/initializeAdmin.ts
import { UserService } from '../services';
import { User } from '../models';

const userService = new UserService();

const adminUserData = {
  fullName: 'Sujan Trinity',
  email: 'admin@gmail.com',
  password: 'admin123',
  number: '+9779851042257',
  role: 'admin',
};

export const initializeAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('✌ Admin user already exists.✌');
      return;
    }
    await userService.createUser(adminUserData);
    console.log('✌ Admin user created successfully.✌');
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};
