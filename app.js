const http=require('http')

const server=http.createServer((req,res)=>{
    if(req.url==='/'){
        res.write('Home page');
        res.end();
    }

    if(req.url==='/about'){
        res.write('About page');
        res.end();
    }

})

server.listen(3000,()=>{
    console.log('Listening to port 3000')
})