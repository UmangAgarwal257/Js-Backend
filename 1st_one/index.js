const express = require("express");
const app = express();
const port = 3000;

const users = [
  {
    name: "John",
    kidneys: [
      {
        healthy: false,
      },
    ],
  },
];

app.use(express.json());

console.log(users[0]);

app.get("/", function (req, res) {
  const johnKidneys = users[0].kidneys;
  const noOfKidneys = johnKidneys.length;
  let noofHealthyKidneys = johnKidneys.filter(
    (kidney) => kidney.healthy
  ).length;
  const noOfUnhealthyKidneys = noOfKidneys - noofHealthyKidneys;

  res.json({
    noOfKidneys,
    noofHealthyKidneys,
    noOfUnhealthyKidneys,
  });
});

app.post("/", function (req, res) {
  const isHealthy = req.body.isHealthy;
  users[0].kidneys.push({
    healthy: isHealthy,
  });
  res.json({
    msg: "Done!",
  });
});

app.put("/", function (req, res) {
  if (hasAtleastOneUnhealthyKidney()) {
    users[0].kidneys.forEach((kidneys) => {
      kidneys.healthy = true;
    });
    res.json({});
  } else {
    res.status(411).json({
      msg: "You have no unhealthy kidneys",
    });
  }
});

app.delete("/", function (req, res) {
  if (hasAtleastOneUnhealthyKidney()) {
    users[0].kidneys = users[0].kidneys.filter((kidney) => kidney.healthy);
    res.json({ msg: "done" });
  } else {
    res.status(411).json({
      msg: "You have no unhealthy kidneys",
    });
  }
});

function hasAtleastOneUnhealthyKidney() {
  let atleastOneUnhealthyKidney = false;
  for (let i = 0; i < users[0].kidneys.length; i++) {
    if (!users[0].kidneys[i].healthy) {
      atleastOneUnhealthyKidney = true;
    }
  }
  return atleastOneUnhealthyKidney;
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
