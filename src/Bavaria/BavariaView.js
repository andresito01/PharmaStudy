import { Outlet } from "react-router-dom";
import SideBar from "../Bavaria/SideBar";

function BavariaView() {
  return (
    <div
      className="BavariaView"
      style={{ display: "flex", position: "relative", width: "100%" }}
    >
      <SideBar isSidebar={true} />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default BavariaView;
