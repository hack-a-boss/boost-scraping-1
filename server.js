require("dotenv").config();

const express = require("express");
const fs = require("fs/promises");
const scrape = require("./scraper");

const app = express();

app.use(express.static("./static"));

app.get("/links", async (req, res) => {
  const links = await fs.readFile("./links.json");

  res.send(JSON.parse(links));
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, async () => {
  setInterval(async () => {
    await scrape();
  }, 1000 * 60 * 5);

  await scrape();
  console.log("Servidor funcionando el puerto", PORT);
});
