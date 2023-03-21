import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import TopBar from "./scenes/global/TopBar";
import SideBar from "./JaneHopkins/SideBar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Form from "./scenes/form";
import Calendar from "./scenes/calendar";
import FAQ from "./scenes/faq";
import Patient from "./scenes/patient";
import ViewNavigation from "./ViewNavigation.js";
import JaneHopkinsView from "./JaneHopkins/JaneHopkinsView.js";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar setIsSidebar={setIsSidebar} />
        <div className="app">
          <Routes>
            <Route path="/" element={<ViewNavigation />} />
            <Route path="/janehopkins" element={<JaneHopkinsView />}>
              <Route path="" element={<Dashboard />} />
              <Route path="team" element={<Team />} />
              <Route path="form" element={<Form />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="patient" element={<Patient />} />
              <Route path="invoices" />
            </Route>
            {/* <Route path="/fda" element={<FDAView />} >

              </Route>
              <Route path="/bavaria" element={<BavariaView />} >

              </Route> */}
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
