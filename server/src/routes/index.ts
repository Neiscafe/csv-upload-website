import express from 'express';
import yourController from '../controllers/yourController';

const router = express.Router();

router.get('/get', yourController.get);
router.get('/update', yourController.update);

export default router;