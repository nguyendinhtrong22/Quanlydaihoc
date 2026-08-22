import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useMapContext } from "../components/context/MapContext";
import ResizeMap from "./map/ResizeMap";
import ZoomHandler from "./map/ZoomHandler";
import SchoolsLayer from "./layers/SchoolsLayer";
import DistrictLayer from "./layers/DistrictLayer";
import Legend from "./map/Legend";

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

        <Legend />
      </MapContainer>
    </div>
  );
}

export default MapView;
