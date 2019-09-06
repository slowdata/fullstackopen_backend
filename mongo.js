const mongoose = require("mongoose");

const Person = require("./models/person");

if (process.argv.length < 3) {
  console.info("give the password as argument");
  process.exit(1);
}

const password = process.argv[2];

const mongoURL = `mongodb+srv://fullstack:${password}@cluster0-y3dr8.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(mongoURL, { useNewUrlParser: true });

if (process.argv.length === 3) {
  Person.find({}).then(persons => {
    console.log("phonebook:");
    persons.forEach(p => {
      console.log(p.name, p.number);
    });
    mongoose.connection.close();
  });
} else {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({
    name: name,
    date: new Date(),
    number: number
  });
  person
    .save()
    .then(result => {
      console.log(`added ${name} number ${number} to phonebook`);
      mongoose.connection.close();
    })
    .catch(err => console.error(err));
}
