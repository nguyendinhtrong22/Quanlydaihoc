import React, { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import axios from "axios";

const RouteSearchTool = ({ schools }) => {
  const map = useMap();
  const [startPos, setStartPos] = useState(null);
  const [endSchoolId, setEndSchoolId] = useState("");
  const [transport, setTransport] = useState("driving");
  const [routeLayer, setRouteLayer] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null); // thông tin đường đi

  // Lấy GPS khi mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setStartPos([pos.coords.latitude, pos.coords.longitude]),
        () => alert("Không lấy được vị trí GPS"),
      );
    }
  }, []);

  const handleFindRoute = async () => {
    if (!startPos) return alert("Chưa có vị trí bắt đầu!");
    const school = schools.find((s) => s.id === Number(endSchoolId));
    if (!school) return alert("Chưa chọn trường kết thúc!");

    try {
      if (routeLayer) {
        map.removeLayer(routeLayer);
        setRouteLayer(null);
      }

      const res = await axios.get(
        `https://router.project-osrm.org/route/v1/${transport}/${startPos[1]},${startPos[0]};${school.lon},${school.lat}?geometries=geojson&overview=full&steps=false`,
      );

      if (res.data.routes?.length) {
        const geojson = res.data.routes[0].geometry;
        const layer = L.geoJSON(geojson, { color: "red", weight: 5 }).addTo(
          map,
        );
        map.fitBounds(layer.getBounds());
        setRouteLayer(layer);

        // Lấy thông tin distance & duration
        const route = res.data.routes[0];
        setRouteInfo({
          distance: (route.distance / 1000).toFixed(2) + " km",
          duration: Math.ceil(route.duration / 60) + " phút",
          transport:
            transport === "driving"
              ? "Ô tô"
              : transport === "cycling"
                ? "Xe đạp"
                : "Đi bộ",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tìm đường");
    }
  };

  const handleClearRoute = () => {
    if (routeLayer) {
      map.removeLayer(routeLayer);
      setRouteLayer(null);
    }
    setEndSchoolId("");
    setTransport("driving");
    setRouteInfo(null);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        width: 300,
        maxHeight: 500,
        overflowY: "auto",
        background: "white",
        borderRadius: 10,
        padding: 15,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        fontSize: 14,
      }}
    >
      <h4 style={{ marginBottom: 10 }}>TÌM ĐƯỜNG ĐI</h4>

      <label>Điểm kết thúc</label>
      <select
        value={endSchoolId}
        onChange={(e) => setEndSchoolId(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 6, fontSize: 14 }}
      >
        <option value="">-- Chọn trường --</option>
        {schools.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <label>Phương tiện</label>
      <select
        value={transport}
        onChange={(e) => setTransport(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 6, fontSize: 14 }}
      >
        <option value="driving">Ô tô</option>
        <option value="cycling">Xe đạp</option>
        <option value="walking">Đi bộ</option>
      </select>

      <button
        onClick={handleFindRoute}
        style={{
          width: "100%",
          marginBottom: 8,
          padding: 10,
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 6,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        Tìm đường
      </button>

      <button
        onClick={handleClearRoute}
        style={{
          width: "100%",
          padding: 10,
          background: "#ef4444",
          color: "white",
          border: "none",
          borderRadius: 6,
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        Xóa dữ liệu
      </button>

      {/* Hiển thị thông tin đường đi */}
      {routeInfo && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            background: "#f3f4f6",
            borderRadius: 6,
            fontSize: 15,
            lineHeight: 1.4,
          }}
        >
          <div>
            <b>Phương tiện:</b> {routeInfo.transport}
          </div>
          <div>
            <b>Khoảng cách:</b> {routeInfo.distance}
          </div>
          <div>
            <b>Thời gian:</b> {routeInfo.duration}
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteSearchTool;
