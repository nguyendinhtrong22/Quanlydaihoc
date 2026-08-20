import pool from "../config/db.js";

// Get districts as GeoJSON
export const getDistrictsGeoJSON = async () => {
  const query = `
    SELECT json_build_object(
      'type', 'FeatureCollection',
      'features', COALESCE(json_agg(
        json_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(geom)::json,
          'properties', json_build_object(
            'id', id,
            'district_name', "NAME_2"
          )
        )
      ), '[]'::json)
    ) AS geojson
    FROM "Ranhgioi"
  `;

  const result = await pool.query(query);
  return result.rows[0].geojson;
};

// Get school count by district
export const countSchoolsByDistrict = async () => {
  const query = `
    SELECT
      d."NAME_2" AS district_name,
      COUNT(s.*) AS total_schools
    FROM "Ranhgioi" d
    LEFT JOIN schools s
      ON ST_Within(s.geom, d.geom)
    GROUP BY d."NAME_2"
    ORDER BY total_schools DESC
  `;

  const result = await pool.query(query);
  return result.rows;
};