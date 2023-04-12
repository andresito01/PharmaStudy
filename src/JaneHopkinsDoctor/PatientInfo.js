import { useParams, Link  } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import useJaneHopkins from "../hooks/useJaneHopkins";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import Header from "../components/Header";
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useRef } from 'react';


const PatientInfo = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const formRef = useRef();
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  
  const { entities } = useJaneHopkins();
    useEffect(()=> {
        async function fetchPatient(){
            const fetchedPatient = await entities.patient.get(patientId);
            setPatient(fetchedPatient);
        }
        fetchPatient();
    }, [patientId]);
  
    if (!patient) {
      return <div>Loading...</div>;
    }

  

  const handleFormSubmit = async (values, { setSubmitting  }) => {
    console.log(values);
    try {
      setSubmitting(true);
      // Update patient data
      const icdString = values.icd;
      const icdArray = icdString ? icdString.split(",").map((icdCode) => ({ code: icdCode.trim() })) : [];
      const pregnancyCodes = [
        'O00', 'O01', 'O02', 'O03', 'O04', 'O05', 'O06', 'O07', 'O08', 'O09', 'O10', 'O11', 'O12', 'O13', 'O14', 'O15', 'O16', 'O20', 'O21', 'O22', 'O23', 'O24', 'O25', 'O26', 'O28', 'O29', 'O30', 'O31', 'O32', 'O33', 'O34', 'O35', 'O36', 'O37', 'O38', 'O39', 'O40', 'O41', 'O42', 'O43', 'O44', 'O45', 'O46', 'O47', 'O48','O49', 'O50', 'O51', 'O52', 'O53', 'O54', 'O55', 'O56', 'O57', 'O58', 'O59', 'O60', 'O61', 'O62', 'O63', 'O64', 'O65', 'O66', 'O67', 'O68', 'O69', 'O70', 'O71', 'O72', 'O73', 'O74', 'O75', 'O76', 'O77', 'O78', 'O79', 'O80', 'O81', 'O82', 'O83', 'O84', 'O85', 'O86', 'O87', 'O88', 'O89', 'O90', 'O91', 'O92', 'O93', 'O94', 'O95', 'O96', 'O97', 'O98', 'O99'
      ];
      if (icdArray.some(icd => pregnancyCodes.includes(icd.code)) || new Date(values.dob) >= new Date("2005-01-01")) {
        const response = await entities.patient.update({
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
          icdHealthCodes: icdArray,
          isEligible: false
        });
      }else {
        const response = await entities.patient.update({
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
          icdHealthCodes: icdArray,
          isEligible: true
        });
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
  
    // return (
    //   <div>
    //     <h1>Patient Information</h1>
    //     <p>ID: {patient._id}</p>
    //     <p>Name: {patient.name}</p>
    //     <p>DOB: {patient.dob}</p>
    //     <p>Insurance Number: {patient.insuranceNumber}</p>
    //     <p>ICD Health Codes: {patient.icdHealthCodes.map(icdCode => icdCode.code).join(", ")}</p>
    //   </div>
    // );
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
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Full Name"
                defaultValue={patient.name}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.firstName}
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
                //value={values.patientPicture}
                name="patientPicture"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="DOB"
                defaultValue={patient.dob}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.dob}
                name="dob"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Height"
                defaultValue={patient.height}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.height}
                name="height"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Blood Pressure"
                defaultValue={patient.bloodPressure}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.bloodPressure}
                name="bloodPressure"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Blood Type"
                defaultValue={patient.bloodType}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.bloodType}
                name="bloodType"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Insurance Number"
                defaultValue={patient.insuranceNumber}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.insuranceNumber}
                name="insuranceNumber"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Weight"
                defaultValue={patient.weight}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.weight}
                name="weight"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Temperature"
                defaultValue={patient.temperature}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.temperature}
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
                //value={values.oxygenSaturation}
                name="oxygenSaturation"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="UUID"
                defaultValue={patient.uuid}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.uuid}
                name="uuid"
                sx={{ gridColumn: "span 2" }}
              />
               <TextField
                disabled={!isEditing}
                fullWidth
                label="Allergies"
                defaultValue={patient.allergies ? patient.allergies.map(med => med.medication).join(", ") : ""}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.allergies}
                name="allergies"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Address"
                defaultValue={patient.address}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.address}
                name="address"
                sx={{ gridColumn: "span 2" }}
              /> 
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Current medications"
                defaultValue={patient.currentMedications ? patient.currentMedications.map(med => med.medication).join(", ") : ""}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.currentMedications}
                name="currentMedications"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                disabled={!isEditing}
                fullWidth
                label="Currently employed"
                defaultValue={patient.currentlyEmployed}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.currentlyEmployed}
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
                //value={values.currentlyInsured}
                name="currentlyInsured"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                disabled={!isEditing}
                label="Family history"
                defaultValue={patient.familyHistory}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.familyHistory}
                name="familyHistory"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                disabled={!isEditing}
                label="ICD health codes"
                defaultValue={patient.icdHealthCodes ? patient.icdHealthCodes.map((code) => code.code).join(", ") : ""}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.icd}
                name="icd"
                sx={{ gridColumn: "3/4" }}
              />
              <TextField
                fullWidth
                disabled={!isEditing}
                label="HIV Viral Load"
                defaultValue={patient.hiv}
                onBlur={handleBlur}
                onChange={handleChange}
                //value={values.hiv}
                name="hiv"
                sx={{ gridColumn: "4/4" }}
              /> 
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
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
                  <Button color="error" variant="contained" onClick={() => setIsEditing(false)} sx={{padding: "5px 20px" }}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button type="submit" color="custom" variant="contained" onClick={() => setIsEditing(true)}
              >
                Edit Patient
              </Button>
              )}
              
              <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
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

const initialValues = {
  // dob: "11",
  // insuranceNumber: "",
  // height: "",
  // weight: "",
  // bloodPressure: "",
  // bloodType: "",
  // temperature: "",
  // oxygenSaturation: "",
  // uuid: "",
  // address: "",
  // allergies: "",
  // currentMedications: "",
  // familyHistory: "",
  // currentlyEmployed: "",
  // currentlyInsured: "",
  // icd: "",
  // hiv: "",
};

export default PatientInfo;