import "reflect-metadata";
import { initConnection } from "#root/db/connection";
require('dotenv').config()

console.log("🙋‍♂️ Hello from Job User Service !!!!!!!");

initConnection().then(()=>{
    console.log("🔗 Connected to DB");

}).catch(err => {
  console.error(err);
});


