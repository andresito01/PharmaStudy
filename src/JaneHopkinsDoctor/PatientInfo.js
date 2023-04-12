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
import EventAvailableIcon from '@mui/icons-material/EventAvailable';


const PatientInfo = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const formRef = useRef();
  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [showVisitField, setShowVisitField] = useState(false);

  
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
      // console.log("patient.icdHealthCodes", patient.icdHealthCodes);
      // console.log("values.icd",values.icd);
      // const icdString = values.icd;
      // const icdArray = icdString ? icdString.split(",").map((icdCode) => ({ code: icdCode.trim() })) : [patient.icdHealthCodes];
      // console.log("icdArray",icdArray);

      const icdString = values.icd || patient.icdHealthCodes.map((code) => code.code).join(", ");
      const icdDefaultArray = patient.icdHealthCodes ? patient.icdHealthCodes.map((code) => ({ code: code.code })) : [];
      const icdArray = icdString ? icdString.split(",").map((icdCode) => ({ code: icdCode.trim() })) : icdDefaultArray;

      const defaultDob = values.dob ? values.dob : patient.dob

      const pregnancyCodes = [
        'O00', 'O01', 'O02', 'O03', 'O04', 'O05', 'O06', 'O07', 'O08', 'O09', 'O10', 'O11', 'O12', 'O13', 'O14', 'O15', 'O16', 'O20', 'O21', 'O22', 'O23', 'O24', 'O25', 'O26', 'O28', 'O29', 'O30', 'O31', 'O32', 'O33', 'O34', 'O35', 'O36', 'O37', 'O38', 'O39', 'O40', 'O41', 'O42', 'O43', 'O44', 'O45', 'O46', 'O47', 'O48','O49', 'O50', 'O51', 'O52', 'O53', 'O54', 'O55', 'O56', 'O57', 'O58', 'O59', 'O60', 'O61', 'O62', 'O63', 'O64', 'O65', 'O66', 'O67', 'O68', 'O69', 'O70', 'O71', 'O72', 'O73', 'O74', 'O75', 'O76', 'O77', 'O78', 'O79', 'O80', 'O81', 'O82', 'O83', 'O84', 'O85', 'O86', 'O87', 'O88', 'O89', 'O90', 'O91', 'O92', 'O93', 'O94', 'O95', 'O96', 'O97', 'O98', 'O99'
      ];

      const visitsArray = patient.visits ? patient.visits.map((visit) => ({ dateTime: visit.dateTime, notes: visit.notes, hivViralLoad: visit.hivViralLoad })) : [];
      const visits = [];
      let index = 0;
      while (values[`visit_${index}`]) {
        visits.push({
          dateTime: values[`visit_${index}`],
          notes: values[`visit_notes_${index}`],
          hivViralLoad: values[`visit_hiv_${index}`],
        });
        index++;
      }
      console.log('Visits:', visits);
      console.log('Values:', values);
      // Check if there are any visits missing from values.visits compared to patient.visits, and add them back in
      const updatedVisits = patient.visits.map((visit, index) => {
        const updatedVisit = visits[index];
        const result = updatedVisit || visit;
        console.log('Visit:', index, 'Original:', visit, 'Updated:', updatedVisit, 'Result:', result);
        return result;
      });

      if (icdArray.some(icd => pregnancyCodes.includes(icd.code)) || new Date(defaultDob) >= new Date("2005-01-01")) {
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
          doses: values.doses,
          //visits: updatedVisits,
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
          doses: values.doses,
          //visits: visits,
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

  const handleClickVisit = () => {
    setShowVisitField(true);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
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
                label="DOB"
                defaultValue={patient.dob}
                onBlur={handleBlur}
                onChange={handleChange}
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
                label="Allergies"
                defaultValue={patient.allergies ? patient.allergies.map(med => med.medication).join(", ") : ""}
                onBlur={handleBlur}
                onChange={handleChange}
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
              {isEditing ? (
                <Button color="success" variant="contained" endIcon={<EventAvailableIcon />} onClick={handleClickVisit} sx={{ gridColumn: "1" }}>
                Appointment
                </Button>
              ) : (
                <Button disabled color="success" variant="contained" endIcon={<EventAvailableIcon />} sx={{ gridColumn: "1" }}>
                Appointment
                </Button>
              )}
              
              <TextField
                fullWidth
                disabled={!isEditing}
                label="ICD health codes"
                defaultValue={patient.icdHealthCodes.map((code) => code.code).join(", ")}
                onBlur={handleBlur}
                onChange={handleChange}
                name="icd"
                sx={{ gridColumn: "3/4" }}
              />

              <TextField
                fullWidth
                disabled={!isEditing}
                label="Doses"
                defaultValue={patient.doses}
                onBlur={handleBlur}
                onChange={handleChange}
                name="doses"
                sx={{ gridColumn: "4/4" }}
              />    

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
              {patient.visits && patient.visits.length > 0 && patient.visits.map((visit, index) => {
              const updatedVisit = values.visits && values.visits[index];
              const dateTime = updatedVisit ? updatedVisit.dateTime : visit.dateTime;
              const notes = updatedVisit ? updatedVisit.notes : visit.notes;
              const hivViralLoad = updatedVisit ? updatedVisit.hivViralLoad : visit.hivViralLoad;

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
            })}
              
       
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

};

export default PatientInfo;