import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://rishuraz18:rishu123@cluster0.2cxz88e.mongodb.net/food-del').then(()=>console.log("DB Connected"));

}

