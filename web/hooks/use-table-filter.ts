// "use client";

// import { useState, useMemo } from "react";
// import { Task } from "@/components/list/columns"; // Adjust path based on your setup

// export const useTableFilter = (initialData: Task[]) => {
//   const [searchQuery, setSearchQuery] = useState("");

//   const filteredData = useMemo(() => {
//     console.log("Search Query:", searchQuery); // Debug: Log the search query
//     console.log("Initial Data:", initialData); // Debug: Log the initial data

//     if (!searchQuery.trim()) {
//       console.log("No search query, returning all data:", initialData);
//       return initialData;
//     }

//     // Split the search query into words (case-insensitive)
//     const searchWords = searchQuery
//       .toLowerCase()
//       .trim()
//       .split(/\s+/)
//       .filter((word) => word.length > 0);

//     console.log("Search Words:", searchWords); // Debug: Log the search words

//     const filtered = initialData.filter((task) => {
//       // Split the title into words (case-insensitive)
//       const titleWords = task.title
//         .toLowerCase()
//         .trim()
//         .split(/\s+/)
//         .filter((word) => word.length > 0);

//       console.log(`Task Title: "${task.title}", Title Words:`, titleWords); // Debug: Log the title and its words

//       // Check if any search word matches any title word
//       const matches = searchWords.some((searchWord) =>
//         titleWords.some((titleWord) => titleWord.includes(searchWord))
//       );

//       console.log(`Task Title: "${task.title}", Matches: ${matches}`); // Debug: Log whether this task matches
//       return matches;
//     });

//     console.log("Filtered Data:", filtered); // Debug: Log the filtered data
//     return filtered;
//   }, [initialData, searchQuery]);

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const newQuery = event.target.value;
//     console.log("New Search Query:", newQuery); // Debug: Log the new query
//     setSearchQuery(newQuery);
//   };

//   return { filteredData, searchQuery, handleSearchChange };
// };
