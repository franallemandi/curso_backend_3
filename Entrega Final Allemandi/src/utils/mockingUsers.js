import { fakerES as faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

//faker.locale = 'es'; ya no funciona

export const generateMockUsers = async (qty = 1) => {
  const users = [];

  const hashed = await bcrypt.hash('coder123', 10);

  for (let i = 0; i < qty; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push({
      _id: faker.database.mongodbObjectId(), // formato Mongo
      first_name: firstName,
      last_name: lastName,
      email: faker.internet.email({ firstName: firstName, lastName: lastName }).toLowerCase(),
      password: hashed,
      role: faker.helpers.arrayElement(['user', 'admin']),
      pets: [],
      __v: 0
    });
  }

  return users;
};
