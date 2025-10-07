import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Geolocation } from "@capacitor/geolocation";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({ lat: 21.0278, lng: 105.8342 });
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [radius, setRadius] = useState(0);

  function Recenter({ center }) {
    const map = useMap();
    useEffect(() => { map.setView(center); }, [center]);
    return null;
  }

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const perm = await Geolocation.requestPermissions();
        const cur = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
        setPosition({ lat: cur.coords.latitude, lng: cur.coords.longitude });
      } catch {}
      finally { setLoading(false); }
    })();
  }, []);

  const checkIn = async () => {
    try {
      setLoading(true);
      const cur = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      const note = {
        id: Date.now(),
        text: noteText || "No title",
        lat: cur.coords.latitude,
        lng: cur.coords.longitude,
        ts: new Date().toISOString()
      };
      setNotes((prev) => [note, ...prev]);
      setNoteText("");
      setPosition({ lat: note.lat, lng: note.lng });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Geo-Notes</h1>
      <div className="controls panel">
        <input value={noteText} onChange={(e)=>setNoteText(e.target.value)} placeholder="Nhập ghi chú..."/>
        <button onClick={checkIn} disabled={loading}>Check-in</button>
        <label>
          Lọc bán kính (m)
          <input type="number" min="0" value={radius} onChange={(e)=>setRadius(Number(e.target.value)||0)} />
        </label>
      </div>
      <div className="map-wrap">
        <MapContainer center={[position.lat, position.lng]} zoom={15} className="map">
          <Recenter center={[position.lat, position.lng]} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
          {notes
            .filter(n => {
              if (!radius) return true;
              const d = distanceMeters(position.lat, position.lng, n.lat, n.lng);
              return d <= radius;
            })
            .map(n => (
              <Marker key={n.id} position={[n.lat, n.lng]} icon={L.icon({ iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png", shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png", iconSize: [25,41], iconAnchor:[12,41] })}>
                <Popup>
                  <div>
                    <strong>{n.text}</strong>
                    <div>{new Date(n.ts).toLocaleString()}</div>
                    <div>({n.lat.toFixed(5)}, {n.lng.toFixed(5)})</div>
                    <a target="_blank" href={`https://www.google.com/maps?q=${n.lat},${n.lng}`}>Mở Google Maps</a>
                  </div>
                </Popup>
              </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="notes-list">
        {notes.map(n => (
          <div className="note" key={n.id}>
            <div><strong>{n.text}</strong></div>
            <div>{new Date(n.ts).toLocaleString()}</div>
            <div>lat: {n.lat.toFixed(5)} | lng: {n.lng.toFixed(5)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function distanceMeters(lat1, lon1, lat2, lon2){
  const R = 6371000;
  const toRad = (x)=>x*Math.PI/180;
  const dLat = toRad(lat2-lat1);
  const dLon = toRad(lon2-lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R*c;
}
