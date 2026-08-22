import React from "react";
import "../../assets/css/Legend.css";

const Legend = () => {
  const legendItems = [
    { color: "#e92b2b", label: "Số trường > 5" },
    { color: "#155ada", label: "Số trường > 3" },
    { color: "#2bd11c", label: "Số trường > 2" },
    { color: "#ebd93a", label: "Số trường > 0" },
    { color: "#8ff0b3", label: "0" },
  ];

  return (
    <div className="map-legend bottom-left">
      <h4>Trạng thái (Số trường)</h4>
      {legendItems.map((item, idx) => (
        <div className="legend-item" key={idx}>
          <span
            className="color-circle"
            style={{ backgroundColor: item.color }}
          />
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default Legend;
