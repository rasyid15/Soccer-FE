import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dasboard from "./pages/dasboard";
import Player from "./pages/player";
import Team from "./pages/team";
import Detail from "./pages/detail";
import Login from "./pages/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dasboard />} />
        <Route path="/player" element={<Player />} />
        <Route path="/team" element={<Team />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
