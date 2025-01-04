const User = require('../models/user.js');

// Controller to get user details by ID
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user details', error: err });
  }
};


// Controller to add a new user
const addUser = async (req, res) => {
  const { name, phoneNumber } = req.body;

  if (!name || !phoneNumber) {
    return res.status(400).json({ message: 'Name and Phone Number are required' });
  }

  try {
    // Check if the phone number already exists
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    const user = new User({ name, phoneNumber });
    await user.save();
    res.status(201).json({ message: 'User added successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Error adding user', error: err });
  }
};

module.exports = { getUserDetails, addUser };
