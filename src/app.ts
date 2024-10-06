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
import path from 'path'


let app: any = express()

const startServer = async () => {

    const DBURI: any = process.env.DBURI
    
    await databaseConnection(DBURI)

    app.use(cors())
    app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    const PORT: any = process.env.PORT

    const server = app.listen(PORT, (req: any, res: any) => {
        // cron job to run every 24 hrs
        require('./utils/checker') 
        console.log(`Typescript App Started..........listening on port ${PORT}`)
    })
    .on('error', (err: any) => {
        console.log(err)
        process.exit()
    })

    // get socket connection and send to socket file
    // Initialize socket.io with CORS settings for chats
    const io = socket(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PATCH', 'DELETE']
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

    

const feScript:string = `echo 'starting script'
cd ../frontend 
git pull origin production
npm i
pm2 stop npm
rm -rf .next
npm run build
pm2 start npm
echo 'ended script'`;
    app.post('/webhook-frontend', async (req: any, res: any) => {
        const child = spawn("bash", ["-c", feScript.replace(/\n/g, "&&")]);

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
