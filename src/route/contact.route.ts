import {Router} from 'express';
import { identifyContact } from '../controller/contact.controller';

const router = Router();

router.post('/identify', identifyContact);

export default router;