import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import { MapProvider } from "./components/context/MapContext";
import "./App.css";
function App() {
  return (
    <MapProvider>
      <div className="app">
        <header className="header">
          WebGIS - Quản lý trường đại học Hà Nội
        </header>

        <div className="container">
          <Sidebar />
          <MapView />
        </div>
      </div>
    </MapProvider>
  );
}

export default App;
