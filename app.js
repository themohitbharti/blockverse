import express from "express";
import dotenv from "dotenv";



dotenv.config();


const app =express();


app.use(express.json());
app.use(express.urlencoded({extended:false}));


const PORT = process.env.PORT || 4000;



app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
})