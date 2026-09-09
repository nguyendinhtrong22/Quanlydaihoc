import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import gpsIconImg from "../assets/icons/gps-icon.png";

const GpsControl = () => {
  const map = useMap();

  useEffect(() => {
    const controlDiv = L.DomUtil.create("div", "leaflet-bar leaflet-control");

    controlDiv.style.background = "white";
    controlDiv.style.width = "34px";
    controlDiv.style.height = "34px";
    controlDiv.style.display = "flex";
    controlDiv.style.alignItems = "center";
    controlDiv.style.justifyContent = "center";
    controlDiv.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = gpsIconImg;
    img.style.width = "20px";
    img.style.height = "20px";
    controlDiv.appendChild(img);

    controlDiv.title = "Bật GPS";

    controlDiv.onclick = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            map.setView([latitude, longitude], 16);

            L.marker([latitude, longitude])
              .addTo(map)
              .bindPopup("Bạn đang ở đây")
              .openPopup();
          },
          () => alert("Không thể lấy vị trí. Vui lòng cho phép truy cập GPS."),
        );
      } else {
        alert("Trình duyệt của bạn không hỗ trợ GPS.");
      }
    };

    const gpsControl = L.Control.extend({
      options: { position: "topleft" },
      onAdd: () => controlDiv,
    });

    const control = new gpsControl();
    map.addControl(control);

    return () => map.removeControl(control);
  }, [map]);

  return null;
};

export default GpsControl;
