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

    const dbURI: any = process.env.dbURI
    await databaseConnection(dbURI)

    app.use(cors())

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))

    const PORT: any = process.env.PORT

    const server = app.listen(PORT, (req: any, res: any) => {
        console.log(`listening on port ${PORT}`)
    })
    .on('error', (err: any) => {
        console.log(err)
        process.exit()
    })

    // get socket connection and send to socket file
    // const io = socket(server)
    // mySocket(io)

    app.use('/users', usersRoutes)
    app.use('/admin', adminRoutes)



    // 404 route
    app.use((req: any, res: any) => {
        res.status(404).json({ data: `Cannot get route ${req.path}`, statusCode: 404, msg: "Failure" })
    })

}

startServer()