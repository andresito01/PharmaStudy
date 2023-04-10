import { useParams } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import useJaneHopkins from "../hooks/useJaneHopkins";


const PatientInfo = () => {
    const { patientId } = useParams();
    const [patient, setPatient] = useState(null);
  
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
  
    return (
      <div>
        <h1>Patient Information</h1>
        <p>ID: {patient._id}</p>
        <p>Name: {patient.name}</p>
        <p>DOB: {patient.dob}</p>
        <p>Insurance Number: {patient.insuranceNumber}</p>
        <p>ICD Health Codes: {patient.icdHealthCodes.map(icdCode => icdCode.code).join(", ")}</p>
      </div>
    );
//     return (
//         <Box
//           component="form"
//           sx={{
//             '& .MuiTextField-root': { m: 1, width: '25ch' },
//           }}
//           noValidate
//           autoComplete="off"
//         >
//             <div>
//         <TextField
//           required
//           id="outlined-required"
//           label="Required"
//           defaultValue="Hello World"
//         />
//         <TextField
//           disabled
//           id="outlined-disabled"
//           label="Disabled"
//           defaultValue="Hello World"
//         />
//         <TextField
//           id="outlined-password-input"
//           label="Password"
//           type="password"
//           autoComplete="current-password"
//         />
//         <TextField
//           id="outlined-read-only-input"
//           label="Read Only"
//           defaultValue="Hello World"
//           InputProps={{
//             readOnly: true,
//           }}
//         />
//         <TextField
//           id="outlined-number"
//           label="Number"
//           type="number"
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//         <TextField id="outlined-search" label="Search field" type="search" />
//         <TextField
//           id="outlined-helperText"
//           label="Helper text"
//           defaultValue="Default Value"
//           helperText="Some important text"
//         />
//       </div>
//       </Box>
//   );
};

export default PatientInfo;