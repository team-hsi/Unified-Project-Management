// components/BoardCover.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDrag } from "@use-gesture/react";
import { Image, Move, Search } from "lucide-react";

interface BoardCoverProps {
  initialImage?: string;
}

interface UnsplashImage {
  id: string;
  url: string;
  thumb: string;
  description?: string;
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
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [linkInput, setLinkInput] = useState("");
  const coverRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Drag functionality for repositioning
  const bind = useDrag(({ offset: [x, y] }) => {
    setPosition({ x, y });
  });

  // Close overlay when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node) &&
        coverRef.current &&
        !coverRef.current.contains(event.target as Node)
      ) {
        setIsTabOpen(false);
      }
    };

    if (isTabOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTabOpen]);

  // Initial Unsplash images fetch
  useEffect(() => {
    if (isTabOpen && unsplashImages.length === 0) {
      fetchUnsplashImages();
    }
  }, [isTabOpen]);

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

  // Unsplash API integration with improved error handling
  const fetchUnsplashImages = async (query?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = query
        ? `/api/unsplash-images?query=${encodeURIComponent(query)}`
        : "/api/unsplash-images";
      const response = await fetch(endpoint);

      console.log("Fetch response status:", response.status);
      console.log("Fetch response ok:", response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Raw API response:", JSON.stringify(data, null, 2));

      // Check for API-level errors in the response body
      if (data.error) {
        throw new Error(data.error);
      }

      // Ensure data is an array
      if (!Array.isArray(data)) {
        console.error("Expected an array but got:", data);
        throw new Error("Invalid response format: Expected an array");
      }

      const images = data.map((img: any) => ({
        id: img.id,
        url: img.url,
        thumb: img.thumb,
        description: img.description,
      }));

      console.log("Processed images:", JSON.stringify(images, null, 2));
      setUnsplashImages(images);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch Unsplash images"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveCover = () => {
    setCoverImage("/default-cover.jpg");
    setPosition({ x: 0, y: 0 });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchUnsplashImages(searchQuery);
    }
  };

  // Handle link submission
  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkInput.trim()) {
      setCoverImage(linkInput);
      setIsTabOpen(false);
      setLinkInput("");
    }
  };

  // Unsplash SVG Icon
  const UnsplashIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4"
    >
      <path
        d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"
        fill="currentColor"
      />
    </svg>
  );

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
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsTabOpen(true)}
            >
              <Image className="w-4 h-4 mr-2" />
              Change Cover
            </Button>
            <Button variant="secondary" size="sm">
              <Move className="w-4 h-4 mr-2" />
              Reposition
            </Button>
          </div>
        )}
      </div>

      {/* Change Cover Tabs */}
      {isTabOpen && (
        <div
          ref={overlayRef}
          className="absolute top-12 right-2 w-96 sm:w-112 lg:w-[768px] h-[448px] bg-background border rounded-lg shadow-lg p-4 max-w-full overflow-y-auto"
        >
          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}

          <Tabs defaultValue="gallery" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="link">Link</TabsTrigger>
                <TabsTrigger
                  value="unsplash"
                  className="flex items-center gap-2"
                >
                  <UnsplashIcon />
                  Unsplash
                </TabsTrigger>
              </TabsList>
              <span
                onClick={handleRemoveCover}
                className="text-sm text-gray-500 cursor-pointer px-6 sm:px-0 hover:text-black hover:bg-gray-100 hover:border hover:border-gray-300 hover:rounded hover:px-2 transition-all"
                aria-disabled={isLoading}
              >
                Remove
              </span>
            </div>

            {/* Gallery Tab */}
            <TabsContent value="gallery">
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
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
              <form onSubmit={handleLinkSubmit} className="space-y-2">
                <input
                  type="text"
                  placeholder="Paste image URL"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="w-full p-2 border rounded"
                  disabled={isLoading}
                />
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading || !linkInput.trim()}
                    className="w-48 !bg-black text-white hover:bg-gray-800 disabled:!bg-black disabled:opacity-50"
                  >
                    Submit
                  </Button>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Work with any image from the web.
                </p>
              </form>
            </TabsContent>

            {/* Unsplash Tab */}
            <TabsContent value="unsplash">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Unsplash photos..."
                    className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                </div>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {unsplashImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative h-32 rounded cursor-pointer hover:opacity-80 overflow-hidden"
                    onClick={() => {
                      setCoverImage(image.url);
                      setIsTabOpen(false);
                    }}
                  >
                    <img
                      src={image.thumb}
                      alt={image.description || "Unsplash image"}
                      className="w-full h-full object-cover"
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
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
