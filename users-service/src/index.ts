import "reflect-metadata";
import { initDataSources } from "./db/data-source";
import startServer from "./server/startServer";

console.log("🙋‍♂️ Hello from Job User Service !!!!!!!");

initDataSources().then(() => {
  console.log("💾 Data Source has been initialized!");
  startServer();
})
.catch((err : any) => {
  console.error("❌❌❌❌❌ Error during Data Source initialization", err);
});


