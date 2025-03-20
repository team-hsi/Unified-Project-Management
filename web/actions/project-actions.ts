export const fetchProjects = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`);
  return res.json();
};
