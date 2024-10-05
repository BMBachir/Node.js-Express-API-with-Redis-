const express = require("express");
const app = express();
const PORT = 3000;
const axios = require("axios");
const Redis = require("redis");

// Initialize the Redis client and connect
const redisClient = Redis.createClient();
redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect(); // Connect to the Redis server

const EXPIRE_TIME = 3600; // Cache expiration time in seconds

app.get("/", (req, res) => {
  res.send("Back-end is running..!");
});

app.get("/photos", async (req, res) => {
  try {
    // Attempt to get the data from Redis cache
    const cachedPhotos = await redisClient.get("photos");

    if (cachedPhotos) {
      // If cached data is available, return it
      console.log("Fetching data from Redis cache...");
      return res.json(JSON.parse(cachedPhotos));
    }

    // If no cached data, fetch it from the external API
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/photos"
    );

    // Store the fetched data in Redis and set an expiration time
    await redisClient.setEx("photos", EXPIRE_TIME, JSON.stringify(data));

    // Send the fresh data in response
    return res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
