import { Box, Button, Typography, useTheme } from "@mui/material";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppBadIcon from '@mui/icons-material/GppBad';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import useFDA from "../../../hooks/useFDA";
import React, { useEffect, useState } from 'react';

const Patient = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [eligiblePatients, setEligiblePatients] = useState([])


    // Treatment group (receiving the actual medication)
    const [treatmentPatientGroup, setTreatmentPatientGroup] = useState([])

    // Control group (receiving a placebo or established medication)
    const [controlPatientGroup, setControlPatientGroup] = useState([])

    const { entities } = useFDA();

    const listEligiblePatients = async () => {
      const { items } = await entities.patient.list();
      setEligiblePatients(items);
      console.log(items);
    };

    const mapDrugsToPatients = () => {
      const patientArrayForSort = [...eligiblePatients]
      // Return a shuffled list of patients. 
      const shuffledPatients = shuffleList(patientArrayForSort);
      // Split shuffled list of patients in half at its midpoint. 
      const midpoint = Math.ceil(shuffledPatients.length / 2);
      // Assign the first half of patients to the treatment group. 
      const treatmentGroup = shuffledPatients.splice(0, midpoint);
      setTreatmentPatientGroup
      (treatmentGroup)
      // Assign the second half of patients to the control group.
      const controlGroup = shuffledPatients;
      setControlPatientGroup(controlGroup)

      // const icdString = values.icd || patient.icdHealthCodes.map((code) => code.code).join(", ");
      // const icdDefaultArray = patient.icdHealthCodes ? patient.icdHealthCodes.map((code) => ({ code: code.code })) : [];
      // const icdArray = icdString ? icdString.split(",").map((icdCode) => ({ code: icdCode.trim() })) : icdDefaultArray;

      // Update treatment group patients current medications to receive the generic medication 
      treatmentGroup.map(async (treatmentPatient) => {
        const patient = await entities.patient.get(treatmentPatient._id)
        console.log(patient.currentMedications)
        // const response = await entities.product.update({
        //   _id: patient._id,
        //   currentMedications: {medication: "Generic"}
        // })
        // setTreatmentPatientGroup(...response)
        // if (patient.currentMedications === null) {
        //   patient.currentMedications = {medication: "Generic"}
        // }
        // const updatePatientResponse = await entities.patient.update(patient)
        // console.log(updatePatientResponse)
      })

      console.log("Above are treatment patient ids, and below are control patient ids")

      // Update control group patients current medications to receive the placebo medication 
      controlGroup.map(async (controlPatient) => {
        const patient = await entities.patient.get(controlPatient._id)
        console.log(patient.currentMedications)
        // const response = await entities.product.update({
        //   _id: patient._id,
        //   currentMedications: {medication: "Placebo"}
        // })
        // setControlPatientGroup(...response)

      //   if (patient.currentMedications === null) {
      //     patient.currentMedications = {medication: "Placebo"}
      //   }
      //   const updatePatientResponse = await entities.patient.update(patient)
      //   console.log(updatePatientResponse)
      })
    }

    // Helper method to shuffle the list of patients thus randomizing the indices for each patient object in the list of patients
    // This method shuffles an array using the Fisher-Yates shuffle algorithm, which works by swapping elements randomly in the array.
    const shuffleList = (patientList) => {
      let currentIndex = patientList.length;
      let temporaryValue, randomIndex;
    
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = patientList[currentIndex];
        patientList[currentIndex] = patientList[randomIndex];
        patientList[randomIndex] = temporaryValue;
      }
    
      return patientList;
    }


    useEffect(() => {
      listEligiblePatients();
    }, []);

    const getRowId = (row) => row._id;

    const columns = [
        {
          field: "uuid",
          headerName: "UUID",
          flex: 1,
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
          field: "hivViralLoad",
          headerName: "HIV READING",
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
          <Button onClick={mapDrugsToPatients} color="custom" variant="contained">
              Map Drugs To Patients
          </Button>
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