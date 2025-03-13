// components/BoardCover.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDrag } from "@use-gesture/react";

interface BoardCoverProps {
  initialImage?: string;
}

export default function BoardCover({ initialImage }: BoardCoverProps) {
  const [coverImage, setCoverImage] = useState(
    initialImage || "/default-cover.jpg"
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isTabOpen, setIsTabOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const coverRef = useRef<HTMLDivElement>(null);

  // Drag functionality for repositioning
  const bind = useDrag(({ offset: [x, y] }) => {
    setPosition({ x, y });
  });

  // Image upload handler with error handling
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file");
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        throw new Error("Image must be smaller than 5MB");
      }

      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
      setIsTabOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading image");
    } finally {
      setIsLoading(false);
    }
  };

  // Unsplash API integration via proxy endpoint
  const fetchUnsplashImage = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/unsplash");
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }
      const data = await response.json();
      setCoverImage(data.url);
      setIsTabOpen(false);
    } catch (err) {
      setError("Failed to fetch Unsplash image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCover = () => {
    setCoverImage("/default-cover.jpg");
    setPosition({ x: 0, y: 0 });
    setIsTabOpen(false);
  };

  return (
    <div className="relative w-full h-48 rounded-lg bg-blue-300">
      {/* Cover Image with drag functionality */}
      <div
        ref={coverRef}
        {...bind()}
        className="w-full h-full bg-cover bg-center rounded-lg relative overflow-hidden"
        style={{
          backgroundImage: `url(${coverImage})`,
          backgroundPosition: `${position.x}px ${position.y}px`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        )}

        {/* Hover Buttons */}
        {isHovered && !isTabOpen && (
          <div className="absolute top-2 left-2 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsTabOpen(true)}
            >
              Change Cover
            </Button>
            <Button variant="secondary" size="sm">
              Reposition
            </Button>
          </div>
        )}
      </div>

      {/* Change Cover Tabs */}
      {isTabOpen && (
        <div className="absolute top-0 left-0 w-full p-4 bg-background border rounded-lg shadow-lg">
          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}

          <Tabs defaultValue="gallery" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="link">Link</TabsTrigger>
                <TabsTrigger value="unsplash">Unsplash</TabsTrigger>
              </TabsList>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveCover}
                disabled={isLoading}
              >
                Remove
              </Button>
            </div>

            {/* Gallery Tab - Placeholder content */}
            <TabsContent value="gallery">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-20 bg-gray-200 rounded cursor-pointer hover:opacity-80"
                    onClick={() => {
                      setCoverImage(`/gallery-image-${item}.jpg`);
                      setIsTabOpen(false);
                    }}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Upload Tab */}
            <TabsContent value="upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded"
                disabled={isLoading}
              />
            </TabsContent>

            {/* Link Tab */}
            <TabsContent value="link">
              <input
                type="text"
                placeholder="Paste image URL"
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  setCoverImage(e.target.value);
                  setIsTabOpen(false);
                }}
                disabled={isLoading}
              />
            </TabsContent>

            {/* Unsplash Tab */}
            <TabsContent value="unsplash">
              <Button
                onClick={fetchUnsplashImage}
                disabled={isLoading}
                className="w-full"
              >
                Get Random Unsplash Image
              </Button>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
