// "use server";
export const fetchTasks = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV;
  try {
    const res = await fetch(`${apiUrl}/api/projects/tasks`);
    if (!res.ok) {
      throw new Error(`Error fetching tasks: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const fetchTaskByID = async (id: string) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_DEV;
  try {
    const res = await fetch(`${apiUrl}/api/task/${id}`);
    if (!res.ok) {
      throw new Error(`Error fetching task: ${res.statusText}`);
    }
    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
