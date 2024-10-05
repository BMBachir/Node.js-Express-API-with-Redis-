const express = require("express");
const app = express();
const axios = require("axios");

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Back-end is running..!");
});

app.get("/photos", async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/photos"
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
