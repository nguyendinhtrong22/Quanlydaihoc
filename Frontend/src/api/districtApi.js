import axios from "axios";

const API_URL = "http://localhost:3001/api/districts";

export const fetchDistrictsGeoJSON = async () => {
  const res = await axios.get(`${API_URL}/geojson`);
  return res.data;
};

export const fetchSchoolCountByDistrict = async () => {
  const res = await axios.get(`${API_URL}/school-count`);
  return res.data.data;
};