const mongoose = require('mongoose');
const User = require('./models/user');
const Transaction = require('./models/transaction');

const connectDB = require('./config/db');
connectDB();

const generateUniquePhoneNumber = async (basePhone) => {
  let phoneNumber = basePhone;
  let exists = await User.findOne({ phoneNumber });
  while (exists) {
    // Add a random number at the end of the basePhone to ensure uniqueness
    phoneNumber = basePhone + Math.floor(Math.random() * 1000);
    exists = await User.findOne({ phoneNumber });
  }
  return phoneNumber;
};

const seedData = async () => {
  // Create random users
  const users = [];
  for (let i = 0; i < 10; i++) {
    const basePhone = `987654321${i}`;
    const uniquePhone = await generateUniquePhoneNumber(basePhone);
    const user = new User({ name: `User${i + 1}`, phoneNumber: uniquePhone });
    await user.save();
    users.push(user);
  }

  // Create random transactions for each user
  for (const user of users) {
    for (let j = 0; j < 5; j++) {
      const transaction = new Transaction({
        status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)],
        type: ['debit', 'credit'][Math.floor(Math.random() * 2)],
        transactionDate: new Date(),
        amount: Math.floor(Math.random() * 1000),
        userId: user._id,
      });
      await transaction.save();
    }
  }

  console.log('Data seeded successfully');
  mongoose.connection.close();
};

seedData();
