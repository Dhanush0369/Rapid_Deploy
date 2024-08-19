import {S3} from "aws-sdk";
import fs from "fs";
import path from "path";

const s3 = new S3({
    accessKeyId: "28cc04cc25ebf7a76e0000811f95e8b4",
    secretAccessKey: "e91032aa213842333833351700bba1c30e490af87605dc97af78d7e889415929",
    endpoint: "https://4d1ec783bad1c616696abe541ec3e06c.r2.cloudflarestorage.com"
})

export async function downloadS3Files(prefix:string){
    const allFiles = await s3.listObjectsV2({
        Bucket: "rapiddeploy",
        Prefix: prefix
    }).promise();


    const allPromises = allFiles.Contents?.map(async ({Key})=> {
        return new Promise(async (resolve) => {
            if(!Key){
                resolve("");
                return;
            }
        console.log(Key);
        const finalOutputPath = path.join(__dirname,Key);
        const outputFile = fs.createWriteStream(finalOutputPath);
        const dirName = path.dirname(finalOutputPath);
        if(!fs.existsSync(dirName)){
            fs.mkdirSync(dirName, {recursive:true});
        }
        s3.getObject({
            Bucket: "rapiddeploy",
            Key
        }).createReadStream().pipe(outputFile).on("finish", () => {
            resolve("");
            })
        })
    }) || []

    console.log("awaiting");

    await Promise.all(allPromises?.filter(x => x!==undefined));
}   


export function getAllFiles(folderpath:string) {
    let response:string[] = [];
    const allfilesandfolder = fs.readdirSync(folderpath);
    allfilesandfolder.forEach((file) => {
        const fullpath = path.join(folderpath,file);
        if(fs.statSync(fullpath).isDirectory()){
            response = response.concat(getAllFiles(fullpath))
        }else{
            response.push(fullpath)
        }
    });

    return response;
}

export async function uploadFile(filename:string,filepath:string){
    const fileContent = fs.readFileSync(filepath);
    const response = await s3.upload({
        Bucket: "rapiddeploy",
        Body: fileContent,
        Key: filename
    }).promise();
    //console.log(response);
}
