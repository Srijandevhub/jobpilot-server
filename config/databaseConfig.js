const mongoose = require('mongoose');

const databaseConfig = async (url) => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database Connected");
    } catch (error) {
        console.log(error);
    }
}

module.exports = databaseConfig;