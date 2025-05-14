const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const databaseConfig = require('./config/databaseConfig');
const Chat = require('./models/chatModel');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:5174',
        credentials: true,
        methods: ["POST", "GET"]
    }
})

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'https://jobpilot-client-6bph8tz51-srijans-projects-4928e819.vercel.app', 'https://jobpilot-client.vercel.app'], methods: ["POST", "GET", "PUT", "DELETE"], credentials: true }));
app.use(cookieParser({ origin: ['http://localhost:5173', 'http://localhost:5174', 'https://jobpilot-client-6bph8tz51-srijans-projects-4928e819.vercel.app', 'https://jobpilot-client.vercel.app'] }));

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
app.use("/api/v1/skill", require('./routes/skillRoutes'));

const url = process.env.MONGO;
databaseConfig(url);

io.on('connection', (socket) => {
    console.log('user connected ', socket.id);

    socket.on('joinroom', (chatroomid) => {
        socket.join(chatroomid);
    });

    socket.on('sendmessage', async ({ senderid, receiverid, content }) => {
        const chatroomid = [senderid, receiverid].sort().join("_");
        const message = new Chat({
            sender: senderid,
            receiver: receiverid,
            content,
            chatroomid
        });
        await message.save();
        io.to(chatroomid).emit('receivemessage', message);

    });

    socket.on('disconnect', () => {
        console.log('user disconnected ', socket.id);
    });

});

app.use('/api/v1/chat', require('./routes/chatRoutes'));

const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Server started at ${port}`);
})
