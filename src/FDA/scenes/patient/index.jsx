import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import useFDA from "../../../hooks/useFDA";
import React, { useEffect, useState } from 'react';

const Patient = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [eligiblePatients, setEligiblePatients] = useState([])

    const { entities } = useFDA();
    const listEligiblePatients = async () => {
      const { items } = await entities.patient.list();
      // Filter for eligible patients will need to be changed to be called from a smart contract. For now making a quick call to check that isEligible value is set to true.
      // const filterForEligiblePatients = Object.values(items).filter((patient) => {
      //   return patient.name === "Malik";
      // })
      setEligiblePatients(items);
      console.log(items);
    };

    useEffect(() => {
      listEligiblePatients();
    }, []);

    const getRowId = (row) => row._id;

    const columns = [
        { 
          field: "_id", 
          headerName: "ID",
          flex: 1,
        },
        {
          field: "uuid",
          headerName: "UUID",
          flex: 1,
        },
        {
          field: "hivViralLoad",
          headerName: "HIV READING",
          flex: 1,
        },
        {
          field: "status",
          headerName: "STATUS",
          flex: 1,
        },
        {
          field: "medication",
          headerName: "MEDICATION",
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
              <DataGrid checkboxSelection rows={eligiblePatients} columns={columns} getRowId={getRowId} /> 
            </div>
          </Box>
        </Box>
    );
};

export default Patient;