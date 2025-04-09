// "use client";

// import { useState } from "react";

// type TaskLabel = "Bug" | "Feature" | "Enhancement" | "Documentation" | null;

// interface TaskLabels {
//   [taskId: string]: TaskLabel;
// }

// export const useTaskLabels = () => {
//   const [taskLabels, setTaskLabels] = useState<TaskLabels>({});

//   const setLabel = (taskId: string, label: TaskLabel) => {
//     setTaskLabels((prev) => ({
//       ...prev,
//       [taskId]: label,
//     }));
//   };

//   const getLabel = (taskId: string): TaskLabel => {
//     return taskLabels[taskId] || null;
//   };

//   return { setLabel, getLabel };
// };
