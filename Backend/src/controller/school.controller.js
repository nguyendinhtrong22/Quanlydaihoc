import * as schoolService from "../services/school.service.js";

//Get all schools
export const getSchools = async (req, res) => {
  try {
    const data = await schoolService.getAllSchools();

    res.status(200).json({
      success: true,
      message: "Lấy danh sách trường thành công",
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

//Get schools as GeoJSON
export const getSchoolsGeoJSON = async (req, res) => {
  try {
    const data = await schoolService.getSchoolsGeoJSON();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};