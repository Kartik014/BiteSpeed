import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoute from './route/contact.route';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/contact", contactRoute);

const port = process.env.PORT || 4001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})