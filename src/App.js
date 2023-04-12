import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import TopBar from "./scenes/global/TopBar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Form from "./scenes/form";
import Calendar from "./scenes/calendar";
import FAQ from "./scenes/faq";
// Jane Hopkins Imports
import JaneHopkinsPatient from "./scenes/patient";
import ViewNavigation from "./ViewNavigation.js";
import JaneHopkinsDoctorView from "./JaneHopkinsDoctor/JaneHopkinsDoctorView.js";
import AddPatientJaneHopkins from "./scenes/addPatient";
import JaneHopkinsAdminView from "./JaneHopkinsAdmin/JaneHopkinsAdminView";
import PatientInfo from "./JaneHopkinsDoctor/PatientInfo";
import JaneHopkinsAdminPatient from "./JaneHopkinsAdmin/JaneHopkinsAdminPatient";
// FDA Imports
import FDAView from "./FDA/FDAView.js";
import FDAPatient from "./FDA/scenes/patient";

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
            <Route
              path="/janehopkinsdoctor"
              element={<JaneHopkinsDoctorView />}
            >
              <Route path="" element={<JaneHopkinsPatient />} />
              <Route path="team" element={<Team />} />
              <Route path="form" element={<Form />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="patient" element={<JaneHopkinsPatient />} />
              <Route path="addpatient" element={<AddPatientJaneHopkins />} />
              <Route path="patient/:patientId" element={<PatientInfo />} />
            </Route>
            <Route path="/janehopkinsadmin" element={<JaneHopkinsAdminView />}>
              <Route path="" element={<JaneHopkinsAdminPatient />} />
            </Route>
            <Route path="/fda" element={<FDAView />}>
              <Route path="" element={<FDAPatient />} />
              <Route path="team" element={<Team />} />
              <Route path="form" element={<Form />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="patient" element={<FDAPatient />} />
              <Route path="invoices" />
            </Route>
            {/* <Route path="/bavaria" element={<BavariaView />} >

            </Route> */}
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
