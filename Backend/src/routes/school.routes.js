import express from "express";
import {
    getSchools,
    getSchoolsGeoJSON
} from "../controller/school.controller.js";

const router = express.Router();

router.get("/", getSchools);
router.get("/geojson", getSchoolsGeoJSON);

export default router;