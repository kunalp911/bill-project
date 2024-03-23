import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import logo from "../assets/bills.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Backdrop, CircularProgress } from "@material-ui/core";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    const isValid = validation();
    if (isValid) {
      e.preventDefault();
      setOpen(true);
      await axios
        .post(
          `https://reacttestprojectapi.azurewebsites.net/api/UserManagement/AuthenticateUser?UserName=${username}&Password=${password}`
        )
        .then((res) => {
          window.localStorage.setItem("@userData", JSON.stringify(res?.data));
          toast("Login Successful");
          navigate("/customer-list");
          window.location.reload();
          setOpen(false);
        })
        .catch((err) => {
          console.error(err);
          setOpen(false);
        });
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const validation = () => {
    let newErrors = {};
    if (!username) {
      newErrors.username = "Username is required";
    }
    if (!password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <ToastContainer />
      <Grid item xs={12} sm={6} md={4}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <img src={logo} width="200px" />
          <br></br>
        </Box>
      </Grid>
      <Grid item xs={12} sm={4}>
        <form onSubmit={handleLogin} action="javascript:void(0)">
          <Typography
            variant="h5"
            component="h2"
            gutterBottom
            container
            textAlign="center"
          >
            Login
          </Typography>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          {errors?.username && (
            <div style={{ color: "red" }}>{errors?.username}</div>
          )}
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          {errors?.password && (
            <div style={{ color: "red" }}>{errors?.password}</div>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, mb: 2 }}
            fullWidth
          >
            Login
          </Button>
        </form>
      </Grid>
      <Backdrop
        open={open}
        onClick={handleClose}
        style={{ backgroundColor: "white" }}
      >
        <CircularProgress color="" />
      </Backdrop>
    </Grid>
  );
};

export default Login;
