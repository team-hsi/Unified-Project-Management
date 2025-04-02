import { useState, useEffect, useCallback, useMemo } from "react";

// Custom Hook for Project Header utilities
const useProjectHeaderUtils = (users: { id: number; name: string; avatarUrl: string }[]) => {
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Debounce function
  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Handle search with debouncing (300ms delay)
  const handleSearch = useCallback(
    debounce((value: string) => {
      console.log("Searching for:", value);
    }, 300),
    []
  );

  // Memoize filtered users
  const filteredUsers = useMemo(() => users, [users]);

  return {
    isMobile,
    searchTerm,
    setSearchTerm,
    handleSearch,
    filteredUsers,
  };
};

export default useProjectHeaderUtils;
