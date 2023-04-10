import { Outlet } from "react-router-dom";
import SideBar from "../JaneHopkinsAdmin/SideBar";

function JaneHopkinsAdminView() {

  return (
    <div
      className="JaneHopkinsAdminView"
      style={{ display: "flex", position: "relative", width: "100%" }}
    >
      <SideBar isSidebar={true} />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default JaneHopkinsAdminView;
