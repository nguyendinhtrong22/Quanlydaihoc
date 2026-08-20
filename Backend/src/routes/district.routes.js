import express from "express";
import {
  getDistrictsGeoJSON,
  getSchoolCountByDistrict
} from "../controller/district.controller.js";

const router = express.Router();

router.get("/geojson", getDistrictsGeoJSON);
router.get("/school-count", getSchoolCountByDistrict);

export default router;