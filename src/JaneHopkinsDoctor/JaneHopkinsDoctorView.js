import { Outlet } from "react-router-dom";
import SideBar from "../JaneHopkinsDoctor/SideBar";

function JaneHopkinsDoctorView() {

  return (
    <div
      className="JaneHopkinsDoctorView"
      style={{ display: "flex", position: "relative", width: "100%" }}
    >
      <SideBar isSidebar={true} />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default JaneHopkinsDoctorView;
