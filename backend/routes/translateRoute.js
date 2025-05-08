import express from 'express';

import { translate } from '../controller/handleTranslate.js';  

const router = express.Router();  

// router.post('/translate', translate);  di na kailangan ng /translate dito
router.post('/', translate);


export default router;  
