import { Box, useTheme, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import useJaneHopkins from "../hooks/useJaneHopkins";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const PostTrialReport = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [patients, setPatients] = useState([]);
    console.log(patients);

    const { entities } = useJaneHopkins();
    const listPatients = async () => {
      const { items } = await entities.patient.list({
        filter: {
            isEligible: { eq: true },
            doses: { eq: "5" },
        },
      });
      setPatients(items);
    };

    useEffect(() => {
      listPatients();
    }, []);

    const getRowId = (row) => row._id;

    const navigate = useNavigate();

    const columns = [
      {
        field: "_id",
        headerName: "PATIENT ID",
        flex: 1,
      },
      {
        field: "visits",
        headerName: "VIRAL LOAD",
        flex: 1,
        renderCell: ({ row }) => {
            const visits = row.visits || [];
            const viralLoads = visits.map((visit) => visit.hivViralLoad);
            const viralLoadString = `[${viralLoads.join(", ")}]`;
          return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography>{viralLoadString}</Typography>
            </Box>
          );
        },
      },
      {
        field: "",
        headerName: "EFFICIENCY",
        flex: 1,
        renderCell: ({ row }) => {
            const visits = row.visits || [];
            const viralLoads = visits.map((visit) => parseInt(visit.hivViralLoad));
          
            if (viralLoads.length === 0) {
              return (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography>Not available</Typography>
                </Box>
              );
            }
          
            const firstViralLoad = viralLoads[0];
            const lastViralLoad = viralLoads[viralLoads.length - 1];
          
            let efficiencyRate;
          
            if (lastViralLoad === 0) {
              efficiencyRate = "100%";
            } else {
              efficiencyRate = `${Math.round((1 - lastViralLoad / firstViralLoad) * 100)}%`;
            }
          
            return (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography>{efficiencyRate}</Typography>
              </Box>
            );
          },
      },
      {
        headerName: "DRUG TYPE",
        flex: 1,
        renderCell: ({ row: {  } }) => {
          
          return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography >

              </Typography>
            </Box>
          );
        },
      },
    ];

     // Calculate overall efficiency
  let overallEfficiency = "Not available";
  if (patients.length > 0) {
    const efficiencySum = patients.reduce((sum, patient) => {
      const visits = patient.visits || [];
      const viralLoads = visits.map((visit) => parseInt(visit.hivViralLoad));
      if (viralLoads.length > 0) {
        const firstViralLoad = viralLoads[0];
        const lastViralLoad = viralLoads[viralLoads.length - 1];
        if (lastViralLoad === 0) {
          return sum + 1;
        } else {
          return sum + (1 - lastViralLoad / firstViralLoad);
        }
      }
      return sum;
    }, 0);
    overallEfficiency = `${Math.round((efficiencySum / patients.length) * 100)}%`;
  }

  let overallSuccessRate = "Not available";
  let successfulPatients = 0;
  if (patients.length > 0) {
    const eligiblePatients = patients.filter((patient) => patient.isEligible === true);
    if (eligiblePatients.length > 0) {
      const successPatients = eligiblePatients.filter((patient) => {
        const visits = patient.visits || [];
        const viralLoads = visits.map((visit) => parseInt(visit.hivViralLoad));
        if (viralLoads.length > 0) {
          const firstViralLoad = viralLoads[0];
          const lastViralLoad = viralLoads[viralLoads.length - 1];
          return lastViralLoad === 0 || lastViralLoad < firstViralLoad;
        }
        return false;
      });
      overallSuccessRate = `${Math.round((successPatients.length / eligiblePatients.length) * 100)}%`;
    }
}

      return (
        <Box m="40px">
          <Header title="Post-Trial Report" />
          <Box
            m="20px 0 0 0"
            height="55vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "none",
              },
              "& .name-column--cell": {
                color: colors.greenAccent[300],
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.blueAccent[700],
                borderBottom: "none",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: colors.primary[400],
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "none",
                backgroundColor: colors.blueAccent[700],
              },
            }}
          >
            <div style={{ height: '100%', width: '100%' }}>
              <DataGrid 
                rows={patients} 
                columns={columns} 
                getRowId={getRowId} 
              />
            </div>
          </Box>

          <Box m="40px 0px">
            <Header title="Drug Overall Report" />
            <Typography variant="body1">Overall Efficiency: {overallEfficiency}</Typography>
            <Typography variant="body1">Overall Success Patient Rate: {overallSuccessRate}</Typography>
            </Box>
        </Box>

        
      );
};


export default PostTrialReport;