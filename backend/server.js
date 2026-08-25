require('dotenv').config();
const config = require('./src/config/config');
const connectToDB = require('./src/config/database');


async function startServer() {
    try {
        await connectToDB()

        const app = require('./src/app');
        const port = config.PORT || 3000

        app.listen(port, () => {
            console.log('Server is running on port ', port);

        })
    } catch (err) {
        console.log("Error starting server: ", err);
        process.exit(1);

    }
}

startServer()