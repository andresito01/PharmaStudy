import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import useJaneHopkins from "../../hooks/useJaneHopkins";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import * as React from "react";
import { useRef } from "react";

const AddPatientJaneHopkins = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const formRef = useRef();

  const handleFormSubmit = (values) => {
    console.log(values);
    addPatient(values);
  };

  const [open, setOpen] = React.useState(false);
  const [addSuccess, setAddSuccess] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { entities } = useJaneHopkins();

  const addPatient = async (values) => {
    const icdString = values.icd;
    const icdArray = icdString
      .split(",")
      .map((icdCode) => ({ code: icdCode.trim() })); // convert each string into an ICD object with the 'code' property
    // Determine Eligible Patients
    // Exclude ICD-10 Pregnancy codes
    // Exclude DOB greater than 1/1/2005
    const patientDOBMinimumAge = new Date("01/01/2005");
    const patientDOB = new Date(values.dob);
    const ineligibleICD = "O00–O99";
    let eligibilityStatus = null;

    // Check for ineligible ICD Health Code - O00–O99
    console.log(icdArray);
    const patientIneligibleICD = icdArray.find(
      (icdHealthCode) => icdHealthCode.code === ineligibleICD
    );
    console.log(patientIneligibleICD);

    console.log(patientDOB.getTime() > patientDOBMinimumAge.getTime());

    if (
      patientDOB.getTime() < patientDOBMinimumAge.getTime() &&
      patientIneligibleICD === undefined
    ) {
      eligibilityStatus = true;
    } else {
      eligibilityStatus = false;
    }

    // Read and Write Restrictions on FDA and Bavaria Nodes
    // PII hidden from FDA and Bavaria
    let nodePermissions = null;
    eligibilityStatus === true
      ? (nodePermissions = {
          aclInput: {
            acl: [
              {
                principal: {
                  nodes: ["FDA", "Bavaria"],
                },
                operations: ["READ"],
                path: "uuid",
              },
              {
                principal: {
                  nodes: ["FDA", "Bavaria"],
                },
                operations: ["READ"],
                path: "isEligible",
              },
            ],
          },
        })
      : (nodePermissions = {
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
        });

    const addPatientResponse = await entities.patient.add(
      {
        name: values.firstName + " " + values.lastName,
        patientPicture: values.patientPicture,
        dob: values.dob,
        insuranceNumber: values.insuranceNumber,
        height: values.height,
        weight: values.weight,
        bloodPressure: values.bloodPressure,
        // bloodType: values.bloodType,
        temperature: values.temperature,
        oxygenSaturation: values.oxygenSaturation,
        uuid: values.uuid,
        address: values.address,
        // currentMedications: values.currentMedications,
        familyHistory: values.familyHistory,
        currentlyEmployed: values.currentlyEmployed,
        currentlyInsured: values.currentlyInsured,
        icdHealthCodes: icdArray,
        // allergies: values.allergies,
        // hiv: values.hiv,
        isEligible: eligibilityStatus,
      },
      nodePermissions
    );
    console.log(addPatientResponse);
    if (addPatientResponse?.transaction?._id != null) {
      handleClick();
      formRef.current.resetForm();
    }
  };

  return (
    <Box m="20px">
      <Header title="ADD PATIENT" subtitle="Create a New Patient Profile" />

      <Formik
        innerRef={formRef}
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
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
                fullWidth
                variant="filled"
                type="text"
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={!!touched.firstName && !!errors.firstName}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 1" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Patient Picture Link"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.patientPicture}
                name="patientPicture"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="DOB"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.dob}
                name="dob"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Height"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.height}
                name="height"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Blood Pressure"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bloodPressure}
                name="bloodPressure"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Blood Type"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.bloodType}
                name="bloodType"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Insurance Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.insuranceNumber}
                name="insuranceNumber"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Weight"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.weight}
                name="weight"
                sx={{ gridColumn: "span 1" }}
              />

              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Temperature"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.temperature}
                name="temperature"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Oxygen Saturation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.oxygenSaturation}
                name="oxygenSaturation"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="UUID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.uuid}
                name="uuid"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Allergies"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.allergies}
                name="allergies"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Address"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address}
                name="address"
                error={!!touched.address && !!errors.address}
                helperText={touched.address && errors.address}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Current medications"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.currentMedications}
                name="currentMedications"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Currently employed"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.currentlyEmployed}
                name="currentlyEmployed"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Currently insured"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.currentlyInsured}
                name="currentlyInsured"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Family history"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.familyHistory}
                name="familyHistory"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ICD health codes"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.icd}
                name="icd"
                sx={{ gridColumn: "3/4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="HIV Viral Load"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.hiv}
                name="hiv"
                sx={{ gridColumn: "4/4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                type="submit"
                color="custom"
                variant="contained"
                //onClick={handleClick}
              >
                Add New Patient
              </Button>
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
                  Patient has been added!
                </Alert>
              </Snackbar>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  address: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  dob: "",
  insuranceNumber: "",
  height: "",
  weight: "",
  bloodPressure: "",
  bloodType: "",
  temperature: "",
  oxygenSaturation: "",
  uuid: "",
  address: "",
  allergies: "",
  currentMedications: "",
  familyHistory: "",
  currentlyEmployed: "",
  currentlyInsured: "",
  icd: "",
  hiv: "",
};

export default AddPatientJaneHopkins;
