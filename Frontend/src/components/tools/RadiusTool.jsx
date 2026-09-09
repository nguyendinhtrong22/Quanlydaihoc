import {
  useMapEvents,
  Circle,
  Marker,
  Popup,
  FeatureGroup,
} from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useMapContext } from "../../components/context/MapContext";
import L from "leaflet";

const schoolIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

function RadiusTool() {
  const { activeTool, radius } = useMapContext();

  const [center, setCenter] = useState(null);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);

  // ref để auto open popup
  const centerMarkerRef = useRef(null);

  const radiusInMeters = radius * 1000;

  // reset khi đổi tool
  useEffect(() => {
    if (activeTool !== "radius") {
      setCenter(null);
      setSchools([]);
    }
  }, [activeTool]);

  useMapEvents({
    click: async (e) => {
      if (activeTool !== "radius") return;

      const { lat, lng } = e.latlng;
      setCenter([lat, lng]);

      try {
        setLoading(true);

        const res = await axios.get(
          "http://localhost:3001/api/schools/in-radius",
          {
            params: {
              lat,
              lon: lng,
              radius: radiusInMeters,
            },
          },
        );

        setSchools(res.data.data || []);
      } catch (err) {
        console.error("Radius error:", err);
      } finally {
        setLoading(false);
      }
    },
  });

  // auto mở popup sau khi render
  useEffect(() => {
    if (centerMarkerRef.current) {
      centerMarkerRef.current.openPopup();
    }
  }, [center, schools]);

  return (
    <>
      {/* Circle */}
      {center && activeTool === "radius" && (
        <Circle
          center={center}
          radius={radiusInMeters}
          pathOptions={{
            color: "#007bff",
            fillOpacity: 0.2,
          }}
        />
      )}

      {/*Schools */}
      {activeTool === "radius" && (
        <FeatureGroup>
          {schools.map((s) => (
            <Marker key={s.id} position={[s.lat, s.lon]} icon={schoolIcon}>
              <Popup>
                <b>{s.name}</b>
                <br />
                {s.address}
                <br />
                {(s.distance_m / 1000).toFixed(2)} km
              </Popup>
            </Marker>
          ))}
        </FeatureGroup>
      )}

      {/* Marker trung tâm + Popup */}
      {center && activeTool === "radius" && (
        <Marker position={center} ref={centerMarkerRef}>
          <Popup>
            {loading ? (
              "Đang tìm..."
            ) : (
              <>
                <b>Bán kính: {radius} km</b>
                <br />
                {center[0].toFixed(4)}, {center[1].toFixed(4)}
                <br />
                Số trường: {schools.length}
              </>
            )}
          </Popup>
        </Marker>
      )}
    </>
  );
}

export default RadiusTool;
