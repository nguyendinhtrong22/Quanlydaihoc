import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import schoolIconImg from "../../assets/icons/school.png";

const highlightIcon = L.icon({
  iconUrl: schoolIconImg,
  iconSize: [30, 30],
  iconAnchor: [15, 35],
});

export default function ResultLayer({ data }) {
  return data.map((s) => (
    <Marker
      key={s.id}
      position={[Number(s.lat), Number(s.lon)]}
      icon={highlightIcon}
    >
      <Popup>
        <b>{s.name}</b>
        <br />
        {s.address}
      </Popup>
    </Marker>
  ));
}
