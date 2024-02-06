export const getMessInfoFromLocalHost = () => {
  const messInfoString = localStorage.getItem("messInfo");
  const messInfo = messInfoString ? JSON.parse(messInfoString) : {};

  return messInfo;
};
