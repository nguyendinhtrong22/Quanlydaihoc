import React, { useState } from "react";
import "../assets/css/Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder,
  faCaretDown,
  faCaretRight,
  faSearchLocation,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";
import { useMapContext } from "../components/context/MapContext";
const Sidebar = () => {
  const {
    layers,
    setLayers,
    activeTool,
    setActiveTool,
    radius,
    setRadius,
    searchText,
    setSearchText,
    selectedDistrict,
    setSelectedDistrict,
    schoolsData,
  } = useMapContext();

  const [isOpen, setIsOpen] = useState(true);
  const [isQueryOpen, setIsQueryOpen] = useState(true);
  const [isAttrOpen, setIsAttrOpen] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  const hanoiDistricts = [
    { name: "Ba Đình", type: "Quận" },
    { name: "Bắc Từ Liêm", type: "Quận" },
    { name: "Cầu Giấy", type: "Quận" },
    { name: "Đống Đa", type: "Quận" },
    { name: "Hà Đông", type: "Quận" },
    { name: "Hai Bà Trưng", type: "Quận" },
    { name: "Hoàn Kiếm", type: "Quận" },
    { name: "Hoàng Mai", type: "Quận" },
    { name: "Long Biên", type: "Quận" },
    { name: "Nam Từ Liêm", type: "Quận" },
    { name: "Tây Hồ", type: "Quận" },
    { name: "Thanh Xuân", type: "Quận" },
    { name: "Sơn Tây", type: "Thị xã" },
    { name: "Ba Vì", type: "Huyện" },
    { name: "Chương Mỹ", type: "Huyện" },
    { name: "Đan Phượng", type: "Huyện" },
    { name: "Đông Anh", type: "Huyện" },
    { name: "Gia Lâm", type: "Huyện" },
    { name: "Hoài Đức", type: "Huyện" },
    { name: "Mê Linh", type: "Huyện" },
    { name: "Mỹ Đức", type: "Huyện" },
    { name: "Phú Xuyên", type: "Huyện" },
    { name: "Phúc Thọ", type: "Huyện" },
    { name: "Quốc Oai", type: "Huyện" },
    { name: "Sóc Sơn", type: "Huyện" },
    { name: "Thạch Thất", type: "Huyện" },
    { name: "Thanh Oai", type: "Huyện" },
    { name: "Thanh Trì", type: "Huyện" },
    { name: "Thường Tín", type: "Huyện" },
    { name: "Ứng Hòa", type: "Huyện" },
  ];

  const toggleLayer = (name) => {
    setLayers((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  const normalize = (str) =>
    str
      ?.toLowerCase()
      .replace(/đ/g, "d")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")
      .trim();

  return (
    <div className="sidebar">
      <hr className="sidebar-divider" />
      <div className="layer-group-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="header-left">
          <FontAwesomeIcon icon={faFolder} className="folder-icon" />
          <span className="header-title">Lớp dữ liệu</span>
        </div>
        <FontAwesomeIcon
          icon={isOpen ? faCaretDown : faCaretRight}
          className="caret-icon"
        />
      </div>

      {isOpen && (
        <div className="layer-group-content">
          <div className="layer-item">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={layers.schools}
                onChange={() => toggleLayer("schools")}
              />
              <span className="checkmark"></span>
            </label>
            <div className="legend-and-text">
              <span className="legend-icon school-icon"></span>
              <span className="layer-label">Trường đại học</span>
            </div>
          </div>
          <div className="layer-item">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={layers.districts}
                onChange={() => toggleLayer("districts")}
              />
              <span className="checkmark"></span>
            </label>
            <div className="legend-and-text">
              <span className="legend-icon district-icon"></span>
              <span className="layer-label">Ranh giới quận</span>
            </div>
          </div>
        </div>
      )}

      <hr className="sidebar-divider" />
      <div
        className="layer-group-header"
        onClick={() => setIsAttrOpen(!isAttrOpen)}
      >
        <div className="header-left">
          <FontAwesomeIcon icon={faListUl} className="folder-icon" />
          <span className="header-title">Tra cứu thuộc tính</span>
        </div>
        <FontAwesomeIcon
          icon={isAttrOpen ? faCaretDown : faCaretRight}
          className="caret-icon"
        />
      </div>

      {isAttrOpen && (
        <div className="layer-group-content attr-tools">
          <div className="filter-item">
            <label>Tìm kiếm tên:</label>

            <div className="search-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Tìm tên trường..."
                value={searchText}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchText(value);

                  if (!schoolsData || !value) {
                    setSuggestions([]);
                    return;
                  }

                  const filtered = schoolsData.features
                    .map((f) => f.properties.name)
                    .filter((name) =>
                      normalize(name).includes(normalize(value)),
                    );

                  setSuggestions(filtered.slice(0, 5));
                }}
              />

              {searchText && (
                <button
                  className="clear-btn"
                  onClick={() => {
                    setSearchText("");
                    setSuggestions([]);
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* GỢI Ý */}
            {suggestions.length > 0 && (
              <ul className="suggestions">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => {
                      setSearchText(s);
                      setSuggestions([]);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="filter-item">
            <label>Lọc theo khu vực:</label>
            <select
              className="district-select"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">-- Tất cả Quận/Huyện --</option>

              <optgroup label="Quận">
                {hanoiDistricts
                  .filter((d) => d.type === "Quận")
                  .map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.name}
                    </option>
                  ))}
              </optgroup>

              <optgroup label="Huyện & Thị xã">
                {hanoiDistricts
                  .filter((d) => d.type !== "Quận")
                  .map((d) => (
                    <option key={d.name} value={d.name}>
                      {d.type === "Thị xã" ? `Thị xã ${d.name}` : d.name}
                    </option>
                  ))}
              </optgroup>
            </select>
          </div>
        </div>
      )}

      <hr className="sidebar-divider" />
      <div
        className="layer-group-header"
        onClick={() => setIsQueryOpen(!isQueryOpen)}
      >
        <div className="header-left">
          <FontAwesomeIcon icon={faSearchLocation} className="folder-icon" />
          <span className="header-title">Truy vấn không gian</span>
        </div>
        <FontAwesomeIcon
          icon={isQueryOpen ? faCaretDown : faCaretRight}
          className="caret-icon"
        />
      </div>

      {isQueryOpen && (
        <div className="layer-group-content query-tools">
          <button
            className={`tool-button ${activeTool === "nearest" ? "active" : ""}`}
            onClick={() => setActiveTool("nearest")}
          >
            Tìm trường gần nhất
          </button>

          <button
            className={`tool-button ${activeTool === "radius" ? "active" : ""}`}
            onClick={() => setActiveTool("radius")}
          >
            Tìm trong bán kính
          </button>

          {activeTool === "radius" && (
            <div className="tool-settings">
              <label>Bán kính (km):</label>
              <input
                type="number"
                className="radius-input"
                step="0.1"
                min="0.1"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
              />
            </div>
          )}

          <button
            className="tool-button clear-button"
            onClick={() => setActiveTool(null)}
          >
            Xóa công cụ
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
