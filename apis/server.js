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

//! Root
app.get("/", (req, res) => {
  res.send("It's working");
});

//! Sign In
app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json(`Error within signin ${err}`));
      } else {
        return res.status(400).json("Wrong credentials");
      }
    })
    .catch((err) => res.status(400).json("Wrong credentials"));
});

//! Register
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;

  let hash = bcrypt.hashSync(password);

  // transaction allows for rollback in the Database if somethign goes wrong
  db.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            name: name,
            email: loginEmail[0].email,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user);
          })
          .catch((err) => res.status(400).json(`Error in register: ${err}`));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json(`Error in register: ${err}`)); //in prod this should be more cryptic "unable to register";
});

//! Get Users
app.get("/users", (req, res) => {
  db.select("*")
    .from("users")
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(404).json(`Error fetching users`));
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
