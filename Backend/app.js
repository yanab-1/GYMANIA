const express = require('express');
const app = express();
const path = require('path');

// database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/shoping_app')
.then(() => {
    console.log('mongodb connected');

})
.catch( (err) =>{
    console.log('DB connection error');
    console.log(err);
})

app.listen(8080, () => {
    console.log("server connected successfully");
})