const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userroutes');
const transactionRoutes = require('./routes/transactionroutes');
const cors=require('cors');
const app = express();
app.use(cors());

// Connect to MongoDB
connectDB();

app.use(express.json());

// Set up routes
app.get('/',(req,res)=>{
  res.json({msg:"Welcome to User-Transaction field",
    userdetails:"use this url : /api/user/:id",
    pagination:"use this url : /api/transactions?page=1&limit=10&status=success&type=credit"
  });
} );
app.use('/api', userRoutes);
app.use('/api', transactionRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
