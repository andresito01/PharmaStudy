import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import HomeIcon from '@mui/icons-material/Home';
//Test
import { mockPatientList } from '../../data/mockData';

const TopBar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    /* TEST ADD PATIENT 
    const { entities } = useJaneHopkins();

    const addPatient = async (patientData) => {
        const addPatientResponse = await entities.patient.add(patientData);
    };
    // const addPatient = async () => {
    //     const response = await entities.patient.remove("01866901-70ee-8e21-5ea9-dbdd67850f61");
    // };
    
     mockPatientList.forEach(async (patient) => {
         await addPatient(patient);
       });
    /************************************/ 

    function backToHome() {
        window.location.href = '/';
    }

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* SEARCH BAR */}
            <Box
                 display="flex" justifyContent="space-between" p={2}
                 sx={{ alignItems: 'flex-end' }}
            >
                <Box
                    display="flex"
                    backgroundColor={colors.primary[400]}
                    borderRadius="3px"
                >
                    <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search" />
                    <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                    </IconButton>
                </Box>
                 <HomeIcon
                    sx={{ ml: 1.5, flex: 1, fontSize: 28 }}
                    onClick={backToHome}
                /> 
                
            </Box>

            {/* ICONS */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                {theme.palette.mode === "dark" ? (
                    <DarkModeOutlinedIcon />
                ) : (
                    <LightModeOutlinedIcon />
                )}
                </IconButton>
                <IconButton onClick={() => {
                    //addPatient();
                }}>
                <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton>
                <SettingsOutlinedIcon />
                </IconButton>
                <IconButton>
                <PersonOutlinedIcon />
                </IconButton>
            </Box>
        </Box>
    );
};

export default TopBar;