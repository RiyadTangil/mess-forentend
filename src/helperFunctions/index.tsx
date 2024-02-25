import moment from "moment";

export const getMessInfoFromLocalHost = () => {
  const messInfoString = localStorage.getItem("messInfo");
  const messInfo = messInfoString ? JSON.parse(messInfoString) : {};

  return messInfo;
};
export const getToday = () => {
  let date = moment(new Date()).format("DD-MM-YYYY");
  // const today = new Date().toLocaleString().replace(/\//g, "-").split(",")[0];
  return date;
};
