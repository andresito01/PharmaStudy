import { Outlet } from "react-router-dom";
import SideBar from "../JaneHopkinsDoctor/SideBar";

function JaneHopkinsDoctorView({ isSidebar }) {

  return (
    <div
      className="JaneHopkinsDoctorView"
      style={{ display: "flex", position: "relative", width: "100%" }}
    >
      {isSidebar ? <SideBar isSidebar={isSidebar} /> : null}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default JaneHopkinsDoctorView;
