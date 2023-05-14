import { Box, useTheme, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import useJaneHopkins from "../../hooks/useJaneHopkins";
import React, { useEffect, useState } from 'react';
import SplitButton from "../../components/SplitButton";
import { useNavigate } from "react-router-dom";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppBadIcon from '@mui/icons-material/GppBad';
import { Snackbar, Alert } from "@mui/material";


const Patient = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [checkboxSelection, setCheckboxSelection] = React.useState(true);
    const [selectedRows, setSelectedRows] = useState([]);

    const [open, setOpen] = React.useState(false);

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
    };

    const handleDeleteClick = async () => {
      for (const id of selectedRows) {
        const response = await entities.patient.remove(id);
      }
      setSelectedRows([]);
      listPatients();
      setOpen(true);
    };

    const navigate = useNavigate();
    const handleRowClick = (rowParams) => {
      const patientId = rowParams.row._id;
      navigate(`/janehopkinsdoctor/patient/${patientId}`);
    };

    const onClose = () => {
      setOpen(false);
    };

    const columns = [
        {
          field: "uuid",
          headerName: "UUID",
          flex: 1,
        },
        {
          field: "name",
          headerName: "NAME",
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
          headerName: "INSURANCE NUMBER",
          flex: 1,
        },
        {
          field: "doses",
          headerName: "DOSES",
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
          field: "isEligible",
          headerName: "ELIGIBLE",
          flex: 1,
          headerAlign:'center',
          renderCell: ({ row: { isEligible } }) => {
            return (
              <Box
                width="60%"
                m="0 auto"
                p="5px"
                display="flex"
                justifyContent="center"
                backgroundColor={
                  isEligible === true
                    ? colors.greenAccent[600]
                    : isEligible === false
                    ? colors.redAccent[600]
                    : colors.redAccent[600]
                }
                borderRadius="4px"
              >
                {isEligible === true && <span>
                  <VerifiedUserIcon />
                  <span>Eligible</span>
                </span>}
                {isEligible === false && <span>
                  <GppBadIcon />
                  <span>Not Eligible</span>
                </span>}
                {isEligible === null && <span>
                  <GppBadIcon />
                  <span>Not Eligible</span>
                </span>}
                <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                  {isEligible}
                </Typography>
              </Box>
            );
          },
        },
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
            <SplitButton toggleSelectionBox={toggleSelectionBox} handleDeleteClick={handleDeleteClick}>
            </SplitButton>
            <div style={{ height: '100%', width: '100%' }}>
              <DataGrid 
                checkboxSelection={checkboxSelection} 
                rows={patients} 
                columns={columns} 
                getRowId={getRowId} 
                onSelectionModelChange={handleSelectionChange} 
                onRowClick={handleRowClick}
              />
            </div>
          </Box>
          <Snackbar
                    open={open}
                    autoHideDuration={2000} // Now it will hide after 2 seconds
                    onClose={onClose}
                >
                    <Alert
                    //onClose={handleClose}
                    severity="success"
                    sx={{ width: "100%" }}
                    >
                    Patients have been deleted!
                    </Alert>
                </Snackbar>
        </Box>
    );
};


export default Patient;