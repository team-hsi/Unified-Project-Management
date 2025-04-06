export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Low":
      return {
        badgeBg: "bg-gray-50  text-gray-800",
      };
    case "Medium":
      return {
        badgeBg: "bg-cyan-50  text-cyan-800",
      };
    case "High":
      return {
        badgeBg: "bg-red-50  text-red-800",
      };
    default:
      return {
        badgeBg: "bg-gray-50 text-gray-800",
      };
  }
};

export const getStatusStyles = (statusId: string) => {
  switch (statusId) {
    case "to-do":
    case "not-started":
      return {
        border: "border-gray-400",
        bg: "dark:bg-[#FFFFFF08] bg-[#F8F8F7]",
        text: "text-gray-700",
        dot: "bg-gray-400",
      };
    case "in-progress":
    case "doing":
      return {
        border: "border-blue-400",
        bg: "bg-[#337EA914]",
        text: "text-blue-700",
        dot: "bg-blue-400",
      };
    case "completed":
    case "done":
      return {
        border: "border-green-400",
        bg: "bg-[#2d996414]",
        text: "text-green-700",
        dot: "bg-green-400",
      };
    default:
      return {
        border: "border-gray-400",
        bg: "bg-gray-100",
        text: "text-gray-700",
        dot: "bg-gray-400",
      };
  }
};
