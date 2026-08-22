import { useMapEvents } from "react-leaflet";
import { useMapContext } from "../../components/context/MapContext";

function ZoomHandler() {
  const { setZoomLevel } = useMapContext();

  useMapEvents({
    zoomend: (e) => {
      setZoomLevel(e.target.getZoom());
    },
  });

  return null;
}

export default ZoomHandler;
