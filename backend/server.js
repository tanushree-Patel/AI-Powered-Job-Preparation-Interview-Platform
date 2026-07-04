require('dotenv').config();
const connectToDB = require('./src/config/database');


async function startServer(){
try{
    await connectToDB()

const app=require('./src/app');

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
    
})
} catch(err){
    console.log("Error starting server: ",err);
    process.exit(1);
    
}
}

startServer()