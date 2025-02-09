import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoute from './route/contact.route';
import sequelize from './config/db';
import Contact from './model/contact.model';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/contact", contactRoute);

const port = Number(process.env.PORT)|| 4001;
app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully!");

        await Contact.sync({ alter: true }).then(() => {
            console.log("Checking table existence...");
            return sequelize.getQueryInterface().showAllTables();
        }).then((tables) => {
            console.log("Existing Tables:", tables);
        });

        console.log(`Server is running on port ${port}`);
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
})