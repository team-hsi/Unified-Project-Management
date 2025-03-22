export const fetchProjects = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
  const res = await fetch(`${apiUrl}/projects`);
  return res.json();
};
