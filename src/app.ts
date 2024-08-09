import dotenv from 'dotenv';
dotenv.config();
import express from "express"
import cors from 'cors'
import usersRoutes from './users/routes/usersRoutes'
import adminRoutes from './admin/routes/adminRoutes'
import databaseConnection from './database/database'
import mySocket from "./appSocket/socketLogic";
import { spawn } from "child_process";
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

    // script to connect to vps webhook to build automatically
    const script:string = `echo 'starting script' 
git pull
npm i
npm run build
pm2 restart app
echo 'ended script'`;
    app.post('/webhook', async (req: any, res: any) => {
        const child = spawn("bash", ["-c", script.replace(/\n/g, "&&")]);

        const prom = new Promise<boolean>((resolve, reject) => {
          child.stdout.on("data", (data: any) => {
            console.log(`stdout: ${data}`);
          });
      
          child.on("close", (code: any) => {
            console.log(`child process exited with code ${code}`);
            if (code == 0) resolve(true);
            else resolve(false);
          });
        });
        if (await prom) return res.json({ success: true }, { status: 200 });

        return res.json({ success: false }, { status: 500 });
    })

    // 404 route
    app.use((req: any, res: any) => {
        return res.status(404).json({ data: `Cannot ${req.method} route ${req.path}`, statusCode: 404, msg: "Failure" })
    })

}

startServer()