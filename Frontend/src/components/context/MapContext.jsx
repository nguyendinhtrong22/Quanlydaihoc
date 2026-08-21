import { createContext, useContext, useState } from "react";

const MapContext = createContext();

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null);

  const [zoomLevel, setZoomLevel] = useState(11);

  const [selectedFeature, setSelectedFeature] = useState(null);

  const [activeTool, setActiveTool] = useState(null);

  const [layers, setLayers] = useState({
    schools: true,
    districts: true,
  });

  const [radius, setRadius] = useState(1);

  const [searchText, setSearchText] = useState("");

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [schoolsData, setSchoolsData] = useState(null);
  return (
    <MapContext.Provider
      value={{
        map,
        setMap,

        zoomLevel,
        setZoomLevel,

        selectedFeature,
        setSelectedFeature,

        activeTool,
        setActiveTool,

        layers,
        setLayers,

        radius,
        setRadius,

        searchText,
        setSearchText,

        selectedDistrict,
        setSelectedDistrict,

        schoolsData,
        setSchoolsData,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => useContext(MapContext);
