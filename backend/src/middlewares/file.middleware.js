const multer=require('multer')

const upload=multer({
    storage:multer.memoryStorage(),
    limit:{
        fileSize:3*1024*1024 // 3 MB
    }
})

module.exports=upload