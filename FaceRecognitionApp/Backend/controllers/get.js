const get = {
  users: (req, res, db) => {
    db.select("*")
      .from("users")
      .then((data) => {
        res.json(data);
      })
      .catch((err) => res.status(404).json(`Error fetching users`));
  },
  profile: (req, res, db) => {
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
  },
};

export default get;
