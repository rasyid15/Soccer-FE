import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dasboard from "./pages/dasboard";
import Player from "./pages/player";
import Team from "./pages/team";
import Detail from "./pages/detail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dasboard />} />
        <Route path="/player" element={<Player />} />
        <Route path="/team" element={<Team />} />
        <Route path="/detail" element={<Detail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
