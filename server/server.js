import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connect } from 'mongoose';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoute.js';
import journalRouter from './routes/journalRoute.js';

const app = express();
const port = process.env.PORT || 5000;
connectDB(); 

const allowedOrigins = ['http://localhost:5173']

app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(express.json());
app.use(cookieParser());

//API Endpoints
app.get('/', (req, res)=> res.send('API is working'));
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/journal', journalRouter);

app.listen(port, ()=> console.log(`server started on port ${port}`));