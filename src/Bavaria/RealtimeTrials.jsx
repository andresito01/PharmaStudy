import { Box, useTheme, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import useJaneHopkins from "../hooks/useJaneHopkins";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const RealtimeTrials = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [patients, setPatients] = useState([]);
    console.log(patients);

    const { entities } = useJaneHopkins();
    const listPatients = async () => {
      const { items } = await entities.patient.list();
      setPatients(items);
    };

    useEffect(() => {
      listPatients();
    }, []);

    const getRowId = (row) => row._id;

    const columns = [
      {
        field: "uuid",
        headerName: "PATIENT ID",
        flex: 1,
      },
      {
        field: "doses",
        headerName: "CURRENT DOSES",
        flex: 1,
        renderCell: ({ row: { doses } }) => {
          const dosesCount = parseInt(doses);
          return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography sx={{ color: dosesCount === 5 ? colors.greenAccent[600] : colors.redAccent[400]}}>
                {dosesCount ? dosesCount : 0}/{5}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "lasthivviralload",
        headerName: "LAST HIV VIRAL LOAD",
        flex: 1,
        renderCell: ({ row }) => {
          const visits = row.visits || [];
          const lastViralLoad = visits.length > 0 ? visits[visits.length - 1].hivViralLoad : "N/A";
          return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography sx={{ color: lastViralLoad === '0' ? colors.greenAccent[600] : colors.redAccent[400]}}>{lastViralLoad}</Typography>
            </Box>
          );
        },
      },
      {
        headerName: "STATUS",
        flex: 1,
        renderCell: ({ row: { doses } }) => {
          const dosesCount = parseInt(doses);
          return (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography sx={{ color: dosesCount === 5 ? colors.greenAccent[600] : colors.redAccent[400]}}>
                {dosesCount === 5 ? "Completed" : "In Progress"}
              </Typography>
            </Box>
          );
        },
      },
    ];

      return (
        <Box m="40px">
          <Header title="Real-time Trials" />
          <Box
            m="20px 0 0 0"
            height="75vh"
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
        </Box>
      );
};


export default RealtimeTrials;