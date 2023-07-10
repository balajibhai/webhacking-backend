const http = require("http");

http
  .createServer((req, res) => {
    res.write("Jai Shree ram!!!");
    res.end();
  })
  .listen(3000, () => console.log("Server running..."));
