import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import React, { useState, useContext } from 'react';
import { Routes, Route, useLocation } from "react-router-dom";
import { AppContext } from "./scenes/AppContext";
import TopBar from "./scenes/global/TopBar";
import SideBar from "./scenes/global/SideBar";
import SideBarFDA from "./scenes/global/SideBarFDA";
import SideBarBavaria from "./scenes/global/SideBarFDA";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Form from "./scenes/form";
import Calendar from "./scenes/calendar";
import FAQ from "./scenes/faq";
import Patient from "./scenes/patient";
import PatientFDA from "./scenes/patientFDA";

const sidebarOptions = {
  default: {
    id: 'janeHopkins',
    label: 'Jane Hopkins Sidebar',
    component: SideBar,
  },
  fda: {
    id: 'fda',
    label: 'FDA Sidebar',
    component: SideBarFDA,
  },
  bavaria: {
    id: 'bavaria',
    label: 'Bavaria Sidebar',
    component: SideBarBavaria,
  },
};

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const { selectedSidebar } = useContext(AppContext);
  const SelectedSidebarComponent = sidebarOptions[selectedSidebar].component;
  console.log(selectedSidebar);

  const location = useLocation();
  const hideSidebar = location.pathname === "/patientFDA";
 

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <div className="app">
            {hideSidebar ? null : <SelectedSidebarComponent setIsSidebar={setIsSidebar} />}
              <main className="content">
                <TopBar setIsSidebar={setIsSidebar} />
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/form" element={<Form />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/patient" element={<Patient />} />
                  <Route path="/patientFDA" element={<PatientFDA />} />
                </Routes>
              </main>
          </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
