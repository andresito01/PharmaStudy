import logo from './logo.svg';
import './App.css';
import useJaneHopkins from './hooks/useJaneHopkins';
import { NavLink } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DoctorView from './JaneHopkins/DoctorView';
import AdminView from './JaneHopkins/AdminView';
import Home from './JaneHopkins/Home';


function App() {
  const { entities } = useJaneHopkins();

  const addPatient = async () => {
    const addPatientResponse = await entities.patient.add({
      name: "William",
      dob: "January 14, 1995",
      insuranceNumber: "432653143",
    });
    console.log(addPatientResponse);
  };

  return (
    <div className="App">
      <Router>
        <header>
          <nav>
            <ul>
              <li>
                <NavLink to="/" exact={true.toString()}>Home</NavLink>
              </li>
              <li>
                <NavLink to="/doctor" exact={true.toString()}>Doctor Profile</NavLink>
              </li>
              <li>
                <NavLink to="/admin" exact={true.toString()}>Admin Profile</NavLink>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/doctor" element={<DoctorView />} />
            <Route path="/admin" element={<AdminView />} />
          </Routes>
        </main>
        <button
          onClick={() => {
            addPatient();
          }}
        >
          Add patient
        </button>
      </Router>
    </div>
  );
}

export default App;

