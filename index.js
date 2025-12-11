import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import productRouter from './router/productRoute.js';
import userRouter from './router/userRoute.js';
import jwt from 'jsonwebtoken';
import orderRouter from './router/orderRoute.js';
import dotenv from 'dotenv';
dotenv.config();
//import fetch from 'node-fetch'; 
import cors from 'cors';
  


//kvhHVKKlYCtq2v2o
//jasingha2002sadininipunika_db_user
//mongodb+srv://admin:kvhHVKKlYCtq2v2o@cluster0.wimteae.mongodb.net/


const app = express();

app.use(cors());

app.use(bodyParser.json())
app.use(express.json());

// i create middleware 
/* app.use((req, res, next) => {
  const tokenString = req.headers['authorization'];

  if (tokenString!=null) {
    const token = tokenString.replace('Bearer ', '');

   const payload= jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
  if (decoded!=null) {
    req.user = decoded;
    next();
  } else {
    console.log(err,"Invalid Token");
   res.status(403).json({ message: "Invalid Token" });
   return;
  }

  const token = jwt.sign(
  payload,
  process.env.JWT_KEY,
  { expiresIn: "1h" } // instead of "1h"
);

  req.user = decoded;
  next();
});
  } else {
    return next();
  }
});*/

app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next(); // no token, skip

  const token = authHeader.replace("Bearer ", "");
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY); // returns payload directly
    req.user = decoded; // attach user info to request
    next(); // proceed
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(403).json({ message: "Invalid Token" }); 
  }
});


app.use("/api/users", userRouter );  
app.use("/orders", orderRouter );
app.use("/api/products", productRouter );







mongoose.connect(process.env.MONGODB_url)
.then(() => 
    console.log('Connected to MongoDB'))
.then(() => {
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    }); 
})
.catch(err => console.error('Could not connect to MongoDB...', err));



app.use("/products", productRouter );









