import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import TopBar from "./scenes/global/TopBar";
import SideBar from "./JaneHopkins/SideBar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Form from "./scenes/form";
import Calendar from "./scenes/calendar";
import FAQ from "./scenes/faq";
import Patient from "./scenes/patient";

function ViewNavigation() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const LinkCSS = {
    color: "white",
    fontSize: "2rem",
  };

  return (
    <div
      className="ViewNavigationPage"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <Link style={LinkCSS} to={"/janehopkins"}>
        Jane Hopkins
      </Link>
      <Link style={LinkCSS} to={"/fda"}>
        FDA
      </Link>
      <Link style={LinkCSS} to={"/bavaria"}>
        Bavaria
      </Link>
    </div>
  );
}

export default ViewNavigation;
