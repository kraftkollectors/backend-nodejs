import dotenv from 'dotenv';
dotenv.config();
import express from "express"
import cors from 'cors'
import usersRoutes from './users/routes/usersRoutes'
import adminRoutes from './admin/routes/adminRoutes'
import databaseConnection from './database/database'
import mySocket from "./appSocket/socketLogic";
const socket = require('socket.io')


let app: any = express()

const startServer = async () => {

    const DBURI: any = process.env.DBURI
    
    await databaseConnection(DBURI)

    app.use(cors())

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))

    const PORT: any = process.env.PORT

    const server = app.listen(PORT, (req: any, res: any) => {
        // cron job to run every 24 hrs
        require('./utils/checker') 
        console.log(`listening on port ${PORT}`)
    })
    .on('error', (err: any) => {
        console.log(err)
        process.exit()
    })

    // get socket connection and send to socket file
    // Initialize socket.io with CORS settings
    const io = socket(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    mySocket(io);

    app.use('/users', usersRoutes)
    app.use('/admin', adminRoutes)



    // 404 route
    app.use((req: any, res: any) => {
        return res.status(404).json({ data: `Cannot ${req.method} route ${req.path}`, statusCode: 404, msg: "Failure" })
    })

}

startServer()