const mongoose = require("mongoose");

const uri =
  "mongodb+srv://gangedms102_db_user:gange123@gange.mneofix.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Gange";

async function testConnection() {
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      family: 4
    });

    console.log("✅ MongoDB Connected Successfully");

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.log("❌ MongoDB Connection Failed");
    console.log(error);
    process.exit(1);
  }
}

testConnection();