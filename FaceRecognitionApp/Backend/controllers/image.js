// import Clarifai from "clarifai";

const image = {
  image: (req, res, db) => {
    const { id } = req.body;

    db("users")
      .where("id", id)
      .increment("entries", 1)
      .returning("entries")
      .then((entries) => {
        res.json(JSON.parse(entries[0].entries));
      })
      .catch((err) => res.status(400).json(`Error at image: ${err}`));
  },
  clarifai: (req, res) => {
    const PAT = "8f25c63151e74ac0bf4cbe13eb803f15";
    const USER_ID = "clarifai";
    const APP_ID = "main";
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
    const IMAGE_URL = req.body.imageURL;

    let raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    return fetch(
      "https://api.clarifai.com/v2/models/" +
        MODEL_ID +
        "/versions/" +
        MODEL_VERSION_ID +
        "/outputs",
      requestOptions
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response error!");
        }
        return response.json();
      })
      .then((result) => {
        return res.json(result);
      })
      .catch((err) => {
        return res.json(err);
      });
  },
};

export default image;
