import { Box, useTheme, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import useJaneHopkins from "../hooks/useJaneHopkins";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppBadIcon from '@mui/icons-material/GppBad';
import OutboxIcon from '@mui/icons-material/Outbox';

const JaneHopkinsAdminPatient = () => {
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
          field: "name",
          headerName: "Name",
          flex: 0.5,
          cellClassName: "name-column--cell",
        },
        {
          field: "isEligible",
          headerName: "Eligible",
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
        {
          field: "dob",
          headerName: "DOB",
          flex: 1,
        },
        {
          field: "doses",
          headerName: "Doses",
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
            <Button
                color= "secondary"
                variant="contained" 
                type="submit" 
                sx={{ mb: "20px", padding: "10px 18px" }}
              >
                Send Report to FDA
                <OutboxIcon sx={{ ml: "10px" }}></OutboxIcon>
            </Button>
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


export default JaneHopkinsAdminPatient;