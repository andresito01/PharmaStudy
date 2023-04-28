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

    const nodePermissions = {
      aclInput: {
        acl: [
          {
            principal: {
              nodes: ["Bavaria"],
            },
            operations: ["READ"],
            path: "uuid"
          },
          {
            principal: {
              nodes: ["Bavaria"],
            },
            operations: ["READ"],
            path: "isEligible"
          },
          // Remove the permission below to disallow Bavaria's access to the patient's drug mapping
          {
            principal: {
              nodes: ["Bavaria"],
            },
            operations: ["READ"],
            path: "medication"
          },
          {
            principal: {
              nodes: ["Bavaria"],
            },
            operations: ["READ"],
            path: "doses"
          },
          {
            principal: {
              nodes: ["Bavaria"],
            },
            operations: ["READ"],
            path: "hivViralLoad"
          },
        ],
      },
    };

    const [eligiblePatientsJaneHopkins, setEligiblePatientsJaneHopkins] = useState([])

    // state for EligiblePatient high level property that only FDA should have full access to 
    const [eligiblePatientsFDA, setEligiblePatientsFDA] = useState([])


    // Treatment group (receiving the actual medication)
    const [treatmentPatientGroup, setTreatmentPatientGroup] = useState([])

    // Control group (receiving a placebo or established medication)
    const [controlPatientGroup, setControlPatientGroup] = useState([])

    const { entities } = useFDA();

    // List eligible patients from Patient property
    const listEligiblePatientsFromPatientProperty = async () => {
      const { items } = await entities.patient.list();
      setEligiblePatientsJaneHopkins(items);
    };

    // Populates EligiblePatients property with the list of eligible patients, this property will also later be updated with drug mapping to the eligible patients
    let addEligiblePatientResponse;
    const addEligiblePatientsToEligiblePatientProperty = async () => {
      console.log("Method initiated")
      console.log(eligiblePatientsJaneHopkins)

      const { items } = await entities.eligiblePatient.list();
      eligiblePatientsJaneHopkins.map(async (patient) => {
        console.log(items.some((item) => item.uuid === patient.uuid) === false)
        if (items.some((item) => item.uuid === patient.uuid) === false) {
          try {
            addEligiblePatientResponse = await entities.eligiblePatient.add({
              uuid: patient.uuid,
              isEligible: patient.isEligible,
              trialGroupAssignment: patient.trialGroupAssignment||"TBD",
              medication: patient.medication||"TBD",
              doses: patient.doses||"0",
              hivViralLoad: "TBD"
            }, nodePermissions)
            console.log("Patient Added to EligiblePatient")
            console.log(addEligiblePatientResponse)
          } catch (err) {
            console.log(err)
          }
        }
      })
      listEligiblePatientsFromEligiblePatientProperty();
    }

    // List eligible patients from the EligiblePatient property
    const listEligiblePatientsFromEligiblePatientProperty = async () => {
      const { items } = await entities.eligiblePatient.list();
      setEligiblePatientsFDA(items);
    };

    // Assigns eligible patients to a treatment or control group
    const assignPatientsToTreatmentOrControlGroup = () => {
      const patientArrayForSort = [...eligiblePatientsFDA]
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

      let updateEligiblePatientResponse;
      // Update eligible patients' trialGroupAssignment property to their assigned values
      treatmentGroup.map(async (patient) => {
        console.log(patient)
        if(patient.trialGroupAssignment === "TBD") {
          console.log("Trial Group Assignment initiated")
          try {
            updateEligiblePatientResponse = await entities.eligiblePatient.update({
              uuid: patient.uuid,
              isEligible: patient.isEligible,
              trialGroupAssignment: "Generic",
              medication: "Generic",
              doses: patient.doses||"0",
              hivViralLoad: "TBD"
            }, nodePermissions)
            console.log(updateEligiblePatientResponse)
          } catch (err) {
            console.log(err)
          }
        }
      })

      controlGroup.map(async (patient) => {
        console.log(patient)
        if(patient.trialGroupAssignment === "TBD") {
          console.log("Trial Group Assignment initiated")
          try {
            updateEligiblePatientResponse = await entities.eligiblePatient.update({
              uuid: patient.uuid,
              isEligible: patient.isEligible,
              trialGroupAssignment: "Placebo",
              medication: "Placebo",
              doses: patient.doses||"0",
              hivViralLoad: "TBD"
            }, nodePermissions)
            console.log(addEligiblePatientResponse)
          } catch (err) {
            console.log(err)
          }
        }
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
      listEligiblePatientsFromPatientProperty();
    }, []);

    useEffect(() => {
      addEligiblePatientsToEligiblePatientProperty();
    }, [eligiblePatientsJaneHopkins]);

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
          field: `trialGroupAssignment`,
          headerName: "Trial Group",
          flex: 1,
        },
        {
          field: `medication`,
          headerName: "MEDICATION",
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
          field: "hivViralLoad",
          headerName: "HIV READING",
          flex: 1,
        },
      ];

      return (
        
        <Box m="20px">
          <Header title="Patient List" />
          <Button onClick={assignPatientsToTreatmentOrControlGroup} color="custom" variant="contained">
              Randomly Assign Patients To A Treatment Or Control Group
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
              <DataGrid checkboxSelection rows={eligiblePatientsFDA} columns={columns} getRowId={getRowId} /> 
            </div>
          </Box>
        </Box>
    );
};

export default Patient;