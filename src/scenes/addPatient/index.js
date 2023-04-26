import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import useJaneHopkins from "../../hooks/useJaneHopkins";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";
import * as React from "react";
import { useRef } from "react";
import { useMediaQuery } from "@mui/material";

const AddPatientJaneHopkins = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const formRef = useRef();

  const handleFormSubmit = (values) => {
    console.log(values);
    addPatient(values);
  };

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { entities } = useJaneHopkins();

  let addPatientResponse;
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
  const addPatient = async (values) => {
    const icdString = values.icd;
    const icdArray = icdString
      .split(",")
      .map((icdCode) => ({ code: icdCode.trim() })); // convert each string into an ICD object with the 'code' property

    if (
      icdArray.some((icd) => pregnancyCodes.includes(icd.code)) ||
      new Date(values.dob) >= new Date("2005-01-01")
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
      // patient is not eligible for the new drug
      addPatientResponse = await entities.patient.add(
        {
          name: values.firstName + " " + values.lastName,
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
          isEligible: false,
          // bloodType: values.bloodType,
          // currentMedications: values.currentMedications,
          // allergies: values.allergies,
          // hiv: values.hiv,
        },
        nodePermissions
      );
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
      // patient is eligible for the new drug
      addPatientResponse = await entities.patient.add(
        {
          name: values.firstName + " " + values.lastName,
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
          isEligible: true,
        },
        nodePermissions
      );
    }
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
                sx={{ gridColumn: "3/5" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="custom" variant="contained">
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

// const phoneRegExp =
//   /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  address: yup.string().required("required"),
});
const initialValues = {
  firstName: "",
  lastName: "",
  patientPicture: "",
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
