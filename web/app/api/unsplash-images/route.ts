/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const UNSPLASH_API_URL = "https://api.unsplash.com";
const PHOTOS_PER_PAGE = 12;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  try {
    let endpoint = `${UNSPLASH_API_URL}/photos/random`;
    let params: any = {
      count: PHOTOS_PER_PAGE,
      orientation: "landscape",
    };

    if (query) {
      endpoint = `${UNSPLASH_API_URL}/search/photos`;
      params = {
        query,
        per_page: PHOTOS_PER_PAGE,
        orientation: "landscape",
      };
    }

    const res = await axios.get(endpoint, {
      headers: {
        Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
      },
      params,
    });

    console.log("Raw Unsplash response:", JSON.stringify(res.data, null, 2));

    const images = query ? res.data.results : res.data;

    const imageData = images.map((img: any) => ({
      id: img.id,
      url: img.urls.regular,
      thumb: img.urls.thumb,
      description: img.description || img.alt_description || "Unsplash Image",
      photographer: img.user.name,
      photographer_url: img.user.links.html,
    }));

    console.log("Processed imageData:", JSON.stringify(imageData, null, 2));

    return new Response(JSON.stringify(imageData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching Unsplash images:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Unsplash images" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
