const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const databaseConfig = require('./config/databaseConfig');

const app = express();

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], methods: ["POST", "GET", "PUT", "DELETE"], credentials: true }));
app.use(cookieParser({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));

app.use("/api/v1/user", require('./routes/userRoutes'));
app.use("/api/v1/company", require('./routes/companyRoutes'));
app.use("/api/v1/industrytype", require('./routes/industrytypeRoutes'));

const url = process.env.MONGO;
databaseConfig(url);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
})
