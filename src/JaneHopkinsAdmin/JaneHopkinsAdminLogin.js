import { Box, Button, TextField, InputAdornment, IconButton, Snackbar, Alert } from "@mui/material";
import Header from "../components/Header";
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase-confiq";
import { Formik } from "formik";
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const JaneHopkinsAdminLogin = () => {
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [open, setOpen] = React.useState(false);

    let navigate = useNavigate();

    const [user, setUser] = useState({});

    const [showPassword, setShowPassword] = useState(false);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

    const handleSubmit = async (values) => {
        try {
          const user = await signInWithEmailAndPassword(
            auth,
            values.email,
            values.password
          );
          console.log(values.email);
          navigate('/janehopkinsadmin');
        } catch (error) {
          console.log(error.message);
          setOpen(true);
        }
    };
    
      const logout = async () => {
        await signOut(auth);
      };

      const onClose = () => {
        setOpen(false);
      };

    return (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Box 
            m="20px"
            display="flex"
            flexDirection="column"
            alignItems="center"
            height="100vh"
        >
          <Header title="LOGIN" subtitle="Admin Login" />
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={handleSubmit}
        >
            {({
            values,
            setSubmitting,
            handleBlur,
            handleChange,
            handleSubmit,
            }) => (
            <form  onSubmit={handleSubmit}>
                <Box
                  display="flex"
                  gap="30px"
                  flexDirection="column"
                  width="400px"
                >
                  <TextField
                     fullWidth
                     label="Email"
                     placeholder="Email"
                     name="email"
                     onChange={handleChange}
                     onBlur={handleBlur}
                  />
    
                  <TextField
                    fullWidth
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleTogglePassword}>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                  />

                <Button
                    color="secondary"
                    variant="contained"
                    sx={{ padding: "12px 10px" }}
                    type="submit"
                  >
                    Login
                </Button>
                <Snackbar
                    open={open}
                    autoHideDuration={200}
                    onClose={onClose}
                >
                    <Alert
                    severity="error"
                    sx={{ width: "100%" }}
                    >
                    Invalid Email/Password
                    </Alert>
                </Snackbar>
                </Box>
                </form>
                )}
                </Formik>
            </Box>
            </div>
    )
};

export default JaneHopkinsAdminLogin;