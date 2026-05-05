import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = "AIzaSyC00dN6JP9jKrk_7W95p101EjYGxouUeso";

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't understand.";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.json({ reply: "Server error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));