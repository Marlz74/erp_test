import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { corsOptions } from './middleware/cors.js';
import userRoutesV1 from './routes/v1/userRoutes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../public/swagger.json' with { type: 'json' };
import { AppDataSource } from './config/database.js';
import { sendError } from './utils/response.js';

AppDataSource.initialize()
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('Database connection error:', err));

const app = express();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false, 
    handler: (req, res) => {
        sendError(res, 429, 'Too many requests, please try again later');
    }
});

app.use(limiter);

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/users', userRoutesV1);

export default app;