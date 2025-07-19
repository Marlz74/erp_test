import { AppDataSource } from '../config/database.js';
import Users from '../entities/Users.js';
import { paginate } from '../utils/pagination.js';
import { sendResponse, sendError } from '../utils/response.js';
import { validateInput, handleValidationErrors } from '../middleware/validator.js';

const userRepository = AppDataSource.getRepository(Users);

export const userSchema = {
    name: { type: 'string', maxLength: 100, required: true },
    age: { type: 'integer', min: 1, max: 150, required: true },
    email: { type: 'email', maxLength: 100, required: true },
    address: { type: 'string', maxLength: 255, required: true },
    occupation: { type: 'string', maxLength: 100, required: true }
};

// Validation middleware for createUser
export const validateCreateUser = [
    ...validateInput(userSchema, []),
    handleValidationErrors
];

export const createUser = async (req, res) => {
    try {
        const { name, age, email, address, occupation } = req.body;

        const existingUser = await userRepository.findOne({ where: { name } });

        if (existingUser) {
            return sendError(res, 409, 'A user with this name already exists');
        }
        const user = userRepository.create({ name, age, email, address, occupation });
        await userRepository.save(user);
        sendResponse(res, 201, user, 'User created successfully');
    } catch (error) {
        sendError(res, 500, 'Failed to create user');
    }
};

export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        if (page < 1 || limit < 1) {
            return sendError(res, 400, 'Page and limit must be positive integers');
        }
        const { data, total } = await paginate(userRepository, page, limit);
        sendResponse(res, 200, {
            data,
            total,
            page,
            lastPage: Math.ceil(total / limit)
        }, 'Users retrieved successfully');
    } catch (error) {
        sendError(res, 500, 'Failed to retrieve users');
    }
};