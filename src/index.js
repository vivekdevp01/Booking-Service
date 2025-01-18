const express = require("express");
// const amqplib = require("amqplib");
const { QueueConfig, ServerConfig } = require("./config");
const apiRoutes = require("./routes");

const CronJob = require("./utils/common/cron-jobs");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/bookingService/api", apiRoutes);
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, async () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  CronJob();
  await QueueConfig.connectQueue();
  console.log("Connected to RabbitMQ");
});
