const handleRegister = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleRegister: handleRegister,
};
