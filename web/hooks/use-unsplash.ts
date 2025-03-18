// useUnsplash.ts
import { useState } from "react";

interface UnsplashImage {
  id: string;
  url: string;
  thumb: string;
  description?: string;
}

export const useUnsplash = () => {
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUnsplashImages = async (query?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = query
        ? `/api/unsplash-images?query=${encodeURIComponent(query)}`
        : "/api/unsplash-images";
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: Expected an array");
      }

      //eslint-disable-next-line
      const images = data.map((img: any) => ({
        id: img.id,
        url: img.url,
        thumb: img.thumb,
        description: img.description,
      }));

      setUnsplashImages(images);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch Unsplash images"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    unsplashImages,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    fetchUnsplashImages,
  };
};
