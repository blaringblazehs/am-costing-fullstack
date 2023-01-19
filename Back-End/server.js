const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const md5 = require("md5"); //lib for randomising file names

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
    const { name, currentChunkIndex, totalChunks } = req.query;
    const firstChunk = parseInt(currentChunkIndex) === 0; //first chunk is 0
    const lastChunk = parseInt(currentChunkIndex) === parseInt(totalChunks) - 1; //last chunk n-1
    console.log(req.body);
    // res.send("good file is uploaded");
    const ext = name.split(".").pop();
    //the buffer we get it has some meta data on start which is comma saparated
    //so we are taking the secon [1] part by spliting with comma
    const data = req.body.toString().split(","[1]);
    const buffer = new Buffer.alloc(data);
    const tempFileName = "tmp_" + md5(name + req.ip) + "." + ext; //randomising file names
    if (firstChunk && fs.existsSync("./uploads/" + tempFileName))
        fs.unlinkSync("./uploads/" + tempFileName);
    fs.appendFileSync("./uploads/" + tempFileName, buffer);
    if (lastChunk) {
        const finalFilename = md5(Date.now()).substring(0, 6) + "." + ext;
        //for renaming file name after final chunk
        fs.renameSync("./uploads" + tempFileName, "./uploads" + finalFilename);
        res.json({ finalFilename });
    } else {
        res.send("ok");
    }
});

app.listen(4000, () => console.log("server started on port 4000"));
