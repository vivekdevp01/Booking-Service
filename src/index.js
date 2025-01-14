const express = require("express");

const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");
const CronJob = require("./utils/common/cron-jobs");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/bookingService/api", apiRoutes);
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  CronJob();
});
