// /app/api/unsplash/route.ts
import axios from "axios";

const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";

export async function GET() {
  try {
    const res = await axios.get(UNSPLASH_API_URL, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
      params: {
        orientation: "landscape", // Ensures images fit cover well
        // Add more params as needed, e.g.:
        // query: "nature",
        // collections: "12345",
      },
    });

    // Log for debugging (remove in production if not needed)
    console.log("Unsplash response:", res.data);

    // Structure response to match what BoardCover expects
    const imageData = {
      url: res.data.urls.regular, // Required by BoardCover
      thumb: res.data.urls.thumb,
      description: res.data.description || "Unsplash Image",
      photographer: res.data.user.name,
      photographer_url: res.data.user.links.html,
    };

    return new Response(JSON.stringify(imageData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Optional: Add caching for better performance
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching Unsplash image:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Unsplash image" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
