import { HashRouter, Routes, Route } from "react-router-dom";
import { MainScreen } from "./screens/MainScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { GalleryScreen } from "./screens/GalleryScreen";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/gallery" element={<GalleryScreen />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
