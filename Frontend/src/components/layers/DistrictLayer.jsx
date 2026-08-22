import { GeoJSON } from "react-leaflet";
import { useEffect, useState } from "react";
import {
  fetchDistrictsGeoJSON,
  fetchSchoolCountByDistrict,
} from "../../api/districtApi";
import { useMapContext } from "../../components/context/MapContext";

function DistrictLayer() {
  const [data, setData] = useState(null);
  const [counts, setCounts] = useState({});
  const { activeTool } = useMapContext();

  useEffect(() => {
    const load = async () => {
      const districts = await fetchDistrictsGeoJSON();
      const countData = await fetchSchoolCountByDistrict();
      const mapCount = {};
      countData.forEach((item) => {
        mapCount[item.district_name] = Number(item.total_schools);
      });

      setData(districts);
      setCounts(mapCount);
    };

    load();
  }, []);

  const getColor = (n) =>
    n > 5
      ? "#e92b2b"
      : n > 3
        ? "#155ada"
        : n > 2
          ? "#2bd11c"
          : n > 0
            ? "#ebd93a"
            : "#8ff0b3";

  const style = (feature) => {
    const name = feature.properties.district_name;
    const count = counts[name] || 0;

    return {
      fillColor: getColor(count),
      weight: 1,
      color: "white",
      fillOpacity: 0.6,
      interactive: activeTool === null,
    };
  };

  const onEach = (feature, layer) => {
    const name = feature.properties.district_name;
    const count = counts[name] || 0;

    if (activeTool !== null) return;

    layer.bindPopup(`<b>${name}</b><br/>Số trường: ${count}`);
  };

  if (!data) return null;

  return (
    <GeoJSON
      key={`district-${activeTool}`}
      data={data}
      style={style}
      onEachFeature={onEach}
    />
  );
}

export default DistrictLayer;
