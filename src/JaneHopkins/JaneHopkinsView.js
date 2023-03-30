import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

function JaneHopkinsView() {

  return (
    <div
      className="JaneHopkinsView"
      style={{ display: "flex", position: "relative", width: "100%" }}
    >
      <SideBar isSidebar={true} />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default JaneHopkinsView;
