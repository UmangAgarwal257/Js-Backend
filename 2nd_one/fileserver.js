const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();

app.get("/files/:fileName", function (req, res) {
  const fileName = req.params.fileName;
  console.log(fileName);
  const filePath = path.join(__dirname, fileName);
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err.message);
      res.status(404).json({ error: "File not found" });
      return;
    }
    console.log(data);
    res.json({
      data,
    });
  });
});

app.listen(3000);
