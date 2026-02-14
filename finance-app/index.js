const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(()=>{
  console.log('Database connected and synced');
  app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
}).catch(err=> console.error('Database connection error:', err));
