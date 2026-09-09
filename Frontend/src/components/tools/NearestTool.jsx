import { useMapEvents, Marker, Popup, GeoJSON } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import axios from "axios";
import { useMapContext } from "../../components/context/MapContext";

const highlightIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

function NearestTool() {
  const { activeTool } = useMapContext();
  const [nearest, setNearest] = useState(null);
  const [clickPos, setClickPos] = useState(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const map = useMapEvents({});
  const routeLayerRef = useRef(null); // <-- giữ tham chiếu layer GeoJSON

  useEffect(() => {
    if (activeTool !== "nearest") {
      setNearest(null);
      setClickPos(null);
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }
      setRouteGeoJSON(null);
    }
  }, [activeTool, map]);

  useMapEvents({
    click: async (e) => {
      if (activeTool !== "nearest") return;

      const { lat, lng } = e.latlng;
      setClickPos([lat, lng]);

      try {
        const res = await axios.get(
          "http://localhost:3001/api/schools/nearest",
          {
            params: { lat, lon: lng },
          },
        );
        const data = res.data;
        setNearest({ ...data, lng: data.lon });

        // Xóa layer route cũ nếu có
        if (routeLayerRef.current) {
          map.removeLayer(routeLayerRef.current);
          routeLayerRef.current = null;
        }

        // Gọi OSRM API lấy GeoJSON route mới
        const osrmRes = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${lng},${lat};${data.lon},${data.lat}?geometries=geojson`,
        );

        if (osrmRes.data.routes && osrmRes.data.routes.length > 0) {
          const geojson = osrmRes.data.routes[0].geometry;
          const layer = L.geoJSON(geojson, { color: "red", weight: 5 }).addTo(
            map,
          );
          routeLayerRef.current = layer; // <-- lưu layer để xóa lần sau
          setRouteGeoJSON(geojson);
        }
      } catch (err) {
        console.error("NearestTool error:", err);
      }
    },
  });

  return (
    <>
      {clickPos && activeTool === "nearest" && (
        <Marker position={clickPos}>
          <Popup>Vị trí bạn chọn</Popup>
        </Marker>
      )}

      {nearest && activeTool === "nearest" && (
        <Marker position={[nearest.lat, nearest.lng]} icon={highlightIcon}>
          <Popup>
            <b>{nearest.name}</b>
            <br />
            {nearest.address}
            <br />
            {(nearest.distance_m / 1000).toFixed(2)} km
          </Popup>
        </Marker>
      )}
    </>
  );
}

export default NearestTool;
