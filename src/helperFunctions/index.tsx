export const getMessInfoFromLocalHost = () => {
  const messInfoString = localStorage.getItem("messInfo");
  const messInfo = messInfoString ? JSON.parse(messInfoString) : {};

  return messInfo;
};
export const getToday = () => {
  const today = new Date().toLocaleString().replace(/\//g, "-").split(",")[0];
  return today;
};
