"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import Image from "next/image";

interface UnsplashImage {
  id: string;
  url: string;
  thumb: string;
  description?: string;
}

interface UnsplashTabContentProps {
  onSelectImage: (url: string) => void;
}

export default function UnsplashTabContent({
  onSelectImage,
}: UnsplashTabContentProps) {
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
        : "/api/unsplash-images?random=true";
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

      // eslint-disable-next-line
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

  useEffect(() => {
    if (unsplashImages.length === 0) {
      fetchUnsplashImages();
    }
  }, [unsplashImages.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchQuery.trim()) {
      fetchUnsplashImages(searchQuery);
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}

      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            placeholder="Search Unsplash photos..."
            className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {/* eslint-disable-next-line */}
        {unsplashImages.map((image: any) => (
          <div
            key={image.id}
            className="relative h-32 rounded cursor-pointer hover:opacity-80 overflow-hidden"
            onClick={() => onSelectImage(image.url)}
          >
            <img
              src={image.thumb}
              alt={image.description || "Unsplash image"}
              className="w-full h-full object-cover"
              width={150}
              height={150}
            />
          </div>
        ))}
      </div>

      <Button
        onClick={() => fetchUnsplashImages(searchQuery || undefined)}
        disabled={isLoading}
        className="w-full mt-4"
        variant="outline"
      >
        Load More Photos
      </Button>
    </div>
  );
}
