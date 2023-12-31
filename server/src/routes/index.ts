import express from 'express';
import yourController from '../controllers/yourController';

const router = express.Router();
router.post('/validate', yourController.validate);
router.post('/update', yourController.update);

export default router;