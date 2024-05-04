// console.log("Hello world");

// const {v4:uuidv4}=require('uuid');

// console.log(uuidv4())
const express= require("express");
const mongoose=require('mongoose');

const Customer=require('../models/customer');

const dotenv=require("dotenv");
dotenv.config();

const app=express();
mongoose.set('strictQuery',false);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const port=process.env.PORT || 3000;

const customer=new Customer({
    name:"Anubhav",
    industry:"Business"
})

app.get("/",(req,res)=>{
res.send("Welcome");
})

customer.save();

app.post("/",(req,res)=>{
    res.send("This is a post request");
})

app.get("/api/customers",async (req,res)=>{
    try{
        const result=await Customer.find();
    res.json({"customers":result});
    }
    catch(error){
res.send("Error");
    }
    })



app.get('/api/customers/:id',async (req,res) =>{
res.json({requestParams:req.params,
          requestQuery:req.query
});

try{
const customerId=req.params.id;
console.log(customerId);
const result=await Customer.findById(customerId);
res.json({"customers":result});
if (!result){
    res.status(404).json({Error:"User not found"});
}
else{
    res.json({"customers":result});
}
}
catch(e){
res.status(500).json({error:'Something went wrong'});
}

})

app.put('/api/customers/:id',async (req,res) =>{
    
    try{
    const customerId=req.params.id;
    const result = await Customer.replaceOne({
        _id:customerId
    },req.body);
    console.log(result);
    res.json({
        updatedCount:result.modifiedCount
    });
    }
    catch(e){
        res.status(500).json({
            error:'something went wrong'
        });
    }
    
    })

    app.delete('/api/customers/:id',async (req,res) =>{
    
        try{
        const customerId=req.params.id;
        const result = await Customer.deleteOne({
            _id:customerId
        },req.body);
        console.log(result);
        res.json({
            deletedCount:result.deletedCount
        });
        }
        catch(e){
            res.status(500).json({
                error:'something went wrong'
            });
        }
        
        })


    
app.post("/api/customers",async(req,res)=>{
    console.log(req.body)
    const customer=new Customer({
        name:req.body.name,
        industry:req.body.industry
    });
    try{
        await customer.save();
        res.status(201).json({customer});
    }
    catch(e){
        res.status(400).json({error:e.message})
    }
    //req.send(req.body);
})
    


const start= async() =>{
    try{
    await mongoose.connect(CONNECTION);

    app.listen(port,()=>{
        console.log("Server is running on port:"+port);
    })

    }
    catch(error){
        console.log("Error:",error.message);
    }
}

start();