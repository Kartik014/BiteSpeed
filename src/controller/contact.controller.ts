import {Request, Response} from 'express';
import { indentifyContactService } from '../service/contact.service';

export const identifyContact = async (req: Request, res: Response) => {
    try {
        const {phoneNumber, email} = req.body;
        const phoneNumberAsString = phoneNumber.toString();
        const result = await indentifyContactService(email, phoneNumberAsString);
        if(result){
            res.status(200).send({
                result
            })
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
};