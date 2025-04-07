const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], methods: ["POST", "GET", "PUT", "DELETE"], credentials: true }));
app.use(cookieParser({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));


const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
})