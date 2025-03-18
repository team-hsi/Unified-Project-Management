"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Move, Edit, Search } from "lucide-react";
import { useImageDrag } from "@/hooks/use-image-drag";
import { useImageUpload } from "@/hooks/use-image-upload";
import { useUnsplash } from "@/hooks/use-unsplash";
import { useOverlay } from "@/hooks/use-overlay";
import Image from "next/image";

interface BoardCoverProps {
  initialImage?: string;
}

const galleryImages = {
  "Color & Gradient": [
    "/images/gradient1.jpg",
    "/images/gradient2.jpg",
    "/images/gradient3.jpg",
  ],
  "James Webb Telescope": [
    "/images/jwt1.jpg",
    "/images/jwt2.jpg",
    "/images/jwt3.jpg",
  ],
  "NASA Archive": [
    "/images/nasa1.jpg",
    "/images/nasa2.jpg",
    "/images/nasa3.jpg",
  ],
  "The MET Museum - Patterns": [
    "/images/met-pattern1.jpg",
    "/images/met-pattern2.jpg",
  ],
  Rijksmuseum: ["/images/rijks1.jpg", "/images/rijks2.jpg"],
  "The MET Museum - Japanese Print": [
    "/images/japanese1.jpg",
    "/images/japanese2.jpg",
  ],
};

export default function BoardCover({ initialImage }: BoardCoverProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTabOpen, setIsTabOpen] = useState(false);
  const [linkInput, setLinkInput] = useState("");

  const { position, bind, resetPosition } = useImageDrag();
  const {
    coverImage,
    setCoverImage,
    isLoading: uploadLoading,
    error: uploadError,
    handleImageUpload,
  } = useImageUpload(initialImage);
  const {
    unsplashImages,
    isLoading: unsplashLoading,
    error: unsplashError,
    searchQuery,
    setSearchQuery,
    fetchUnsplashImages,
  } = useUnsplash();
  const coverRef = useOverlay(isTabOpen, () => setIsTabOpen(false));
  const overlayRef = useOverlay(isTabOpen, () => setIsTabOpen(false));

  const isLoading = uploadLoading || unsplashLoading;
  const error = uploadError || unsplashError;

  const handleRemoveCover = () => {
    setCoverImage("/default-cover.jpg");
    resetPosition();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchUnsplashImages(searchQuery);
    }
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (linkInput.trim()) {
      setCoverImage(linkInput);
      setIsTabOpen(false);
      setLinkInput("");
    }
  };

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
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        )}

        {isHovered && !isTabOpen && (
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsTabOpen(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Change Cover
            </Button>
            <Button variant="secondary" size="sm">
              <Move className="w-4 h-4 mr-2" />
              Reposition
            </Button>
          </div>
        )}
      </div>

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

            <TabsContent value="gallery">
              <div className="space-y-4 p-4 bg-white">
                {Object.entries(galleryImages).map(([category, images]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-2">{category}</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                      {images.map((src, index) => (
                        <Image
                          key={index}
                          src={src}
                          width={150}
                          height={150}
                          alt={category}
                          className="h-20 w-full object-cover rounded cursor-pointer hover:opacity-80 border border-gray-300"
                          onClick={() => setCoverImage(src)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload">
              <div className="space-y-2">
                <label htmlFor="file-upload" className="block">
                  <Button
                    asChild
                    disabled={isLoading}
                    className="w-full bg-white text-black border border-black hover:bg-gray-200 disabled:bg-white disabled:opacity-50"
                  >
                    <span>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={isLoading}
                      />
                      Upload File
                    </span>
                  </Button>
                </label>
                <p className="text-sm text-gray-500 text-center">
                  Images wider than 1500 pixels work best
                </p>
              </div>
            </TabsContent>

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
                  Works with any image from the web.
                </p>
              </form>
            </TabsContent>

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
                {/* eslint-disable-next-line */}
                {unsplashImages.map((image: any) => (
                  <div
                    key={image.id}
                    className="relative h-32 rounded cursor-pointer hover:opacity-80 overflow-hidden"
                    onClick={() => {
                      setCoverImage(image.url);
                      setIsTabOpen(false);
                    }}
                  >
                    <Image
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
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
