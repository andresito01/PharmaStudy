import { Box, useTheme, Typography, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import useBavaria from "../hooks/useBavaria";
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import OutboxIcon from '@mui/icons-material/Outbox';

const BavariaViewDrugView = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [checkboxSelection, setCheckboxSelection] = React.useState(true);
    const [selectedRows, setSelectedRows] = useState([]);

    const [drugs, setDrugs] = useState([]);
    console.log(drugs);

    const { entities } = useBavaria();
    const listDrugs = async () => {
      const { items } = await entities.drug.list();
      setDrugs(items);
    };

    let addBavariaResponse;
    const addBavaria = async (values) => {
      addBavariaResponse = await entities.drug.add(
        {
          placebo: false,
          batchNumber: "5",
        },
      );
      listDrugs();
    }

    let addPlaceboResponse;
    const addPlacebo = async (values) => {
      addPlaceboResponse = await entities.drug.add(
        {
          placebo: true,
          batchNumber: "5",
        },
      );
      listDrugs();
    }

    useEffect(() => {
        listDrugs();
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
        const response = await entities.drug.remove(id);
      }
      setSelectedRows([]);
      listDrugs();
    };

    const columns = [
      {
        field: "_id",
        headerName: "UUID",
        flex: 0.7,
      },
      {
        field: "placebo",
        headerName: "Type",
        flex: 1,
        headerAlign:'center',
        renderCell: ({ row: { placebo } }) => {
          return (
            <Box
              width="20%"
              m="0 auto"
              p="10px"
              display="start-flex"
              justifyContent="center"
              backgroundColor={
                placebo === false
                  ? colors.greenAccent[600]
                  : placebo === true
                  ? colors.redAccent[600]
                  : colors.redAccent[600]
              }
              borderRadius="4px"
            >
              {placebo === true && <span>
                <span>Placebo</span>
              </span>}
              {placebo === false && <span>
                <span>Bavaria</span>
              </span>}
              {placebo === null && <span>
                <span>TBD</span>
              </span>}
              <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                {placebo}
              </Typography>
            </Box>
          );
        },
      },
      {
        field: "batchNumber",
        headerName: "Doses",
        flex: 1,
      },
    ];

      return (
        <Box m="40px">
          <Header title="Drug List" />
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
                sx={{ mb: "20px", padding: "16px 30px" }}
                onClick={() => addBavaria()}
              >
                Bavaria
            </Button>
            <Button
                color= "redcustom"
                variant="contained" 
                type="submit" 
                sx={{ mb: "20px", ml: "30px", padding: "16px 30px" }}
                onClick={() => addPlacebo()}
              >
                Placebo
            </Button>
            <div style={{ height: '100%', width: '100%' }}>
              <DataGrid 
                checkboxSelection={checkboxSelection} 
                rows={drugs} 
                columns={columns} 
                getRowId={getRowId} 
              />
            </div>
          </Box>
        </Box>
      );
};


export default BavariaViewDrugView;