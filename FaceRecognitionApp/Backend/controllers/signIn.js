const signin = {
  signin: (req, res, db, bcrypt) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("Incorect form credentials");
    }

    db.select("email", "hash")
      .from("login")
      .where("email", "=", email)
      .then((data) => {
        const isValid = bcrypt.compareSync(password, data[0].hash);
        if (isValid) {
          return db
            .select("*")
            .from("users")
            .where("email", "=", email)
            .then((user) => {
              res.json(user[0]);
            })
            .catch((err) => res.status(400).json(`Error within signin ${err}`));
        } else {
          return res.status(400).json("Wrong credentials");
        }
      })
      .catch((err) => res.status(400).json("Wrong credentials"));
  },
};

export default signin;
