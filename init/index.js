const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
main().then(()=>{
    console.log("connected to DB wanderlust");
}).catch(err=>{
    console.log(err);
});
async function main() {
    await mongoose.connect("mongodb://localhost:27017/wanderlust");
}
const initDB = async()=>{
   await Listing.deleteMany({});
   initData.data=initData.data.map((obj)=>({...obj,owner:"66dc90b621cf5c0d5325217d"}));
   await Listing.insertMany(initData.data);
   console.log("data was initilised ");
};
initDB();