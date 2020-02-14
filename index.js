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
var dbo;
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    dbo = db.db("test");
    // dbo.collection("courses").insertMany(courses,(err,res)=>{
    //     if(err) throw err;
    //     console.log(res.insertedCount + " Courses added");
    // })
    dbo.collection("courses").find({}).sort({name:-1}).toArray( (err,res)=>{
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
         res.send(data);
     })
   })
})

app.get('/api/courses/:id',(req,res)=>{
    // const course=courses.find(c=>c.id===parseInt(req.params.id))
    // if(!course) res.status(400).send("Course not found");
    // res.send(course)
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
    let course ={
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course)
    res.send(course)
})
app.put('/api/courses/:id',(req,res)=>{
    const course=courses.find(c=>c.id===parseInt(req.params.id))
    if(!course){
        res.status(404).send("Course not found");
        return;
    }
    const {error}=validateCourse(req.body)
    if(error){
        res.status(400).send(error.details[0].message)
        return
    }
    course.name=req.body.name;
    res.send(course);

})

app.delete('/api/courses/:id',(req,res)=>{
    const course=courses.find(c=>c.id===parseInt(req.params.id))
    if(!course){
        res.status(404).send("Course not found");
        return;
    }

    const index=courses.indexOf(course);
    courses.splice(index,1);
    res.send(course)
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