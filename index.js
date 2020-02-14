const express = require('express')
const Joi = require('joi')
const app=express()
const MongoClient = require('mongodb').MongoClient;
app.use(express.json())

courses=[
    {_id:1,name:'Course1'},
    {_id:2,name:'Course2'},
    {_id:3,name:'Course3'}
]
const url='mongodb://localhost:27017/test'

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    dbo = db.db("test");
    dbo.collection("courses").find({}).sort({_id:-1}).toArray( (err,res)=>{
        if(err) throw err;
        console.log(res)
    })
});

app.get('/', (req,res)=>{
res.send('Hello Listening')
});

app.get('/api/courses',(req,res)=>{
   MongoClient.connect(url, function(err,db){
     if(err) throw err;
     dbo=db.db("test");
     dbo.collection("courses").find({}).toArray((err,data)=>{
        if (data!=null) res.send(data);
        else res.status(400).send("Course not found")
     })
   })
})

app.get('/api/courses/:id',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        dbo=db.db("test");
        dbo.collection("courses").findOne({_id:parseInt(`${req.params.id}`)},(err,data)=>{
            if(err) throw err;
            if (data!=null) res.send(data);
            else res.status(400).send("Course not found")
        })
    })
})

app.post('/api/courses',(req,res)=>{

    const {error}=validateCourse(req.body)
    if(error){
        res.status(400).send(error.details[0].message)
        return
    }
  
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        dbo = db.db("test");
        dbo.collection("courses").find({}, {projection: {_id:1}}).sort({_id:-1}).toArray((err,data)=>{
            if (err) throw err;
            let course ={
                _id:parseInt(`${data[0]._id}`) + 1,
                name:req.body.name
            }
            dbo.collection("courses").insertOne(course,(err,data)=>{
                if(err) throw err;
                console.log(data.insertedCount + " Courses added");
                res.send(course);
            })
        })
        
    });
})
app.put('/api/courses/:id',(req,res)=>{
    
    const {error}=validateCourse(req.body)
    if(error){
        res.status(400).send(error.details[0].message)
        return
    }    
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        dbo=db.db("test");
        dbo.collection("courses").updateOne({_id:parseInt(`${req.params.id}`)},{$set:{name:`${req.body.name}`}},(err,result)=>{
            if(result.result.matchedCount===0) return res.status(400).send("Course not found");
                    dbo.collection("courses").findOne({_id:parseInt(`${req.params.id}`)},(err,data)=>{
                            if(err) throw err;
                            if (data!=null) res.send(data);
                            else res.status(400).send("Course not found")
                        })
                })
})
})

app.delete('/api/courses/:id',(req,res)=>{
    MongoClient.connect(url,(err,db)=>{
        if(err) throw err;
        dbo=db.db("test");
        dbo.collection("courses").findOne({_id:parseInt(`${req.params.id}`)},(err,result)=>{
            if(err) throw err;
            console.log(result)
            if (result==null) return res.status(400).send("Course not found");
        dbo.collection("courses").deleteOne({_id:parseInt(`${req.params.id}`)},(err,data)=>{
        if(err) throw err;
        console.log(data)     
        res.send(result)
        })
    })
})
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})

function validateCourse(course){
    const schema={
        name:Joi.string().min(3).required()
    }
   return Joi.validate(course,schema);
}