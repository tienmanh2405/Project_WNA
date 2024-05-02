import express from "express";
import { DB_CONFID } from "./src/configs/db.config.js"
import userRouter from "./src/routers/user.router.js"
import taskRouter from "./src/routers/task.router.js"
import templateRouter from "./src/routers/template.router.js"
import projectRouter from "./src/routers/project.router.js"
import mongoose from "mongoose";
import { SERVER_CONFIG } from "./src/configs/server.config.js";
import cors from 'cors';

const DB_CONNECTION = "mongodb+srv://" + DB_CONFID.username + ":" + DB_CONFID.password + "@cluster0.6v4qlgk.mongodb.net";

const app = express()

app.use(express.json());

app.use(cors());

app.use('/users', userRouter);
app.use('/tasks', taskRouter);
app.use('/projects', projectRouter);
app.use('/templates', templateRouter);
// app.use('/template',)

async function main() {
    try {
        console.log("chuẩn bị connect tới DB")
        // mongoose hổ trợ kết nối và giữ connection
        await mongoose.connect(DB_CONNECTION);
        console.log("connect tới database thành công")
        console.log("chuẩn bị start server")

        app.listen(SERVER_CONFIG.PORT, () => {
            console.log(`Server start thành công ${SERVER_CONFIG.PORT}`)
        })
    } catch (error) {
        console.log("error connect to database with error: " + error.message)
    }
}
main()