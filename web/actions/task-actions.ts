export const fetchTasks = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/projects/tasks`
  );
  return res.json();
};
