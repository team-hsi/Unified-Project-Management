"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BoardCoverProps {
  initialImage?: string;
}

export default function BoardCover({ initialImage }: BoardCoverProps) {
  const [coverImage, setCoverImage] = useState(
    initialImage || "/default-cover.jpg"
  );
  const [isHovered, setIsHovered] = useState(false);
  const [isTabOpen, setIsTabOpen] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCoverImage(imageUrl);
      setIsTabOpen(false);
    }
  };

  const handleRemoveCover = () => {
    setCoverImage("/default-cover.jpg");
    setIsTabOpen(false);
  };

  return (
    <div className="relative w-full h-48 bg-blue-400 rounded-lg">
      {/* Cover Image */}
      <div
        className="w-full h-full bg-cover bg-center rounded-lg"
        style={{ backgroundImage: `url(${coverImage})` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
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
              >
                Remove
              </Button>
            </div>

            <TabsContent value="gallery">
              <div className="grid grid-cols-3 gap-2">
                {/* Add gallery images here */}
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="h-20 bg-gray-200 rounded cursor-pointer"
                    onClick={() => {
                      setCoverImage(`/gallery-image-${item}.jpg`);
                      setIsTabOpen(false);
                    }}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded"
              />
            </TabsContent>

            <TabsContent value="link">
              <input
                type="text"
                placeholder="Paste image URL"
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  setCoverImage(e.target.value);
                  setIsTabOpen(false);
                }}
              />
            </TabsContent>

            <TabsContent value="unsplash">
              <div className="text-center">
                Unsplash integration would go here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
