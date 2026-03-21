import mongoose from 'mongoose';
mongoose.connect('mongodb://127.0.0.1:27017/innopulse').then(async () => {
    const startup = await mongoose.connection.db.collection('startups').findOne({});
    console.log(startup._id.toString());
    process.exit(0);
});
