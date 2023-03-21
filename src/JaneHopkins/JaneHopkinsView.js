import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "../theme";
import { useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import TopBar from "../scenes/global/TopBar.jsx";
import SideBar from "./SideBar";

function JaneHopkinsView() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <div
      className="JaneHopkinsView"
      style={{ display: "flex", position: "relative", width: "100%" }}
    >
      <SideBar isSidebar={isSidebar} />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default JaneHopkinsView;
