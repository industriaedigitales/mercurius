import { HashRouter, Routes, Route } from "react-router-dom";
import { MediaScreen } from "./screens/MediaScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { GalleryScreen } from "./screens/GalleryScreen";
import { SelectionScreen } from "./screens/SelectionScreen";
import "./App.css";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SelectionScreen />} />
        <Route path="/media" element={<MediaScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/gallery" element={<GalleryScreen />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
