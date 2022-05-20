import mongoose from "mongoose";

//database creation 
export function MongoConnect(){

    const connectionParams ={
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }
   try {

    mongoose.connect(process.env.mongourl, connectionParams)
    console.log("Connected to Mongo")
      
   } catch (error) {
       console.log(error);
   }
}