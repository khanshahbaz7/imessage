import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import { connectDB } from './lib/db.js';
import {clerkMiddleware} from '@clerk/express'

const app = express();

const PORT = process.env.PORT;
const FRONTEND_URL=process.env.FRONTEND_URL;

app.use(express.json)
app.use(cors({origin : FRONTEND_URL, credentials : true}))
app.use(clerkMiddleware)

app.get("/", (req, res) => {
    res.send("Hello World");
})

app.listen(PORT, () => {
    connectDB();
    console.log("Server is listening on PORT:", PORT)
})