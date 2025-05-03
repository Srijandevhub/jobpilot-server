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
app.use("/api/v1/overview", require('./routes/overviewRoutes'));
app.use("/api/v1/resume", require("./routes/resumeRoutes"));
app.use("/api/v1/job", require("./routes/jobRoutes"));
app.use("/api/v1/jobrole", require("./routes/jobroleRoutes"));
app.use("/api/v1/category", require("./routes/categoryRoutes"));
app.use("/api/v1/public", require('./routes/publicRoutes'));
app.use("/api/v1/filter", require('./routes/filterRoutes'));
app.use("/api/v1/application", require('./routes/applicationRoutes'));

const url = process.env.MONGO;
databaseConfig(url);

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started at ${port}`);
})
