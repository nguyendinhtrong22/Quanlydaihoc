import pool from "../config/db.js";
import { Readable } from "stream";

//Get all schools
export const getAllSchools = async () => {
  const query = `
     SELECT
      id,
      name,
      address,
      lat,
      lon
    FROM schools
    ORDER BY id ASC
  `;

  const result = await pool.query(query);
  return result.rows;
};

//Get schools as GeoJSON
export const getSchoolsGeoJSON = async () => {
  const query = `
    SELECT json_build_object(
      'type', 'FeatureCollection',
      'features', COALESCE(json_agg(
        json_build_object(
          'type', 'Feature',
          'geometry', ST_AsGeoJSON(s.geom)::json,
          'properties', json_build_object(
            'id', s.id,
            'name', s.name,
            'address', s.address,
            'lng', ST_X(s.geom),
            'lat', ST_Y(s.geom),
            'district_name', r."VARNAME_2"
          )
        )
      ), '[]'::json)
    ) AS geojson
    FROM schools s
    JOIN "Ranhgioi" r
      ON ST_Within(s.geom, r.geom)
  `;

  const result = await pool.query(query);
  return result.rows[0].geojson;
};
//Nearest route
export const getNearestSchool = async (lon, lat) => {
  const query = `
    SELECT 
      id,
      name,
      address,
      lat,
      lon,
      ST_Distance(
        geom::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      ) AS distance_m
    FROM schools
    ORDER BY geom <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)
    LIMIT 1
  `;

  const result = await pool.query(query, [lon, lat]);
  return result.rows[0];
};
//Schools in radius
export const getSchoolsInRadius = async (lon, lat, radius) => {
  const query = `
    SELECT
      id,
      name,
      address,
      lat,
      lon,
      ST_Distance(
        geom::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      ) AS distance_m
    FROM schools
    WHERE ST_DWithin(
      geom::geography,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
      $3
    )
    ORDER BY distance_m ASC
  `;

  const result = await pool.query(query, [lon, lat, radius]);
  return result.rows;
};
