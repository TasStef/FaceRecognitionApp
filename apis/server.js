import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";
import knex from "knex";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "123456",
    database: "smart-brain",
  },
});

const app = express();
const database = {
  users: [
    {
      id: "124",
      name: "John",
      email: "John@mail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "125",
      name: "Sally",
      email: "Sally@mail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
  console.log("App is running on 3000");
});

// Root
app.get("/", (req, res) => {
  res.send("It's working");
});

// Sign In
app.post("/signin", (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare(
    "apples",
    "$2a$10$L3YDwjALwUyk6Su5NRllPumsjl5xbO4iIF9B.CI5.Wl7Tn6rERTuO",
    function (err, res) {
      console.log("First response: ", res);
    }
  );
  bcrypt.compare(
    "veggies",
    "$2a$10$L3YDwjALwUyk6Su5NRllPumsjl5xbO4iIF9B.CI5.Wl7Tn6rERTuO",
    function (err, res) {
      console.log("First response: ", res);
    }
  );

  const email = req.body.email;

  if (
    email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("Wrong email or password");
  }
});

// Register
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  let passwordHashed;
  bcrypt.hash(password, null, null, function (err, hash) {
    passwordHashed = hash;
  });

  db("users")
    .returning("*")
    .insert({
      name: name,
      email: email,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => res.status(400).json(`Error in register: ${err}`)); //in prod this should be more cryptic "unable to register"
});

// Get Users
app.get("/users", (req, res) => {
  res.json(database);
});

// Profile
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;

  db.select("*")
    .from("users")
    .where({
      id,
    })
    .then((user) => {
      if (user.length) {
        res.json(user);
      } else {
        res.status(404).json(`No user with id: ${id}`);
      }
    })
    .catch((err) => res.status(400).json(`Error im /rpofile ${err}`));
});

//Image
app.put("/image", (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json(`Error at image: ${err}`));
});
