import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import "./App.css";
function App() {
  return (
    <div className="app">
      <header className="header">WebGIS - Quản lý trường đại học Hà Nội</header>

      <div className="container">
        <Sidebar />
        <MapView />
      </div>
    </div>
  );
}

export default App;
