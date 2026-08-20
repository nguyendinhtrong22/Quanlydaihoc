import * as districtService from "../services/district.service.js";

// Get districts as GeoJSON
export const getDistrictsGeoJSON = async (req, res) => {
  try {
    const data = await districtService.getDistrictsGeoJSON();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get school count by district
export const getSchoolCountByDistrict = async (req, res) => {
  try {
    const data = await districtService.countSchoolsByDistrict();

    res.status(200).json({
      success: true,
      message: "Thống kê số trường theo quận thành công",
      data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};