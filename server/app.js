// Main starting point of the application
import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import routes from './routes';
import mongoose from 'mongoose';
import cors from 'cors';

// DB Setup
mongoose.connect('mongodb://localhost:InstaClone/InstaClone');

const app = express();

// App Setup
app.use(morgan('combined'));
app.use(cors());
app.use('/api', routes);

export default app;
