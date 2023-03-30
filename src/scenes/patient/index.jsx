import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import useJaneHopkins from "../../hooks/useJaneHopkins";
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import SplitButton from "../../components/SplitButton";

const Patient = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [checkboxSelection, setCheckboxSelection] = React.useState(true);
    const [selectedRows, setSelectedRows] = useState([]);

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

    const toggleSelectionBox = (value) => {
      setCheckboxSelection(value);
    };

    const getRowId = (row) => row._id;

    const handleSelectionChange = (selectionModel) => {
      setSelectedRows(selectionModel);
      //console.log(selectedRows);
    };

    const handleDeleteClick = async () => {
      for (const id of selectedRows) {
        const response = await entities.patient.remove(id);
        // handle response as needed
        //console.log(id);
        if (response.success) {
          setPatients(patients.filter(patient => patient.id !== id));

        }
      }
      setSelectedRows([]);
      listPatients();
    };

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
        <Box m="40px">
          <Header title="Patient List" />
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
            <SplitButton toggleSelectionBox={toggleSelectionBox}>
            </SplitButton>
            <Button
              color="custom" variant="contained"
              sx={{ mb: 2 }}
              onClick={() => handleDeleteClick()}
            >
              {checkboxSelection ? 'Edit Patient' : 'Delete Patient'}
            </Button>
            <div style={{ height: '100%', width: '100%' }}>
              <DataGrid checkboxSelection={checkboxSelection} rows={patients} columns={columns} getRowId={getRowId} onSelectionModelChange={handleSelectionChange}/>
            </div>
          </Box>
        </Box>
    );
};


export default Patient;