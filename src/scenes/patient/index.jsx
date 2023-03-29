import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import useJaneHopkins from "../../hooks/useJaneHopkins";
import React, { useEffect, useState } from 'react';

const Patient = () => {
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
          field: "_id", 
          headerName: "ID",
          flex: 1,
        },
        {
          field: "name",
          headerName: "Name",
          flex: 1,
          cellClassName: "name-column--cell",
        },
        {
          field: "dob",
          headerName: "DOB",
          flex: 1,
        },
        {
          field: "insuranceNumber",
          headerName: "Insurance Number",
          flex: 1,
        }
      ];

      return (
        <Box m="20px">
          <Header title="Patient List" />
          <Box
            m="40px 0 0 0"
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
              <DataGrid checkboxSelection rows={patients} columns={columns} getRowId={getRowId} />
            </div>
          </Box>
        </Box>
    );
};


export default Patient;