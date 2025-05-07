import express from 'express';

import { translate } from '../controller/handleTranslate.js';  

const router = express.Router();  

router.post('/translate', translate); 

export default router;  
