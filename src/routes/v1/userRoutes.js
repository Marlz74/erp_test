import { Router } from 'express';
import { createUser, getUsers, validateCreateUser } from '../../controllers/userController.js';

const router = Router();

router.post('/', validateCreateUser, createUser);
router.get('/', getUsers);

export default router;