import {Request, Response} from 'express';
import { indentifyContactService } from '../service/contact.service';

export const identifyContact = async (req: Request, res: Response) => {
    try {
        const {phoneNumber, email} = req.body;
        if (phoneNumber && phoneNumber !== null) {
            const phoneNumberAsString = phoneNumber.toString();
            const result = await indentifyContactService(email, phoneNumberAsString);
            if (result) {
                res.status(200).send({
                    result
                });
            } else {
                res.status(404).json({
                    message: 'Contact not found or created'
                });
            }
        } else if (email) {
            const result = await indentifyContactService(email, '');
            if (result) {
                res.status(200).send({
                    result
                });
            } else {
                res.status(404).json({
                    message: 'Contact not found or created with only email'
                });
            }
        } else {
            res.status(400).json({
                message: 'Phone number or email must be provided'
            });
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
};