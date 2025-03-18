"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Move, Edit } from "lucide-react";
import { useImageDrag } from "@/hooks/use-image-drag";
import { useImageUpload } from "@/hooks/use-image-upload";
import Image from "next/image";
import UnsplashTabContent from "./UnsplashTabContent";

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
  const [activeTab, setActiveTab] = useState("gallery");
  const [linkInput, setLinkInput] = useState("");
  const [isRepositioning, setIsRepositioning] = useState(false);
  const [savedPosition, setSavedPosition] = useState({ x: 0, y: 0 }); // Persist position

  const { position, bind, resetPosition } = useImageDrag(); // Removed setPosition
  const {
    coverImage,
    setCoverImage,
    isLoading: uploadLoading,
    error: uploadError,
    handleImageUpload,
  } = useImageUpload(initialImage);
  const coverRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const repositionButtonRef = useRef<HTMLButtonElement>(null);

  const isLoading = uploadLoading;
  const error = uploadError;

  // Manual click-outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        overlayRef.current &&
        !overlayRef.current.contains(event.target as Node)
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

  const handleRemoveCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverImage("/default-cover.jpg");
    resetPosition();
    setSavedPosition({ x: 0, y: 0 });
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (linkInput.trim()) {
      setCoverImage(linkInput);
      setIsTabOpen(false);
      setLinkInput("");
      resetPosition();
      setSavedPosition({ x: 0, y: 0 });
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

  const handleReposition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRepositioning(true);
  };

  const handleSavePosition = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPosition({ x: position.x, y: position.y }); // Save the dragged position
    setIsRepositioning(false);
  };

  const handleCancelReposition = (e: React.MouseEvent) => {
    e.stopPropagation();
    resetPosition(); // Reset drag state to 0,0, but UI will use savedPosition
    setIsRepositioning(false);
  };

  const handleChangeCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsTabOpen(true);
  };

  // Use savedPosition when not repositioning, position when dragging
  const displayPosition = isRepositioning ? position : savedPosition;

  return (
    <div className="relative w-full h-48 rounded-lg bg-blue-300">
      <div
        ref={coverRef}
        {...(isRepositioning ? bind() : {})} // Only bind drag handlers when repositioning
        className="w-full h-full bg-cover bg-center rounded-lg relative overflow-hidden"
        style={{
          backgroundImage: `url(${coverImage})`,
          backgroundPosition: `${displayPosition.x}px ${displayPosition.y}px`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
          </div>
        )}

        {isHovered && !isTabOpen && !isRepositioning && (
          <div className="absolute top-2 right-2 flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleChangeCover}>
              <Edit className="w-4 h-4 mr-2" />
              Change Cover
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleReposition}
              ref={repositionButtonRef}
            >
              <Move className="w-4 h-4 mr-2" />
              Reposition
            </Button>
          </div>
        )}

        {isRepositioning && (
          <div className="absolute top-2 right-2 flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleSavePosition}>
              Save Position
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCancelReposition}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {isTabOpen && (
        <div
          ref={overlayRef}
          className="absolute top-12 right-2 w-96 sm:w-112 lg:w-[768px] h-[448px] bg-background border rounded-lg shadow-lg p-4 max-w-full overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger
                  value="gallery"
                  onClick={(e) => e.stopPropagation()}
                >
                  Gallery
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  onClick={(e) => e.stopPropagation()}
                >
                  Upload
                </TabsTrigger>
                <TabsTrigger value="link" onClick={(e) => e.stopPropagation()}>
                  Link
                </TabsTrigger>
                <TabsTrigger
                  value="unsplash"
                  onClick={(e) => e.stopPropagation()}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setCoverImage(src);
                            setIsTabOpen(false);
                            resetPosition();
                            setSavedPosition({ x: 0, y: 0 });
                          }}
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
                  onClick={(e) => e.stopPropagation()}
                  className="w-full p-2 border rounded"
                  disabled={isLoading}
                />
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading || !linkInput.trim()}
                    className="w-48 !bg-black text-white hover:bg-gray-800 disabled:!bg-black disabled:opacity-50"
                    onClick={(e) => e.stopPropagation()}
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
              <UnsplashTabContent
                onSelectImage={(url) => {
                  setCoverImage(url);
                  setIsTabOpen(false);
                  resetPosition();
                  setSavedPosition({ x: 0, y: 0 });
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
