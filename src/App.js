import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import TopBar from "./scenes/global/TopBar";
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
import JaneHopkinsDoctorLogin from "./JaneHopkinsDoctor/JaneHopkinsDoctorLogin";
import JaneHopkinsAdminLogin from "./JaneHopkinsAdmin/JaneHopkinsAdminLogin";
// FDA Imports
import FDAView from "./FDA/FDAView.js";
import FDAPatient from "./FDA/scenes/patient";
import FDALogin from "./FDA/FDALogin";
// Bavaria imports
import BavariaViewDrugView from "./Bavaria/BavariaViewDrugView";
import BavariaView from "./Bavaria/BavariaView";
import RealtimeTrials from "./Bavaria/RealtimeTrials";
import BavariaLogin from "./Bavaria/BavariaLogin";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    
    if (location.pathname !== '/janehopkinsdoctor') {
      setIsSidebar(true);
    } else {
      setIsSidebar(false);
    }
  

  }, [location.pathname]
  
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar isSidebar={isSidebar} setIsSidebar={setIsSidebar} />
        <div className="app">
          <Routes>
            <Route path="/" element={<ViewNavigation />} />
            <Route path="/janehopkinsdoctorlogin" element={<JaneHopkinsDoctorLogin />} />
            <Route
              path="/janehopkinsdoctor"
              element={<JaneHopkinsDoctorView isSidebar={isSidebar}/>}
            >
              <Route path="" element={<JaneHopkinsPatient />} />
              <Route path="patient" element={<JaneHopkinsPatient />} />
              <Route path="addpatient" element={<AddPatientJaneHopkins />} />
              <Route path="patient/:patientId" element={<PatientInfo />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="faq" element={<FAQ />} />
            </Route>
            <Route path="/janehopkinsadminlogin" element={<JaneHopkinsAdminLogin />} />
            <Route path="/janehopkinsadmin" element={<JaneHopkinsAdminView />}>
              <Route path="" element={<JaneHopkinsAdminPatient />} />
              <Route path="team" element={<Team />} />
              <Route path="form" element={<Form />} />
              <Route path="faq" element={<FAQ />} />
            </Route>
            <Route path="/fdalogin" element={<FDALogin />} />
            <Route path="/fda" element={<FDAView />}>
              <Route path="" element={<FDAPatient />} />
              <Route path="team" element={<Team />} />
              <Route path="form" element={<Form />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="patient" element={<FDAPatient />} />
              <Route path="invoices" />
            </Route>
            <Route path="/bavarialogin" element={<BavariaLogin />} />
            <Route path="/bavaria" element={<BavariaView />}>
              <Route path="" element={<BavariaViewDrugView />} />
              <Route path="realtimetrials" element={<RealtimeTrials />} />
              <Route path="faq" element={<FAQ />} />
            </Route>
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
