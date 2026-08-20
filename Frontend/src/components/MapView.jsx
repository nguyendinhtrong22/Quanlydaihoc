import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import schoolIconImg from "../assets/icons/school.png";
import { fetchSchoolsGeoJSON } from "../api/schoolApi";
import {
  fetchDistrictsGeoJSON,
  fetchSchoolCountByDistrict,
} from "../api/districtApi";

// 🎓 Icon trường
const schoolIcon = L.icon({
  iconUrl: schoolIconImg,
  iconSize: [22, 22],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28],
});

// Fix resize map
function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}

function MapView() {
  const [schoolData, setSchoolData] = useState(null);
  const [districtData, setDistrictData] = useState(null);
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const loadData = async () => {
      const schools = await fetchSchoolsGeoJSON();
      const districts = await fetchDistrictsGeoJSON();
      const countData = await fetchSchoolCountByDistrict();
      console.log("Data:", schools, districts, countData);
      // map count
      const countMap = {};
      countData.forEach((item) => {
        countMap[item.district_name] = Number(item.total_schools);
      });

      setSchoolData(schools);
      setDistrictData(districts);
      setCounts(countMap);
    };
    loadData();
  }, []);

  // 🎨 màu theo số trường
  const getColor = (total_schools) => {
    return total_schools > 20
      ? "#800026"
      : total_schools > 10
        ? "#BD0026"
        : total_schools > 5
          ? "#E31A1C"
          : total_schools > 0
            ? "#ebd93a"
            : "#8ff0b3";
  };

  // style quận
  const districtStyle = (feature) => {
    const district_name = feature.properties.district_name;
    const count = counts[district_name] || 0;

    return {
      fillColor: getColor(count),
      weight: 1,
      color: "white",
      fillOpacity: 0.6,
    };
  };

  // popup quận
  const onEachDistrict = (feature, layer) => {
    const district_name = feature.properties.district_name;
    const count = counts[district_name] || 0;

    layer.bindPopup(`
      <b>${district_name}</b><br/>
      Số trường: ${count}
    `);
  };

  // marker trường
  const pointToLayer = (feature, latlng) => {
    return L.marker(latlng, { icon: schoolIcon });
  };

  // popup trường
  const onEachSchool = (feature, layer) => {
    layer.bindPopup(`
      <b>${feature.properties.name}</b><br/>
      ${feature.properties.address}
    `);
  };

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <MapContainer
        // key={Date.now()}
        center={[21.0285, 105.8542]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
      >
        <ResizeMap />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🗺️ Layer quận */}
        {districtData && (
          <GeoJSON
            data={districtData}
            style={districtStyle}
            onEachFeature={onEachDistrict}
          />
        )}

        {/* 🎓 Layer trường */}
        {schoolData && (
          <GeoJSON
            data={schoolData}
            pointToLayer={pointToLayer}
            onEachFeature={onEachSchool}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default MapView;
