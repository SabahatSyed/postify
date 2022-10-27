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

  const userRef = collection(db, "users");
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
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    getusers();
    //setloading(true);
  };

  const handleUpdate = async () => {
    try {
      const frankDocRef = doc(db, "users", uid);
      await updateDoc(frankDocRef, {
        name: Name,
        contact: ContactNo,
      })
        .then((res) => {
          console.log("rees", res);
        })
        .catch((err) => {
          console.log("error", err);
        });

      setName("");
      setContactNo("");
      getusers();
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <div className="p-4 m-4">
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>
          <b>ALL USERS</b>
        </h1>
        <div>
          <table className="table" style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th className="col-1">Name</th>
                <th className="col-2">Email</th>
                <th className="col-2">User ID</th>
                <th className="col-2">Date Of Signup</th>
                <th className="col-3" style={{ backgroundColor: "#f5f5f5" }}>
                Date Of Subcription
                </th>
                <th className="col-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((users) => {
                return (
                  <tr>
                    <td>{users.name}</td>
                    <td>{users.email}</td>
                    <td>{users.id}</td>
                    <td>{users.dateOfSignup}</td>
                    <td style={{ backgroundColor: "#f5f5f5" }}>
                      {users.dateOfSubcription}
                    </td>

                    <td>
                      <>
                        <Button
                          style={{
                            backgroundColor: "#65350f",
                            marginRight: 15,
                          }}
                          variant="contained"
                          size="small"
                          onClick={() => {
                            setuid(users.id);
                            handleOpen();
                          }}
                        >
                          Edit
                        </Button>

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
              })}
            </tbody>
          </table>
          <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box sx={style}>
                            <h5
                              style={{ textAlign: "center", marginBottom: 15 }}
                            >Edit User
                            </h5>

                            <TextField
                              className="my-4"
                              size="small"
                              required
                              fullWidth
                              id="outlined-basic"
                              label="Name"
                              variant="outlined"
                              value={Name}
                              onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                              required
                              className="mb-4"
                              size="small"
                              fullWidth
                              id="outlined-basic"
                              label="Contact No"
                              variant="outlined"
                              value={ContactNo}
                              onChange={(e) => setContactNo(e.target.value)}
                            />
                          
                            
                            <Button
                              style={{
                                backgroundColor: "#80471C",
                                float: "right",
                              }}
                              variant="contained"
                              size="small"
                              onClick={handleUpdate}
                            >
                              Submit
                            </Button>
                          </Box>
                        </Modal>
        </div>
      </div>
    </div>
  );
}


