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

const listRoutes = async (app: express.Application) => {
    const chalk = (await import('chalk')).default;
    app._router.stack.forEach((middleware: any) => {
        if (middleware.route) { // if it's a route
            const methods = Object.keys(middleware.route.methods).map((method) => method.toUpperCase()).join(', ');
            console.log(chalk.green(`${methods} ${middleware.route.path}`));
        } else if (middleware.name === 'router') { // if it's a router
            middleware.handle.stack.forEach((handler: any) => {
                const methods = Object.keys(handler.route.methods).map((method) => method.toUpperCase()).join(', ');
                console.log(chalk.green(`${methods} ${middleware.regexp}${handler.route.path}`));
            });
        }
    });
};

const startServer = async () => {

    const DBURI: any = process.env.DBURI
    
    await databaseConnection(DBURI)

    app.use(cors())

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }))

    const PORT: any = process.env.PORT

    const server = app.listen(PORT, (req: any, res: any) => {
        console.log(`listening on port ${PORT}`)
        listRoutes(app);
    })
    .on('error', (err: any) => {
        console.log(err)
        process.exit()
    })

    // get socket connection and send to socket file
    const io = socket(server)
    mySocket(io)

    app.use('/users', usersRoutes)
    app.use('/admin', adminRoutes)



    // 404 route
    app.use((req: any, res: any) => {
        return res.status(404).json({ data: `Cannot ${req.method} route ${req.path}`, statusCode: 404, msg: "Failure" })
    })

}

startServer()