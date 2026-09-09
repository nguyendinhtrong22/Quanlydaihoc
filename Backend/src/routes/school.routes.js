import express from "express";
import {
    getSchools,
    getSchoolsGeoJSON,
    getNearestSchool,
    getSchoolsInRadius
} from "../controller/school.controller.js";

const router = express.Router();

router.get("/", getSchools);
router.get("/geojson", getSchoolsGeoJSON);
router.get("/nearest", getNearestSchool);
router.get("/in-radius", getSchoolsInRadius);

export default router;