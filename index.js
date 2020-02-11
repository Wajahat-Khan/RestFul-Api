const express = require('express')

const app=express()
courses=[
    {id:1,name:'Course1'},
    {id:2,name:'Course2'},
    {id:3,name:'Course3'}
]
app.get('/', (req,res)=>{
res.send('Hello Listening')
});

app.get('/api/courses',(req,res)=>{
    res.send(courses)
})

app.get('/api/courses/:id',(req,res)=>{
    const course=courses.find(c=>c.id===parseInt(req.params.id))
    if(!course) res.status(400).send("Nothing found");
    res.send(course)
})

const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})