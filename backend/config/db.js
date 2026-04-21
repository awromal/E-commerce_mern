const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Just pass the URI string, nothing else!
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Connection failed:", error);
    }
};

module.exports = connectDB;
