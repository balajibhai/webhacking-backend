const eventEmitter = require("events");

class MyEmitter extends eventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on("event", () => console.log("event hired"));

myEmitter.emit("event");
