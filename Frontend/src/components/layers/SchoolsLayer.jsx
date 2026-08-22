import { useEffect, useState, useMemo } from "react";
import { GeoJSON, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

import schoolIconImg from "../../assets/icons/school.png";
import highlightIconImg from "../../assets/icons/school.png";
import { fetchSchoolsGeoJSON } from "../../api/schoolApi";
import { useMapContext } from "../../components/context/MapContext";
import "../../assets/css/SchoolsLayer.css";
function SchoolsLayer() {
  const [data, setData] = useState(null);
  const map = useMap();

  const { zoomLevel, searchText, selectedDistrict, setSchoolsData } =
    useMapContext();

  useEffect(() => {
    fetchSchoolsGeoJSON().then((schoolsData) => {
      setData(schoolsData);
      setSchoolsData(schoolsData);
    });
  }, []);

  // NORMALIZE XỊN (fix toàn bộ tiếng Việt)
  const normalize = (str) =>
    str
      ?.toLowerCase()
      .replace(/đ/g, "d")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/quan|huyen|thi xa|tp\.?/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();

  // FUZZY MATCH (tìm thông minh)
  const matchText = (text, keyword) => {
    if (!keyword) return true;
    return normalize(text).includes(normalize(keyword));
  };

  //  ICON (highlight nếu match search)
  const getIcon = (isMatch) => {
    const size = zoomLevel >= 12 ? 38 : 32;

    return L.icon({
      iconUrl: isMatch ? highlightIconImg : schoolIconImg,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      className: "red-marker",
    });
  };

  const filteredData = useMemo(() => {
    if (!data) return null;

    const features = data.features.filter((f) => {
      const props = f.properties || {};

      const district =
        props.district_name || props.district || props.quan || "";

      // search đa trường
      const matchName =
        matchText(props.name, searchText) ||
        matchText(props.address, searchText) ||
        matchText(district, searchText);

      // filter quận
      const matchDistrict =
        !selectedDistrict ||
        normalize(district).includes(normalize(selectedDistrict));

      return matchName && matchDistrict;
    });

    return {
      ...data,
      features,
    };
  }, [data, searchText, selectedDistrict]);

  // AUTO ZOOM khi chỉ có 1 kết quả
  useEffect(() => {
    if (!filteredData || filteredData.features.length !== 1) return;

    const f = filteredData.features[0];
    const [lng, lat] = f.geometry.coordinates;

    map.setView([lat, lng], 16);
  }, [filteredData, map]);

  // render marker
  const pointToLayer = (feature, latlng) => {
    const isMatch = matchText(feature.properties?.name, searchText);

    return L.marker(latlng, {
      icon: getIcon(isMatch),
    });
  };

  // popup + click zoom
  const onEachFeature = (feature, layer) => {
    const props = feature.properties || {};

    layer.bindPopup(`
      <b>${props.name || "Không tên"}</b><br/>
      ${props.address || ""}
    `);

    // click zoom
    layer.on("click", () => {
      if (searchText) {
        layer._map.setView(layer.getLatLng(), 17);
      }
    });

    if (zoomLevel >= 12) {
      layer.bindTooltip(props.name || "", {
        permanent: true,
        direction: "right",
        offset: [12, -12],
      });
    }
  };

  if (!filteredData || zoomLevel < 11) return null;

  function ClosePopupOnClick() {
    useMapEvents({
      click(e) {
        // nếu click KHÔNG phải marker thì đóng popup
        if (!e.originalEvent.target.closest(".leaflet-marker-icon")) {
          e.target.closePopup();
        }
      },
    });
    return null;
  }
  return (
    <>
      <ClosePopupOnClick />

      <GeoJSON
        key={`school-${zoomLevel}-${searchText}-${selectedDistrict}`}
        data={filteredData}
        pointToLayer={pointToLayer}
        onEachFeature={onEachFeature}
      />
    </>
  );
}

export default SchoolsLayer;
