import axios from "axios";

const API_URL = "http://localhost:3001/api/schools";

export const fetchSchoolsGeoJSON = async () => {
  const res = await axios.get(`${API_URL}/geojson`);
  return res.data;
};
