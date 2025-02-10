import sequelize from "../config/db";
import { QueryTypes } from 'sequelize';
import { contactAttributes } from "../model/contact.model";

export const indentifyContactService = async (email: string, phoneNumber: string) => {
    try {
        const query = `SELECT * FROM contacts WHERE email = :email OR phonenumber = :phoneNumber`;
        const result: contactAttributes[] = await sequelize.query(query, {
            replacements: { email, phoneNumber },
            type: QueryTypes.SELECT,
            raw: true
        })
        if (result.length == 0) {
            const insertQuery = `INSERT INTO contacts (phonenumber, email, linkedid, linkprecedence, createdat, updatedat, deletedat) 
            VALUES (:phoneNumber, :email, NULL, 'primary', NOW(), NOW(), NULL)
            RETURNING *`;

            const [insertedData]: any = await sequelize.query(insertQuery, {
                replacements: { email, phoneNumber },
                type: QueryTypes.INSERT,
                raw: true
            });

            return formatResponse(insertedData.id, [email].filter(Boolean), [phoneNumber].filter(Boolean), []);
        } else {
            const existingContact = result.find(contact => contact.email === email && contact.phonenumber === phoneNumber);
            if (existingContact) {
                return getConsolidatedResponse(existingContact);
            }

            let primaryContact = result
                .filter(contact => contact.linkprecedence === "primary")
                .sort((a, b) => new Date(a.createdat).getTime() - new Date(b.createdat).getTime())[0];

            if (!primaryContact) {
                primaryContact = result[0];
            }

            if (!primaryContact) {
                throw new Error("Unexpected error: No primary contact found.");
            }

            const anotherPrimary = result.find(contact => contact.id !== primaryContact.id && contact.linkprecedence === "primary");

            if (anotherPrimary) {
                const updateQuery = `UPDATE contacts SET linkedid = :primaryId, linkprecedence = 'secondary', updatedat = NOW() WHERE id = :secondaryId`;

                await sequelize.query(updateQuery, {
                    replacements: { primaryId: primaryContact.id, secondaryId: anotherPrimary.id },
                    type: QueryTypes.UPDATE,
                });

                const relinkQuery = `UPDATE contacts SET linkedid = :primaryId WHERE linkedid = :oldPrimaryId`;
                await sequelize.query(relinkQuery, {
                    replacements: { primaryId: primaryContact.id, oldPrimaryId: anotherPrimary.id },
                    type: QueryTypes.UPDATE,
                });

                return getConsolidatedResponse(primaryContact);
            }

            const insertQuery = `INSERT INTO contacts (phonenumber, email, linkedid, linkprecedence, createdat, updatedat, deletedat) 
                            VALUES (:phoneNumber, :email, :linkedId, 'secondary', NOW(), NOW(), NULL)
                            RETURNING *`;

            const [insertedData]: any = await sequelize.query(insertQuery, {
                replacements: { email, phoneNumber, linkedId: primaryContact.id },
                type: QueryTypes.INSERT,
                raw: true,
            });

            return getConsolidatedResponse(primaryContact);
        }
    } catch (err) {
        console.log(err)
    }
}

const getConsolidatedResponse = async (primaryContact: contactAttributes) => {
    const contacts: contactAttributes[] = await sequelize.query(
        `SELECT * FROM contacts WHERE id = :primaryId OR linkedid = :primaryId`,
        {
            replacements: { primaryId: primaryContact.id },
            type: QueryTypes.SELECT,
            raw: true
        }
    );

    const emails: string[] = [...new Set(contacts.map(c => c.email).filter(Boolean))] as string[];
    const phoneNumbers: string[] = [...new Set(contacts.map(c => c.phonenumber).filter(Boolean))] as string[];
    const secondaryContactIds = contacts.filter(c => c.linkprecedence === "secondary").map(c => c.id);

    return formatResponse(primaryContact.id, emails, phoneNumbers, secondaryContactIds);
}

const formatResponse = (primaryContactId: number, emails: string[], phoneNumbers: string[], secondaryContactIds: number[]) => {
    return {
        contact: {
            primaryContactId,
            emails,
            phoneNumbers,
            secondaryContactIds
        }
    };
}