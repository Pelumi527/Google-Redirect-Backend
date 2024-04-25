const express = require("express");
const app = express();
const router = express.Router();
const fetch = require("node-fetch");
const port = 3000;



const YOUR_CLIENT_ID =
  "937805269615-nelng53mn7uukkcmb91pbhboj6cspr2h.apps.googleusercontent.com";

const YOUR_CLIENT_SECRET = "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";

async function signUp(code, res) {
  const url = `https://oauth2.googleapis.com/token?code=${code}&client_id=${YOUR_CLIENT_ID}&client_secret=${YOUR_CLIENT_SECRET}&redirect_uri=http://localhost:3000&grant_type=authorization_code`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log("data : ", data);

  // get the id token from the response
  const { id_token } = data;

  // verify the id token
  const verifyResponse = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
  );

  const verifyData = await verifyResponse.json();
  console.log("verifyData : ", verifyData);

  // get the user data from the verify data
  const { name, email, picture } = verifyData;

  // This res.send is the key to redirecting back to our expo go app.
  // ex: you have to enter your IP adress that is running your expo go application.
  res.send(
    `<script>window.location.replace(" exp://192.168.0.3:8081?email=${email}&name=${name}&id_token=${id_token}")</script>`
  );
}

router.get("/", async (req, res) => {
 console.log("req.query : ", req.query);

  // use the code to get the access token

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      error: "invalid code",
    });
  }

  signUp(code, res);

});



module.exports = router;

app.use(express.json());
app.use("/", router)

let server = app.listen(port, () => {
  console.log("listening at http://localhost:" + port);
});

