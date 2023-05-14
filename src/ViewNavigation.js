import { Link } from "react-router-dom";

function ViewNavigation() {

  const LinkCSS = {
    color: "white",
    fontSize: "2rem",
  };

  return (
    <div
      className="ViewNavigationPage"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      <Link style={LinkCSS} to={"/janehopkinsdoctorlogin"}>
        Jane Hopkins Doctor
      </Link>
      <Link style={LinkCSS} to={"/janehopkinsadminlogin"}>
        Jane Hopkins Admin
      </Link>
      <Link style={LinkCSS} to={"/fdalogin"}>
        FDA
      </Link>
      <Link style={LinkCSS} to={"/bavarialogin"}>
        Bavaria
      </Link>
    </div>
  );
}

export default ViewNavigation;
