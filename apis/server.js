import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt-nodejs";
import cors from "cors";

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
  database.users.push({
    id: 126,
    name: name,
    email: email,
    password: passwordHashed,
    entries: 0,
    joined: new Date(),
  });
  res.status(201).json(database.users.at(-1));
});

// Get Users
app.get("/users", (req, res) => {
  res.json(database);
});

// Profile
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });

  if (!found) {
    res.status(400).json("No such user");
  }
});

//Image
app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;

  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });

  if (!found) {
    res.status(400).json("No such user");
  }
});
