// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

// [SECTION] Route requirements
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");

// [SECTION] Server Setup
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));	


app.use(cors());


mongoose.connect(process.env.MONGODB_STRING, {
    useNewUrlParser: true, //both can be omitted since this will be deprecated in the next version
    useUnifiedTopology: true
});

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));



// Define URI Endpoints
 app.use("/users", userRoutes);
 app.use("/products", productRoutes);


// [SECTION] Server Gateway Response
if(require.main === module){
    app.listen(process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${ process.env.PORT || 3000 }`)
    });
}

module.exports = { app, mongoose };