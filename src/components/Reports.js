import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
//import { Link, Outlet } from "react-router-dom";
import "./css/styles.css";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Modal from "@mui/material/Modal";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export default function AllUsers() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const userRef = collection(db, "forumtesting");
  const [users, setuser] = useState([]);
  const [Name, setName] = useState("");
  const [ContactNo, setContactNo] = useState("");
  const [status, setstatus] = useState("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [uid, setuid] = useState("");
  const getusers = async () => {
    const data = await getDocs(userRef);
    //console.log(data);
    setuser(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getusers();
  }, []);

  const handleDelete = async (id) => {
    const userDoc = doc(db, "forumtesting", id);
    await deleteDoc(userDoc);
    getusers();
    //setloading(true);
  };

  
  return (
    <div>
      <div className="p-4 m-4">
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>
          <b>Reported Posts</b>
        </h1>
        <div>
          <table className="table" style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th className="col-3">Post</th>
                <th className="col-3">Cat</th>
                <th className="col-3">Username</th>
                <th className="col-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((users) => 
                {if(users.reportedby?.length>0)

                return (
                  <tr>
                    <td>{users.description}</td>
                    <td>{users.cat}</td>
                    <td>{users.username}</td>
                    <td>
                      <>

                        <Button
                          style={{ backgroundColor: "#65350f" }}
                          variant="contained"
                          size="small"
                          onClick={() => {
                            handleDelete(users.id);
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    </td>
                  </tr>
                );
               }
              )}
            </tbody>
          </table>
         
        </div>
      </div>
    </div>
  );
}


