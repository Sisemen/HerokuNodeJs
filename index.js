const express = require("express");
const dotenv = require('dotenv');
const app = express();
const { Sequelize, DataTypes, json } = require('sequelize');

dotenv.config();

app.listen(process.env.PORT, () => {
    console.log("server listening on", process.env.PORT);
});

app.use(express.json());

var sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING,
{
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const Person = sequelize.define('persons', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastname: {
      type: DataTypes.STRING
    },
    age: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false
});

(async () => {
  await sequelize.sync({alter: true});
});

app.get('/', (req, res) => {
  res.writeHead(200);
  res.write('Hello World!');

  res.end();
});

app.put('/registerPerson', (req, res) => {
  (async () => {
    var john = await Person.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age
    });
  
    console.log(john.toJSON());
    
    res.writeHead(200);
    res.write("Person has been created successfully.");
    res.end();
  })();
});

app.get('/persons', (req, res) => {
  (async () => {
    var persons = await Person.findAll();

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write(JSON.stringify(persons));

    res.end();
  })();
});