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
// Get nearest school
export const getNearestSchool = async (req, res) => {
  try {
    const { lon, lat, lng } = req.query;

    const lonNum = Number(lon || lng);
    const latNum = Number(lat);

    if (Number.isNaN(lonNum) || Number.isNaN(latNum)) {
      return res.status(400).json({
        message: "Tọa độ không hợp lệ"
      });
    }

    const data = await schoolService.getNearestSchool(lonNum, latNum);

    if (!data) {
      return res.status(404).json({
        message: "Không tìm thấy trường"
      });
    }

    res.json(data);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
//Get schools in radius
export const getSchoolsInRadius = async (req, res) => {
  try {
    const { lon, lat, radius } = req.query;

    if (!lon || !lat || !radius) {
      return res.status(400).json({
        success: false,
        message: "Thiếu lon, lat hoặc radius"
      });
    }

    const lonNum = Number(lon);
    const latNum = Number(lat);
    const radiusNum = Number(radius);

    if (
      Number.isNaN(lonNum) ||
      Number.isNaN(latNum) ||
      Number.isNaN(radiusNum)
    ) {
      return res.status(400).json({
        success: false,
        message: "lon, lat hoặc radius không hợp lệ"
      });
    }

    if (radiusNum <= 0) {
      return res.status(400).json({
        success: false,
        message: "radius phải lớn hơn 0"
      });
    }

    const data = await schoolService.getSchoolsInRadius(
      lonNum,
      latNum,
      radiusNum
    );

    res.status(200).json({
      success: true,
      message: "Lấy danh sách trường trong bán kính thành công",
      total: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
