const express = require("express");
const { expressjwt: jwt } = require("express-jwt");
const jwks = require("jwks-rsa");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(
  cors({
    origin: "http://localhost:3000", // Allow only this origin to access the resources
  })
);

const checkJwt = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://mshadhir.us.auth0.com/.well-known/jwks.json`,
  }),
  audience: "https://my-api/",
  issuer: `https://mshadhir.us.auth0.com/`,
  algorithms: ["RS256"],
});

app.get("/", (req, res) => {
  res.send(
    req.oidc
      ? req.oidc.isAuthenticated()
        ? "Logged in"
        : "Logged out"
      : "Auth not configured"
  );
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

app.get("/protectedapi", checkJwt, (req, res) => {
  res.json({ message: "Hello from the protected API!" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
