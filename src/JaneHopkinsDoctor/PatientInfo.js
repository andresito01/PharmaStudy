import { useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import useJaneHopkins from "../hooks/useJaneHopkins";
import { Box, Button, Typography, TextField, IconButton } from "@mui/material";
import { Formik } from "formik";
import Header from "../components/Header";
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useRef } from "react";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const PatientInfo = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const formRef = useRef();
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [showVisitField, setShowVisitField] = useState(false);

  const [numICD, setNumICD] = useState(1);
  const [numMedications, setNumMedications] = useState(1);
  const [numAllergies, setNumAllergies] = useState(1);
  const [numVisits, setNumVisits] = useState(1);
  
  
  const { entities } = useJaneHopkins();
  useEffect(() => {
    async function fetchPatient() {
      const fetchedPatient = await entities.patient.get(patientId);
      setPatient(fetchedPatient);
    }
    fetchPatient();
  }, [patientId]);



  useEffect(() => {
    if (patient && patient.icdHealthCodes) {
      setNumICD(patient.icdHealthCodes.length);
    }
  }, [patient]);

  useEffect(() => {
    if (patient && patient.allergies) {
      setNumAllergies(patient.allergies.length);
    }
  }, [patient]);

  useEffect(() => {
    if (patient && patient.visits) {
      setNumVisits(patient.visits.length);
    }
  }, [patient]);

  useEffect(() => {
    if (patient && patient.currentMedications) {
      setNumMedications(patient.currentMedications.length);
    }
  }, [patient]);

  const removeVisitsRow = () => {
    setNumVisits(numVisits - 1);
  };



  if (!patient) {
    return <div>Loading...</div>;
  }

  const removeICDRow = (indexToRemove) => {
    setNumICD((prevNumICD) => {
      // Remove the specific row by filtering out the unwanted index
      const newICDHealthCodes = patient.icdHealthCodes.filter(
        (_, i) => i !== indexToRemove
      );
      // Update the patient object
      setPatient({ ...patient, icdHealthCodes: newICDHealthCodes });
      // Update the numICD count
      return prevNumICD - 1;
    });
  };

  const removeAllergiesRow = (indexToRemove) => {
    setNumAllergies((prevNumAllergies) => {
      // Remove the specific row by filtering out the unwanted index
      const newAllergies = patient.allergies.filter(
        (_, i) => i !== indexToRemove
      );
      // Update the patient object
      setPatient({ ...patient, allergies: newAllergies });
      // Update the numICD count
      return prevNumAllergies - 1;
    });
  };

  const removeMedicationRow = (indexToRemove) => {
    setNumMedications((prevNumMedications) => {
      // Remove the specific row by filtering out the unwanted index
      const newMedications = patient.currentMedications.filter(
        (_, i) => i !== indexToRemove
      );
      // Update the patient object
      setPatient({ ...patient, currentMedications: newMedications });
      // Update the numICD count
      return prevNumMedications - 1;
    });
  };

  const initialValues = {
    fullName: patient?.name || "",
    patientPicture: patient?.patientPicture || "",
    doses: patient?.doses || 0,
    // ...
    // Other fields here
    // ...
    ...((patient?.icdHealthCodes || []).reduce(
      (acc, code, index) => ({ ...acc, [`icd-${index}`]: code.code }),
      {}
    )),
    ...((patient?.currentMedications || []).reduce(
      (acc, medication, index) => ({ ...acc, [`medication-${index}`]: medication.medication }),
      {}
    )),
    ...((patient?.allergies || []).reduce(
      (acc, allergy, index) => ({ ...acc, [`allergy-${index}`]: allergy.allergy }),
      {}
    )),
    ...((patient?.visits || []).reduce(
      (acc, visit, index) => ({
        ...acc,
        [`patient-${index}`]: visit.patient,
        [`dateTime-${index}`]: visit.dateTime,
        [`notes-${index}`]: visit.notes,
        [`hivViralLoad-${index}`]: visit.hivViralLoad,
      }),
      {}
    )),
  };

 
  

  const handleAddICD = () => {
    setNumICD(numICD + 1);
  };

  const handleAddAllergies = () => {
    setNumAllergies(numAllergies + 1);
  };

  const handleAddMedications = () => {
    setNumMedications(numMedications + 1);
  };

  const handleAddVisit = () => {
    setNumVisits(numVisits + 1);
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    console.log(values);
    try {
      setSubmitting(true);
      // Update patient data
      // console.log("patient.icdHealthCodes", patient.icdHealthCodes);
      // console.log("values.icd",values.icd);
      // const icdString = values.icd;
      // const icdArray = icdString ? icdString.split(",").map((icdCode) => ({ code: icdCode.trim() })) : [patient.icdHealthCodes];
      // console.log("icdArray",icdArray);

      const icdCodes = [];
      for (let i = 0; i < numICD; i++) {
        const key = `icd-${i}`;
        if (values[key]) {
          icdCodes.push({ code: values[key].trim() });
        }
      }

      const allergies = [];
      for (let i = 0; i < numAllergies; i++) {
        const key = `allergy-${i}`;
        if (values[key]) {
          allergies.push({ allergy: values[key].trim() });
        }
      }

      const currentMedications = [];
      for (let i = 0; i < numMedications; i++) {
        const key = `medication-${i}`;
        if (values[key]) {
          currentMedications.push({ medication: values[key].trim() });
        }
      }

      const visitData = [];
      for (let i = 0; i < numVisits; i++) {
        const dateTimeKey = `dateTime-${i}`;
        const notesKey = `notes-${i}`;
        const hivViralLoadKey = `hivViralLoad-${i}`;
      
        const visit = {
          patient: patient._id,
          dateTime: values[dateTimeKey],
          notes: values[notesKey],
          hivViralLoad: values[hivViralLoadKey],
        };
        visitData.push(visit);
      }

      const icdString =
        values.icd ||
        patient.icdHealthCodes.map((code) => code.code).join(", ");
      const icdDefaultArray = patient.icdHealthCodes
        ? patient.icdHealthCodes.map((code) => ({ code: code.code }))
        : [];
      const icdArray = icdString
        ? icdString.split(",").map((icdCode) => ({ code: icdCode.trim() }))
        : icdDefaultArray;

        const allergiesString =
        values.allergies ||
        patient.allergies.map((allergy) => allergy.allergy).join(", ");
      const allergiesDefaultArray = patient.allergies
        ? patient.allergies.map((allergy) => ({ allergy: allergy.allergy }))
        : [];
      const allergiesArray = allergiesString
        ? allergiesString.split(",").map((allergiesCode) => ({ allergy: allergiesCode.trim() }))
        : allergiesDefaultArray;

      const defaultDob = values.dob ? values.dob : patient.dob;

      const pregnancyCodes = [
        "O00",
        "O01",
        "O02",
        "O03",
        "O04",
        "O05",
        "O06",
        "O07",
        "O08",
        "O09",
        "O10",
        "O11",
        "O12",
        "O13",
        "O14",
        "O15",
        "O16",
        "O20",
        "O21",
        "O22",
        "O23",
        "O24",
        "O25",
        "O26",
        "O28",
        "O29",
        "O30",
        "O31",
        "O32",
        "O33",
        "O34",
        "O35",
        "O36",
        "O37",
        "O38",
        "O39",
        "O40",
        "O41",
        "O42",
        "O43",
        "O44",
        "O45",
        "O46",
        "O47",
        "O48",
        "O49",
        "O50",
        "O51",
        "O52",
        "O53",
        "O54",
        "O55",
        "O56",
        "O57",
        "O58",
        "O59",
        "O60",
        "O61",
        "O62",
        "O63",
        "O64",
        "O65",
        "O66",
        "O67",
        "O68",
        "O69",
        "O70",
        "O71",
        "O72",
        "O73",
        "O74",
        "O75",
        "O76",
        "O77",
        "O78",
        "O79",
        "O80",
        "O81",
        "O82",
        "O83",
        "O84",
        "O85",
        "O86",
        "O87",
        "O88",
        "O89",
        "O90",
        "O91",
        "O92",
        "O93",
        "O94",
        "O95",
        "O96",
        "O97",
        "O98",
        "O99",
      ];

      // const visitsArray = patient.visits ? patient.visits.map((visit) => ({ dateTime: visit.dateTime, notes: visit.notes, hivViralLoad: visit.hivViralLoad })) : [];
      // const visits = [];
      // let index = 0;
      // while (values[`visit_${index}`]) {
      //   visits.push({
      //     dateTime: values[`visit_${index}`],
      //     notes: values[`visit_notes_${index}`],
      //     hivViralLoad: values[`visit_hiv_${index}`],
      //   });
      //   index++;
      // }
      // console.log('Visits:', visits);
      // console.log('Values:', values);
      // // Check if there are any visits missing from values.visits compared to patient.visits, and add them back in
      // const updatedVisits = patient.visits.map((visit, index) => {
      //   const updatedVisit = visits[index];
      //   const result = updatedVisit || visit;
      //   console.log('Visit:', index, 'Original:', visit, 'Updated:', updatedVisit, 'Result:', result);
      //   return result;
      // });

      if (
        icdArray.some((icd) => pregnancyCodes.includes(icd.code)) ||
        new Date(defaultDob) >= new Date("2005-01-01")
      ) {
        // Providing acl node permissions that restricts FDA and Bavaria from access to READ and WRITE permissions on non eligible patients
        let nodePermissions = {
          aclInput: {
            acl: [
              {
                principal: {
                  nodes: [],
                },
                operations: ["READ"],
              },
            ],
          },
        };
        const response = await entities.patient.update(
          {
            _id: patient._id,
            name: values.fullName,
            patientPicture: values.patientPicture,
            dob: values.dob,
            insuranceNumber: values.insuranceNumber,
            height: values.height,
            weight: values.weight,
            bloodPressure: values.bloodPressure,
            temperature: values.temperature,
            oxygenSaturation: values.oxygenSaturation,
            uuid: values.uuid,
            address: values.address,
            familyHistory: values.familyHistory,
            currentlyEmployed: values.currentlyEmployed,
            currentlyInsured: values.currentlyInsured,
            icdHealthCodes: icdCodes,
            doses: values.doses,
            allergies: allergies,
            currentMedications: currentMedications,
            visits: visitData,
            isEligible: false,
          },
          nodePermissions
        );
        setIsEditing(false);
      } else {
        // Providing acl node permissions that restricts FDA and Bavaria to READ Patient properties: uuid, currentMedications (And Write Permissions), isEligible, doses
        let nodePermissions = {
          aclInput: {
            acl: [
              {
                principal: {
                  nodes: ["FDA", "Bavaria"],
                },
                operations: ["READ", "WRITE"],
                path: "uuid",
              },
              {
                principal: {
                  nodes: ["FDA"],
                },
                operations: ["READ", "WRITE"],
                path: "currentMedications",
              },
              {
                principal: {
                  nodes: ["FDA", "Bavaria"],
                },
                operations: ["READ"],
                path: "isEligible",
              },
              {
                principal: {
                  nodes: ["FDA", "Bavaria"],
                },
                operations: ["READ"],
                path: "doses",
              },
            ],
          },
        };
        const response = await entities.patient.update(
          {
            _id: patient._id,
            name: values.fullName,
            patientPicture: values.patientPicture,
            dob: values.dob,
            insuranceNumber: values.insuranceNumber,
            height: values.height,
            weight: values.weight,
            bloodPressure: values.bloodPressure,
            temperature: values.temperature,
            oxygenSaturation: values.oxygenSaturation,
            uuid: values.uuid,
            address: values.address,
            familyHistory: values.familyHistory,
            currentlyEmployed: values.currentlyEmployed,
            currentlyInsured: values.currentlyInsured,
            icdHealthCodes: icdCodes,
            doses: values.doses,
            allergies: allergies,
            currentMedications: currentMedications,
            visits: visitData,
            isEligible: true,
          },
          nodePermissions
        );
        setIsEditing(false);
      }

      // Show success message
      setOpen(true);

      // Set the isEditing state to false to exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateObjectKeys = (obj, updateFn) => {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = updateFn(key);
      if (newKey) {
        acc[newKey] = obj[key];
      }
      return acc;
    }, {});
  };

  const handleRemoveVisit = (index) => {
    setNumVisits((prevNumVisits) => prevNumVisits - 1);
    setPatient((prevState) => {
      const updatedVisits = [...prevState.visits];
      updatedVisits.splice(index, 1);
      const updatedPatient = { ...prevState, visits: updatedVisits };
  
      updatedPatient.visits = updatedPatient.visits.map((visit, idx) => {
        if (idx >= index) {
          visit.patient = `patient-${idx}`;
          visit.dateTime = `dateTime-${idx}`;
          visit.notes = `notes-${idx}`;
          visit.hivViralLoad = `hivViralLoad-${idx}`;
        }
        return visit;
      });
  
      return updatedPatient;
    });
  };

  return (
    <Box m="20px">
      <Header title="PATIENT INFORMATION" subtitle="Detail Information" />

      <Formik
        innerRef={formRef}
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
      >
        {({
          values,
          setSubmitting,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              gap="30px"
              flexDirection="column"
              width="50%"
            >
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Full Name"
                defaultValue={patient.name}
                onBlur={handleBlur}
                onChange={handleChange}
                name="fullName"
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                disabled={!isEditing}
                fullWidth
                label="Patient Picture Link"
                defaultValue={patient.patientPicture}
                onBlur={handleBlur}
                onChange={handleChange}
                name="patientPicture"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Insurance Number"
                defaultValue={patient.insuranceNumber}
                onBlur={handleBlur}
                onChange={handleChange}
                name="insuranceNumber"
                sx={{ gridColumn: "span 1" }}
              />
              <Box display="flex" gap="30px">
                <TextField
                  disabled={!isEditing}
                  fullWidth
                  label="DOB"
                  defaultValue={patient.dob}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="dob"
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  disabled={!isEditing}
                  fullWidth
                  label="Height"
                  defaultValue={patient.height}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="height"
                  sx={{ gridColumn: "span 2" }}
                />
              </Box>
              <Box display="flex" gap="30px">
                <TextField
                  disabled={!isEditing}
                  fullWidth
                  label="Blood Pressure"
                  defaultValue={patient.bloodPressure}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="bloodPressure"
                  sx={{ gridColumn: "span 1" }}
                />
                
                <TextField
                  disabled={!isEditing}
                  fullWidth
                  label="Weight"
                  defaultValue={patient.weight}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="weight"
                  sx={{ gridColumn: "span 1" }}
                />
              </Box>
              <Box display="flex" gap="30px">
                <TextField
                  disabled={!isEditing}
                  fullWidth
                  label="Temperature"
                  defaultValue={patient.temperature}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="temperature"
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  disabled={!isEditing}
                  fullWidth
                  label="Oxygen Saturation"
                  defaultValue={patient.oxygenSaturation}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="oxygenSaturation"
                  sx={{ gridColumn: "span 1" }}
                />
              </Box>
              <TextField
                disabled={!isEditing}
                fullWidth
                label="UUID"
                defaultValue={patient.uuid}
                onBlur={handleBlur}
                onChange={handleChange}
                name="uuid"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Address"
                defaultValue={patient.address}
                onBlur={handleBlur}
                onChange={handleChange}
                name="address"
                sx={{ gridColumn: "span 2" }}
              />
              <Box display="flex" gap="30px">
                <TextField
                  disabled={!isEditing}
                  fullWidth
                  label="Currently employed"
                  defaultValue={patient.currentlyEmployed}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="currentlyEmployed"
                  sx={{ gridColumn: "span 1" }}
                />
                <TextField
                  disabled={!isEditing}
                  fullWidth
                  label="Currently insured"
                  defaultValue={patient.currentlyInsured}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  name="currentlyInsured"
                  sx={{ gridColumn: "span 1" }}
                />
              </Box>
              {/* <TextField
                disabled={!isEditing}
                fullWidth
                label="Allergies"
                defaultValue={
                  patient.allergies
                  .map((allergy) => allergy.allergy)
                  .join(", ")
                }
                onBlur={handleBlur}
                onChange={handleChange}
                name="allergies"
                sx={{ gridColumn: "span 2" }}
              /> */}

              <TextField
                fullWidth
                disabled={!isEditing}
                label="Family history"
                defaultValue={patient.familyHistory}
                onBlur={handleBlur}
                onChange={handleChange}
                name="familyHistory"
                sx={{ gridColumn: "span 2" }}
              />
              
              {/* <TextField
                fullWidth
                disabled={!isEditing}
                label="ICD health codes"
                defaultValue={patient.icdHealthCodes
                  .map((code) => code.code)
                  .join(", ")}
                onBlur={handleBlur}
                onChange={handleChange}
                name="icd"
                sx={{ gridColumn: "3/4" }}
              /> */}

              
              <Box display="flex" gap="30px">
                    <Typography 
                      variant="h3"
                      fontWeight="bold"
                    >
                      ICD Health Codes
                    </Typography>
                    <Button
                        disabled={!isEditing}
                        color="custom"
                        variant="contained"
                        onClick={handleAddICD}
                      >
                        <AddCircleIcon/>
                        </Button>
              </Box>

                {[...Array(numICD)].map((_, index) => (
                  <Box display="flex" gap="30px">
                          <TextField
                            key={index}
                            fullWidth
                            disabled={!isEditing}
                            defaultValue={
                              patient.icdHealthCodes[index]
                                ? patient.icdHealthCodes[index].code
                                : ""
                            }
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name={`icd-${index}`}
                            sx={{ gridColumn: "span 2" }}
                            label={`ICD Health Code ${index + 1}`}
                          />
                          {index >= 0 && (
                            <Button
                            disabled={!isEditing}
                            color="error"
                            variant="contained"
                              onClick={() => {
                                removeICDRow(index);
                              }}
                              
                            >
                              <HighlightOffIcon/>
                            </Button>
                          )}
                          </Box>
                        ))}

                  <Box display="flex" gap="30px">
                    <Typography 
                      variant="h3"
                      fontWeight="bold"
                    >
                      Allergies
                    </Typography>
                    <Button
                      disabled={!isEditing}
                        color="custom"
                        variant="contained"
                        onClick={handleAddAllergies}
                      >
                        <AddCircleIcon/>
                        </Button>
              </Box>

                {[...Array(numAllergies)].map((_, index) => (
                  <Box display="flex" gap="30px">
                          <TextField
                            key={index}
                            fullWidth
                            disabled={!isEditing}
                            defaultValue={
                              (patient?.allergies || [])[index]
                                ? (patient?.allergies || [])[index].allergy
                                : ""
                            }
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name={`allergy-${index}`}
                            sx={{ gridColumn: "span 2" }}
                            label={`Allergy ${index + 1}`}
                          />
                          {index >= 0 && (
                            <Button
                            disabled={!isEditing}
                            color="error"
                            variant="contained"
                              onClick={() => {
                                removeAllergiesRow(index);
                              }}
                              
                            >
                              <HighlightOffIcon/>
                            </Button>
                          )}
                          </Box>
                        ))}

            <Box display="flex" gap="30px">
                    <Typography 
                      variant="h3"
                      fontWeight="bold"
                    >
                      Current Medication
                    </Typography>
                    <Button
                        disabled={!isEditing}
                        color="custom"
                        variant="contained"
                        onClick={handleAddMedications}
                      >
                        <AddCircleIcon/>
                        </Button>
              </Box>

                {[...Array(numMedications)].map((_, index) => (
                  <Box display="flex" gap="30px">
                          <TextField
                            key={index}
                            fullWidth
                            disabled={!isEditing}
                            defaultValue={
                              (patient?.currentMedications || [])[index]
                                ? (patient?.currentMedications || [])[index].medication
                                : ""
                            }
                            onBlur={handleBlur}
                            onChange={handleChange}
                            name={`medication-${index}`}
                            sx={{ gridColumn: "span 2" }}
                            label={`Medication ${index + 1}`}
                          />
                          {index >= 0 && (
                            <Button
                            disabled={!isEditing}
                            color="error"
                            variant="contained"
                              onClick={() => {
                                removeMedicationRow(index);
                              }}
                              
                            >
                              <HighlightOffIcon/>
                            </Button>
                          )}
                          </Box>
                        ))}


              {/* {isEditing ? (
                <Button
                  color="success"
                  variant="contained"
                  endIcon={<EventAvailableIcon />}
                  onClick={handleClickVisit}
                  sx={{ gridColumn: "1" }}
                >
                  Appointment
                </Button>
              ) : (
                <Button
                  disabled
                  color="success"
                  variant="contained"
                  endIcon={<EventAvailableIcon />}
                  sx={{ gridColumn: "1" }}
                >
                  Appointment
                </Button>
              )} */}

              {/* {showVisitField && (
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label="Date"
                        defaultValue={
                          patient.visits ? patient.visits.map((visit) => new Date(visit.dateTime).toLocaleDateString()).join(", ") : ""
                        }
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name="visitDate"
                        sx={{ gridColumn: "span 2" }}
                      />
                      
              )} */}

              <Box display="flex" gap="30px">
                    <Typography 
                      variant="h3"
                      fontWeight="bold"
                    >
                      Visits
                    </Typography>
                    <Button
                        disabled={!isEditing}
                        color="custom"
                        variant="contained"
                        onClick={handleAddVisit}
                      >
                        <EventAvailableIcon/>
                        </Button>
              </Box>

              
              {[...Array(numVisits)].map((_, index) => (
                    <Box display="flex"
                    gap="30px"
                    flexDirection="column"
                    key={index}>
                      <Box display="flex" gap="30px">
                        <TextField
                          label="Patient"
                          name={`patient-${index}`}
                          defaultValue={
                            (patient?.visits || [])[index]
                              ? (patient?.visits || [])[index].patient
                              : ""
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={!isEditing}
                          fullWidth
                        />
                        {index >= 0 && (
                          <Button
                            disabled={!isEditing}
                            color="error"
                            variant="contained"
                            onClick={() => {
                              // const updatedValues = { ...initialValues };
                              // delete updatedValues[`patient-${index}`];
                              // delete updatedValues[`dateTime-${index}`];
                              // delete updatedValues[`notes-${index}`];
                              // delete updatedValues[`hivViralLoad-${index}`];
                              // setInitialValues(updatedValues);
                              removeVisitsRow();
                            }}
                          >
                            <HighlightOffIcon />
                          </Button>
                        )}
                      </Box>
                      <Box display="flex" gap="30px">
                        <TextField
                          label="Date Time"
                          name={`dateTime-${index}`}
                          defaultValue={
                            (patient?.visits || [])[index]
                              ? (patient?.visits || [])[index].dateTime
                              : ""
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={!isEditing}
                          fullWidth
                        />
                      </Box>
                      <Box display="flex" gap="30px">
                        <TextField
                          label="Notes"
                          name={`notes-${index}`}
                          defaultValue={
                            (patient?.visits || [])[index]
                              ? (patient?.visits || [])[index].notes
                              : ""
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={!isEditing}
                          fullWidth
                        />
                      </Box>
                      <Box display="flex" gap="30px">
                        <TextField
                          label="HIV Viral Load"
                          name={`hivViralLoad-${index}`}
                          defaultValue={
                            (patient?.visits || [])[index]
                              ? (patient?.visits || [])[index].hivViralLoad
                              : ""
                          }
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={!isEditing}
                          fullWidth
                        />
                        
                      </Box>
                    </Box>
                  ))
              }

            <Box display="flex" gap="30px" width = "50%">
              <TextField
                fullWidth
                disabled={!isEditing}
                label="Doses"
                defaultValue={patient.doses}
                onBlur={handleBlur}
                onChange={handleChange}
                name="doses"
                sx={{ gridColumn: "span 1" }}
              />
            </Box>
            

              {/* {patient.visits &&
                patient.visits.length > 0 &&
                patient.visits.map((visit, index) => {
                  const updatedVisit = values.visits && values.visits[index];
                  const dateTime = updatedVisit
                    ? updatedVisit.dateTime
                    : visit.dateTime;
                  const notes = updatedVisit ? updatedVisit.notes : visit.notes;
                  const hivViralLoad = updatedVisit
                    ? updatedVisit.hivViralLoad
                    : visit.hivViralLoad;

                  return (
                    <Box
                      key={index}
                      display="grid"
                      gap="30px"
                      sx={{ gridColumn: "span 2" }}
                    >
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label={`Visit ${index + 1}`}
                        value={dateTime}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name={`visit_${index}`}
                        sx={{ gridColumn: "span 4" }}
                      />
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label="Notes"
                        value={notes}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name={`visit_notes_${index}`}
                        sx={{ gridColumn: "span 4" }}
                      />
                      <TextField
                        fullWidth
                        disabled={!isEditing}
                        label="HIV Viral Load"
                        value={hivViralLoad}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name={`visit_hiv_${index}`}
                        sx={{ gridColumn: "span 4" }}
                      />
                    </Box>
                  );
                })} */}


            </Box>

            <Box display="flex" justifyContent="start" mt="20px">
              {isEditing ? (
                <>
                  <Button
                    color="custom"
                    variant="contained"
                    type="submit"
                    sx={{ mr: "15px", padding: "5px 20px" }}
                    onClick={() => handleFormSubmit(values, { setSubmitting })}
                  >
                    Update Patient
                  </Button>
                  <Button
                    color="error"
                    variant="contained"
                    onClick={() => setIsEditing(false)}
                    sx={{ padding: "5px 20px" }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  type="submit"
                  color="custom"
                  variant="contained"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Patient
                </Button>
              )}
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
              >
                <Alert
                  onClose={handleClose}
                  severity="success"
                  sx={{ width: "100%" }}
                >
                  Patient has been updated!
                </Alert>
              </Snackbar>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const initialValues = {};

export default PatientInfo;
