import { Box, Button, Typography, useTheme } from "@mui/material";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GppBadIcon from '@mui/icons-material/GppBad';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../../theme";
import Header from "../../../components/Header";
import useFDA from "../../../hooks/useFDA";
import React, { useEffect, useState } from 'react';
import {v4 as uuid} from 'uuid'

// Note to self, EligiblePatient list property not yet updated when a Patient is removed from the Patient list

const Patient = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const nodePermissionsForEligiblePatient = {
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
          // Alternative Approach Than FDA Assigning The Drug ID Directly Into Patient Property currentMedications
          // {
          //   principal: {
          //     nodes: ["JaneHopkins"],
          //   },
          //   operations: ["READ"],
          //   path: "trialMedication.id"
          // },
          // {
          //   principal: {
          //     nodes: ["JaneHopkins"],
          //   },
          //   operations: ["READ", "WRITE"],
          //   path: "trialMedication.batchNumber"
          // },
        ],
      },
    };

    const nodePermissionsForClinicalTrialDrugRequest2 = {
      aclInput: {
        acl: [
          {
            principal: {
              nodes: ["Bavaria"],
            },
            operations: ["READ"],
            path: "_id"
          },
          {
            principal: {
              nodes: ["Bavaria"],
            },
            operations: ["READ"],
            path: "placeboDrugRequestCount"
          },
          {
            principal: {
              nodes: ["Bavaria"],
            },
            operations: ["READ"],
            path: "genericDrugRequestCount"
          },
        ],
      },
    };

    const [drugIds, setDrugIds] = useState([])

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

     // List eligible patients from the EligiblePatient property
     const listEligiblePatientsFromEligiblePatientProperty = async () => {
      const { items } = await entities.eligiblePatient.list();
      setEligiblePatientsFDA(items);
    };

    // Populates EligiblePatient property with the list of eligible patients
    let addedEligiblePatientResponse;
    const handleAddPatientToEligiblePatientList = async () => {

      const { items } = await entities.eligiblePatient.list();
      const jhPatients = await entities.patient.list()

      // Add patient from Patient to EligiblePatient if the patient uuid in Patient is not found in EligiblePatient
      jhPatients.items.map(async (patient) => {
        console.log(items.some((item) => item.uuid === patient.uuid) === false)
        if (items.some((item) => item.uuid === patient.uuid) === false) {
          try {
            addedEligiblePatientResponse = await entities.eligiblePatient.add({
              uuid: patient.uuid,
              isEligible: patient.isEligible,
              trialGroupAssignment: patient.trialGroupAssignment,
              doses: patient.doses||"0",
              hivViralLoad: patient.hivViralLoad
            }, nodePermissionsForEligiblePatient)
            console.log(`${patient.uuid} Added to EligiblePatients`, patient)
            console.log(addedEligiblePatientResponse)
          } catch (err) {
            console.log(err)
          }
        }
      })

      listEligiblePatientsFromEligiblePatientProperty();
    }

    // Deletes patients from EligiblePatient property who are no longer an eligible patient
    let deletedEligiblePatientResponse;
    const handleDeletePatientToEligiblePatientList = async () => {

      const { items } = await entities.eligiblePatient.list();
      console.log(items)
      const jhPatients = await entities.patient.list()

      // Delete patient from EligiblePatient if the patient uuid is not found in Patient
      items.map(async (item) => {
        console.log(jhPatients.items.some((patient) => patient.uuid === item.uuid) === false)
        if (jhPatients.items.some((patient) => patient.uuid === item.uuid) === false) {
          try {
            deletedEligiblePatientResponse = await entities.eligiblePatient.remove(item._id)
            console.log(deletedEligiblePatientResponse)
          } catch (err) {
            console.log(err)
          }
        }
      })

      listEligiblePatientsFromEligiblePatientProperty();
    }

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
      (...treatmentGroup)
      // Assign the second half of patients to the control group.
      const controlGroup = shuffledPatients;
      setControlPatientGroup(...controlGroup)

      // Quantity of patients who already received a trial group assignment, that is used to subtract from the quantity of requested drugs
      console.log("treatmentGroupAlreadyAssignedDrugsCount", treatmentGroup.filter(patient => patient.trialGroupAssignment === "Generic"))
      console.log("controlGroupAlreadyAssignedDrugsCount", controlGroup.filter(patient => patient.trialGroupAssignment === "Placebo"))
      const treatmentGroupAlreadyAssignedDrugsCount = treatmentGroup.filter(patient => patient.trialGroupAssignment === "Generic").length
      const controlGroupAlreadyAssignedDrugsCount = controlGroup.filter(patient => patient.trialGroupAssignment === "Placebo").length
      
      let updateEligiblePatientResponse;
      // Update eligible patients' trialGroupAssignment property to their assigned values
      treatmentGroup.map(async (patient) => {
          console.log(patient)
          if(patient.trialGroupAssignment === null) {
            console.log("Trial Group Assignment initiated")
            try {
              updateEligiblePatientResponse = await entities.eligiblePatient.update({
                _id: patient._id,
                // uuid: patient.uuid,
                // isEligible: patient.isEligible,
                trialGroupAssignment: "Generic",
                trialMedication: {
                  placebo: null,
                  batchNumber: null,
                  id: null
                },
                // doses: patient.doses||"0",
                // hivViralLoad: "TBD"
              }, nodePermissionsForEligiblePatient)
              console.log(updateEligiblePatientResponse)
            } catch (err) {
              console.log(err)
            }
          }
      })

      controlGroup.map(async (patient) => {
        console.log(patient)
        if(patient.trialGroupAssignment === null) {
          console.log("Trial Group Assignment initiated")
          try {
            updateEligiblePatientResponse = await entities.eligiblePatient.update({
              _id: patient._id,
              // uuid: patient.uuid,
              // isEligible: patient.isEligible,
              trialGroupAssignment: "Placebo",
              trialMedication: {
                placebo: null,
                batchNumber: null,
                id: null
              },
              // doses: patient.doses||"0",
              // hivViralLoad: "TBD"
            }, nodePermissionsForEligiblePatient)
            console.log(updateEligiblePatientResponse)
          } catch (err) {
            console.log(err)
          }
        }
      })
      
      console.log("Requested Placebo", controlGroup.length,controlGroupAlreadyAssignedDrugsCount)
      console.log("Requested Generic", treatmentGroup.length,treatmentGroupAlreadyAssignedDrugsCount)
      requestDrugs(controlGroup.length - controlGroupAlreadyAssignedDrugsCount, treatmentGroup.length - treatmentGroupAlreadyAssignedDrugsCount)
      listEligiblePatientsFromEligiblePatientProperty()
    }
    
    // Method to request drugs from Bavaria required for the clinical trial 
    let createClinicalTrialDrugRequestResponse;
    const requestDrugs = async (controlGroupDrugBatches, treatmentGroupDrugBatches) => {
      // Update ClinicalTrialDrugRequest properties with required placebo and generic drug counts for the clinical trial 
      console.log("Control Patient Group Count: ", controlGroupDrugBatches)
      console.log("Treatment Patient Group Count: ", treatmentGroupDrugBatches)
      const { items } = await entities.clinicalTrialDrugRequest2.list()
      console.log(items)
      if(items.length === 0) {
        try {
          createClinicalTrialDrugRequestResponse = await entities.clinicalTrialDrugRequest2.add({
            placeboDrugRequestCount: controlGroupDrugBatches,
            genericDrugRequestCount: treatmentGroupDrugBatches,
          })
          console.log(createClinicalTrialDrugRequestResponse)
        } catch (err) {
          console.log(err)
        }
      } else {
        try {
          createClinicalTrialDrugRequestResponse = await entities.clinicalTrialDrugRequest2.update({
            _id: items[0]._id,
            placeboDrugRequestCount: controlGroupDrugBatches,
            genericDrugRequestCount: treatmentGroupDrugBatches,
          })
          console.log(createClinicalTrialDrugRequestResponse)
        } catch (err) {
          console.log(err)
        }
      }
    }

    // "currentMedications": {
    //   "type": "array",
    //   "items": {
    //     "type": "object",
    //     "properties": {
    //       "medication": {
    //         "type": "object",
    //         "properties": {
    //           "id": {
    //             "type": "string"
    //           },
    //           "batchNumber": {
    //             "type": "string"
    //           }
    //         }
    //       }
    //     }
    //   }
    // },
    

    // Map Received Drugs to Patients

    let mapDrugToPatientResponse;
    const mapDrugsToPatients = async (drugs) => {
      const { items } = await entities.drug.list();

      const receivedPlacebo = items.filter((drug) => drug.placebo === true)
      const receivedGeneric = items.filter((drug) => drug.placebo === false)

      console.log(receivedPlacebo, receivedGeneric)

      const patientList = await entities.patient.list()
      console.log(patientList)

      eligiblePatientsFDA.filter((patient) => patient.trialGroupAssignment === "Placebo").map(async (patient, index) => {

          // Generating unique id
          let unique_id = uuid()
          let small_id = unique_id.slice(0,12)
          const medicationArray = [{medication: small_id}]

          const updatedDrugIds = [{drugID:receivedPlacebo[index].id, rehashedDrugID:small_id}]

          // if(drugIds) {
          //   setDrugIds(...drugIds, updatedDrugIds)
          // } else {
          //   setDrugIds(updatedDrugIds)
          // }


          try {
            let matchedPatient = patientList.items.find((jhPatient) => jhPatient.uuid === patient.uuid)
            let patientResponse = await entities.patient.get(matchedPatient._id)

            console.log(patientResponse, patientResponse.currentMedications)

            // if(patientResponse.currentMedications === null) {
            //   patientResponse.currentMedications = [{medication: small_id}]
            // } else {
            //   patientResponse.currentMedications = [...patientResponse.currentMedications, {medication: small_id}]
            // }
            
            patientResponse.currentMedications = medicationArray
            console.log("Updated Patient ", patientResponse)
            mapDrugToPatientResponse = await entities.patient.update(patientResponse)

            console.log("Success: Placebo Drug Mapped To Patient Property", mapDrugToPatientResponse)
          } catch (err) {
            console.log("Failed: Placebo Drug Mapped To Patient Property\n", err)
          }

          try {
            mapDrugToPatientResponse = await entities.eligiblePatient.update({
              _id: patient._id,
              trialMedication: {
                placebo: receivedPlacebo[index].placebo,
                batchNumber: receivedPlacebo[index].batchNumber,
                // Rehash Id
                id: small_id
              },
            }, nodePermissionsForEligiblePatient)
            console.log("Success: Placebo Drug Mapped To EligiblePatient Property", mapDrugToPatientResponse)
          } catch (err) {
            console.log("Failed: Placebo Drug Mapped To EligiblePatient Property", err)
          }

           //     const icdString =
          //   values.icd ||
          //   patient.icdHealthCodes.map((code) => code.code).join(", ");
          // const icdDefaultArray = patient.icdHealthCodes
          //   ? patient.icdHealthCodes.map((code) => ({ code: code.code }))
          //   : [];
          // const icdArray = icdString
          //   ? icdString.split(",").map((icdCode) => ({ code: icdCode.trim() }))
          //   : icdDefaultArray




          // solution may require moving assignment to Patient property currentMedications in different method, and called fully at the end, or break them down into two methods, and then call each method in separate try statements within a handleDrugMappingToPatient method

        
      })

      eligiblePatientsFDA.filter((patient) => patient.trialGroupAssignment === "Generic").map(async (patient, index) => {
          
          // Generating unique id
          let unique_id = uuid()
          let small_id = unique_id.slice(0,12)
          const medicationArray = [{medication: small_id}]

          const updatedDrugIds = [{drugID:receivedGeneric[index].id, rehashedDrugID:small_id}]

          // if(drugIds) {
          //   setDrugIds(...drugIds, updatedDrugIds)
          // } else {
          //   setDrugIds(updatedDrugIds)
          // }


          try {
            let matchedPatient = patientList.items.find((jhPatient) => jhPatient.uuid === patient.uuid)
            let patientResponse = await entities.patient.get(matchedPatient._id)

            console.log(patientResponse, patientResponse.currentMedications)

            // if(patientResponse.currentMedications === null) {
            //   patientResponse.currentMedications = [{medication: small_id}]
            // } else {
            //   patientResponse.currentMedications = [...patientResponse.currentMedications, {medication: small_id}]
            // }

            patientResponse.currentMedications = medicationArray
            console.log("Updated Patient ", patientResponse)
            mapDrugToPatientResponse = await entities.patient.update(patientResponse)

            console.log("Success: Generic Drug Mapped To Patient Property", mapDrugToPatientResponse)
          } catch (err) {
            console.log("Failed: Generic Drug Mapped To Patient\n", err)
          }
          
          try {
            mapDrugToPatientResponse = await entities.eligiblePatient.update({
              _id: patient._id,
              trialMedication: {
                placebo: receivedGeneric[index].placebo,
                batchNumber: receivedGeneric[index].batchNumber,
                // Rehash Id
                id: small_id
              },
            }, nodePermissionsForEligiblePatient)
            console.log("Success: Generic Drug Mapped To EligiblePatient Property", mapDrugToPatientResponse)
          } catch (err) {
            console.log("Failed: Generic Drug Mapped To EligiblePatient Property", err)
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
      handleAddPatientToEligiblePatientList()
      handleDeletePatientToEligiblePatientList()
      //listEligiblePatientsFromPatientProperty();
    }, []);

    // useEffect(() => {
    //  // handleAddPatientToEligiblePatientList();
    //   //handleDeletePatientToEligiblePatientList();
    // }, [eligiblePatientsFDA]);


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
      ];

      return (
        
        <Box m="20px">
          <Header title="Patient List" />
          <Button onClick={assignPatientsToTreatmentOrControlGroup} color="custom" variant="contained">
            Assign Patients To A Treatment Or Control Group
          </Button>
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
              <DataGrid checkboxSelection rows={eligiblePatientsFDA} columns={columns} getRowId={getRowId} /> 
            </div>
          </Box>
        </Box>
    );
};

export default Patient;