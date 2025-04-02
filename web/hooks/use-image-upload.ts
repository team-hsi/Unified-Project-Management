// useImageUpload.ts
import { useState } from "react";

export const useImageUpload = (initialImage: string = "/default-cover.jpg") => {
  const [coverImage, setCoverImage] = useState(initialImage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      return true; // Success indicator
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading image");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { coverImage, setCoverImage, isLoading, error, handleImageUpload };
};
