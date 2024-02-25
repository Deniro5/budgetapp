export const getFirstPath = () => {
  const currentPath = window.location.pathname;
  // Extract the first part of the path after the '/'
  const firstPath = currentPath.split("/")[1];
  return firstPath;
};
