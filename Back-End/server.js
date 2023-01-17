const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(bodyParser.raw({ type: "application/octet-stream", limit: "100mb" }));

// app.post("/uploads", (req, res) => {
//   const { name, size, currentChunkIndex, totalChunks } = req.query;
//   //check the extension of the file
//   const ext = name.split(".").pop(); //test.stl
//   console.log(req.body);
//   res.send("ok");
// });

app.post("/uploads", (req, res) => {
  res.send("good file is uploaded");
  console.log(req.body);
});

app.listen(4000, () => console.log("server started on port 4000"));
