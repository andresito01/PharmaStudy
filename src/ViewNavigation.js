import { Link } from "react-router-dom";
import { Button, Box } from '@mui/material';

function ViewNavigation() {

  const LinkCSS = {
    color: "white",
    fontSize: "2rem"
  };

  return (
    <div
      className="ViewNavigationPage"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "30px",
      }}
    >
      <Box
        m="20px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        height="100vh"
        width = "400px"
        marginTop="200px"
       >
      <Link to={"/janehopkinsdoctorlogin"}>
        <Box width="100%" marginBottom="22px">
          <Button 
          color="warning"
          variant="outlined"
          sx={{ padding: "12px 70px" }}
          size = "large">
            Jane Hopkins Doctor</Button>
        </Box>
      </Link>
      <Link to={"/janehopkinsadminlogin"}>
      <Box width="100%" marginBottom="22px">
      <Button 
        color="warning"
        variant="outlined"
        sx={{ padding: "12px 76px"}}
        size = "large">
          Jane Hopkins Admin</Button>
        </Box>
      </Link>
      <Link to={"/fdalogin"}>
      <Box width="100%" marginBottom="22px">
      <Button 
        color="warning"
        variant="outlined"
        sx={{ padding: "12px 125px" }}
        size = "large">
          FDA</Button>
          </Box>
      </Link>
      <Link to={"/bavarialogin"}>
      <Box width="100%" marginBottom="22px">
      <Button 
        color="warning"
        variant="outlined"
        sx={{ padding: "12px 115px" }}
        size = "large">
          Bavaria</Button>
          </Box>
      </Link>
      </Box>
    </div>
  );
}

export default ViewNavigation;
