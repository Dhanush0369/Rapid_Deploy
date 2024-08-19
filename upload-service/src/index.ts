import express from "express";
import cors from "cors";
import path from "path";
import { generate } from "./utils";
import simpleGit from "simple-git";
import { getAllFiles } from "./file";
import { upload } from "./aws";
import { createClient} from "redis"

const app = express();

const publisher = createClient();
publisher.connect();

const subscriber = createClient();
subscriber.connect();

app.use(cors())
app.use(express.json());


// POSTMAN
app.post("/deploy", async (req, res) => {
    const repoUrl = req.body.repoUrl;
    const id =generate();
    console.log(id);
    await simpleGit().clone(repoUrl,path.join(__dirname,'output/'+id));
    const response = getAllFiles(path.join(__dirname,'output/'+id));
    res.json({
        id: id
    })
    response.forEach((file)=>{
        console.log(file);
    })
    response.forEach(async (file) => {
        await upload(file.slice(__dirname.length+1),file);
    });

    await new Promise((resolve)=> setTimeout(resolve, 5000));

    await publisher.lPush("build-queue", id);
    await publisher.hSet('Status',id,"uploaded");
});

app.get("/status",async (req,res) => {
    const id = req.query.id;
    const response = await subscriber.hGet("Status",id as string);
    res.json({
        response:response
    })
})

app.listen(3000);