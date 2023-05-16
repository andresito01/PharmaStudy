import { Box, useTheme, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
//import useJaneHopkins from "../hooks/useJaneHopkins";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppBadIcon from '@mui/icons-material/GppBad';
import OutboxIcon from '@mui/icons-material/Outbox';
import useBavaria from "../hooks/useBavaria.js";

const RealtimeTrials = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [checkboxSelection, setCheckboxSelection] = React.useState(true);
    const [selectedRows, setSelectedRows] = useState([]);

    const [patients, setPatients] = useState([]);
    console.log(patients);

    const { entities } = useBavaria();
    const listPatients = async () => {
      const { items } = await entities.patient.list();
      setPatients(items);
    };

    useEffect(() => {
      listPatients();
    }, []);

    const toggleSelectionBox = (value) => {
      setCheckboxSelection(value);
    };

    const getRowId = (row) => row._id;

    const handleSelectionChange = (selectionModel) => {
      setSelectedRows(selectionModel);
    };

    const handleDeleteClick = async () => {
      for (const id of selectedRows) {
        const response = await entities.patient.remove(id);
      }
      setSelectedRows([]);
      listPatients();
    };

    const navigate = useNavigate();
    const handleRowClick = (rowParams) => {
      const patientId = rowParams.row._id;
      navigate(`/janehopkinsdoctor/patient/${patientId}`);
    };

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
    //   {
    //     headerName: "DRUG TYPE",
    //     flex: 1,
    //     renderCell: ({ row: { doses } }) => {
    //       const dosesCount = parseInt(doses);
    //       return (
    //         <Box sx={{ display: "flex", justifyContent: "center" }}>
    //           <Typography sx={{ color: dosesCount === 5 ? colors.greenAccent[600] : colors.redAccent[400]}}>
    //             {dosesCount ? "Bavaria " : "Placebo"}
    //           </Typography>
    //         </Box>
    //       );
    //     },
    //   },
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
              "& .MuiCheckbox-root": {
                color: `${colors.greenAccent[200]} !important`,
              },
            }}
          >
            <div style={{ height: '100%', width: '100%' }}>
              <DataGrid 
                checkboxSelection={checkboxSelection} 
                rows={patients} 
                columns={columns} 
                getRowId={getRowId} 
                //onSelectionModelChange={handleSelectionChange} 
                //onRowClick={handleRowClick}
              />
            </div>
          </Box>
        </Box>
      );
};


export default RealtimeTrials;