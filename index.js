import express from "express";
import "dotenv/config";
import logger from "./logger.js";
import morgan from "morgan";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
const morganFormat = ":method :url :status :response-time ms";


app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

let teaData = [];
let nextId = 1;
app.post("/tea", (req, res) => {
  const { name, price } = req.body;
  const newData = { id: nextId++, name, price };
  teaData.push(newData);
  res.status(200).send(newData);
});
app.get("/tea", (req, res) => {
  res.status(200).send(teaData);
});

app.get("/tea/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));

  if (!tea) {
    res.status(404).send("Tea not found ");
  } else {
    res.status(200).send(tea);
  }
});

app.put("/tea/:id", (req, res) => {
  const tea = teaData.find((t) => t.id === parseInt(req.params.id));
  if (!tea) {
    return res.status(404).send("Data not found");
  }
  const { name, price } = req.body;
  tea.name = name;
  tea.price = price;
  res.status(200).send(tea);

  console.log("updated");
});

app.delete("/tea/:id", (req, res) => {
  const index = teaData.findIndex((t) => t.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(400).send("Tea not found");
  }
  teaData.splice(index, 1);
  return res.status(200).send(`deleted ${teaData}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port} ...`);
});
