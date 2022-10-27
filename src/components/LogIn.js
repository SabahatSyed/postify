import React, { useState, useEffect } from "react";
//import { useHistory } from "react-router-dom";
import "./css/styles.css";
import TextField from "@mui/material/TextField";
import Alert from '@mui/material/Alert';
import { Button } from "@mui/material";
import Card from "@mui/material/Card";
import { Link } from "react-router-dom";
import Home from "./Home.png";
import logo from "./logo_positify.png";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { useAuth } from "./AuthContext";

// import { useHistory } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [User, setUser] = useState({});
  const [Errors, setErrors] = useState(false);
  const [text, settext] = useState('');
  const navigate = useNavigate();

  /* onAuthStateChanged(auth, (currentUser) => {
     setUser(currentUser);
 });*/
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);


  const login = async () => {
    const user = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    )
      .then((res) => {
        console.log("resss", res);
        navigate("/Dashboard");
        console.log("resss", User);
      })
      .catch((err) => {
        let eroors=err.toString().split(' ')
        console.log(err)
                if (eroors[3] === "(auth/invalid-email).") {
                  settext('Invalid Email');
                  setErrors(true)
                }
                else if (eroors[3] === "(auth/internal-error).") {
                  settext('Please fill out the field ');
                  setErrors(true)
                }
                else if (eroors[3] === "(auth/wrong-password).") {
                  settext('Invalid Email or Password');
                  setErrors(true)
                }
                else{
                  settext('Please Try Again Later');
                }
      });
  };

  return (
    <div
      className=" d-flex justify-content-center "
      style={{
        backgroundImage: `url(${Home})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="align-items-center" style={{ width: 700, padding: 60 }}>
        {/* <Card style={{ padding: 100, marginTop: 100, opacity: "0.9" }}> */}
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <img src={logo} />
            {/* 
            <h2 style={{ textAlign: "center" }}>LOGIN</h2> */}
          </div>
          <div className="col-md-3"></div>
        </div>
        <TextField
          style={{ backgroundColor: "#fff", borderRadius: 15, marginTop: 20 }}
          className="my-4"
          fullWidth
          id="outlined-basic"
          label="Email"
          value={loginEmail}
          variant="outlined"
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <TextField
          style={{
            backgroundColor: "#fff",
            borderRadius: 15,
            marginBottom: 20,
          }}
          fullWidth
          value={loginPassword}
          id="outlined-basic"
          type="password"
          label="Password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        {Errors && <Alert severity="error">{text}</Alert>}
        <Button
          fullWidth
          style={{ backgroundColor: "#000", color: "#fff" }}
          className="my-4"
          variant="contained"
          size="large"
          onClick={login}
        >
          Login
        </Button>
        {/* </Card> */}
      </div>
    </div>
  );
}
