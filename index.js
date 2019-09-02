const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const db = require("./db");

morgan.token("body", (req, res) => req.body && JSON.stringify(req.body));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(bodyParser.json());
app.use(cors());

const getMaxId = () => Math.max(...db.persons.map(p => p.id)) + 1;

app.get("/api/persons", (req, res) => {
  res.send(db.persons);
});

app.post("/api/persons", (req, res) => {
  if (!req.body.name) return res.status(400).send({ message: "Bad request" });

  const person = {
    name: req.body.name,
    number: req.body.number,
    id: getMaxId()
  };
  db.persons = db.persons.concat(person);
  res.send(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});
