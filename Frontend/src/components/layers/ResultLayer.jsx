import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import schoolIconImg from "../../assets/icons/school.png";

const highlightIcon = L.icon({
  iconUrl: schoolIconImg,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
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
