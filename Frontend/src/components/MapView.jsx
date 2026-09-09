import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMapContext } from "../components/context/MapContext";
import ResizeMap from "./map/ResizeMap";
import ZoomHandler from "./map/ZoomHandler";
import RadiusTool from "./tools/RadiusTool";
import SchoolsLayer from "./layers/SchoolsLayer";
import DistrictLayer from "./layers/DistrictLayer";
import NearestTool from "./tools/NearestTool";
import Legend from "./map/Legend";
import GpsControl from "./GpsControl";
import RouteSearchTool from "./tools/RouteSearchTool";

function MapView() {
  const { layers, schoolsData } = useMapContext();

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={[21.0285, 105.8542]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
      >
        <ResizeMap />
        <ZoomHandler />

        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {layers.districts && <DistrictLayer />}
        {layers.schools && <SchoolsLayer />}
        <NearestTool />
        <RadiusTool />

        <Legend />
        <GpsControl />

        {/* Bản đồ hiển thị popup tìm đường góc trên phải */}
        {schoolsData && (
          <RouteSearchTool
            schools={schoolsData.features.map((f) => ({
              id: f.properties.id,
              name: f.properties.name,
              lat: f.geometry.coordinates[1],
              lon: f.geometry.coordinates[0],
            }))}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default MapView;
