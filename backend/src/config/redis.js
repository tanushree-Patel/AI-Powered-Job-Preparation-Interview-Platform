const {createClient} =require('redis')

const client=createClient({
    url:process.env.REDIS_URL,
})

client.on("error",(err)=>{
    console.error("Redis Error: ",err)
})

async function connectRedis(){
    await client.connect()
    console.log("redis Connected");
}



module.exports={client,connectRedis
}