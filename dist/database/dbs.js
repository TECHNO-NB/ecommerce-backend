import mongoose from "mongoose";
const connectDb = async () => {
    try {
        const dbsConnect = await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log("MongoDB connected");
    }
    catch (error) {
        console.log("Error on conneting dbs", error);
    }
};
export default connectDb;
