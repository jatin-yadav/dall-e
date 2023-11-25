import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);
const router = express.Router();

router
  .route("/")
  .get((req, res) => {
    res.send("Hello from DALL-E!");
  })
  .post(async (req, res) => {
    try {
      const { prompt } = req.body;

      const aiResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      });

      const image = aiResponse.data[0].b64_json;

      res.status(200).json({ photo: image });
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // Handle rate limit error
        console.error("Rate limit exceeded. Waiting and retrying...");
        res.status(500).send("Rate limit exceeded retry...");
      } else {
        // Handle other errors
        console.error(
          "Error making request to OpenAI image API:",
          error.message
        );
        console.log(error);
        res.status(500).send(error?.response.data.error.message);
      }
    }
  });

export default router;

/*
import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
  const image = await openai.images.generate({ model: "dall-e-3", prompt: "A cute baby sea otter" });

  console.log(image.data);
}
main();
*/
