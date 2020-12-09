import express from 'express';
import {
    register,
    logout,
    resetPassword,
    forgotPassword,
    updatePassword,
    updateDetails,
    getMe,
    login,
    uploadPhoto,
    confirmEmail
} from '../controllers/auth.js';

const router = express.Router();

import {protect} from '../middleware/auth.js';

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.get('/me', protect, getMe);
router.get('/confirm/email', confirmEmail);
router.put('/update', protect, updateDetails);
router.put('/upload/photo', protect, uploadPhoto);
router.put('/password', protect, updatePassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;
