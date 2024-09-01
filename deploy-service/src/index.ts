import {createClient,commandOptions} from "redis";
import { downloadS3Files, getAllFiles } from "./aws";
import { buildProject } from "./utils";
import path from "path";
import { uploadFile } from "./aws";

const subscriber = createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis'}:6379`
});
subscriber.connect();

const publisher = createClient({
  url: `redis://${process.env.REDIS_HOST || 'redis'}:6379`
});
publisher.connect();

async function main(){
    while(1){
      const res:any = await subscriber.brPop(
        commandOptions({ isolated: true}),
        "build-queue",
        0
      )
      const id = res.element;
      console.log(id);
      await downloadS3Files("output/"+id);
    
      await buildProject(id);
      const folderPath = path.join(__dirname, `output/${id}/dist`);
        const allFiles = getAllFiles(folderPath);
        allFiles.forEach(file => {
        uploadFile(`dist/${id}/` + file.slice(folderPath.length + 1), file);
        })
      console.log("Deployed");
      publisher.hSet("Status",id,"Deployed");
    }
}

main();