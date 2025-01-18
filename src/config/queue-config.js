const amqplib = require("amqplib");
let channel, connection;
async function connectQueue() {
  try {
    connection = await amqplib.connect("amqp://localhost");
    channel = await connection.createChannel();
    await channel.assertQueue("noti-queue");
    // channel.sendToQueue("noti-queue", Buffer.from("one more 2"));
    // setInterval(() => {
    //   channel.sendToQueue("noti-queue", Buffer.from("this is me"));
    // }, 1000);
    // await channel.sendToQueue("Text-msg", Buffer.from("this is me"));
  } catch (error) {
    console.log(error);
  }
}
async function sendData(data) {
  if (typeof data !== "object") {
    console.error("Invalid data: Must be an object");
    return;
  }
  try {
    await channel.sendToQueue("noti-queue", Buffer.from(JSON.stringify(data)));
    console.log("Message sent successfully");
  } catch (error) {
    console.log("queue", error);
  }
}

module.exports = {
  connectQueue,
  sendData,
};
