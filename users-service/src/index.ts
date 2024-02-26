import "reflect-metadata";
import { initDataSources } from "./db/data-source";
require('dotenv').config()

console.log("🙋‍♂️ Hello from Job User Service !!!!!!!");

initDataSources().then(() => {
  console.log("💾 Data Source has been initialized!");
})
.catch((err : any) => {
  console.error("❌❌❌❌❌ Error during Data Source initialization", err);
});


