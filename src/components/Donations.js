import React, { useState, useEffect } from "react";
import { Box, Button, Card, TextField } from "@mui/material";
//import { Link, Outlet } from "react-router-dom";
import "./css/styles.css";
//import { DataGrid } from "@mui/x-data-grid";
//import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function AllUsers() {
  //   const favRef = collection(db, "favourite");
  //   const [favourite, setfav] = useState([]);

  const [open, setOpen] = React.useState(false);
  //   const handleOpen = () => setOpen(true);
  //   const handleClose = () => setOpen(false);
  const donationRef = collection(db, "donation");
  const [donation, setdonation] = useState([]);
  const getdonation = async () => {
    const data = await getDocs(donationRef);
    //console.log(data);
    setdonation(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getdonation();
  }, []);

  return (
    <div>
      <div className="p-4 m-4">
        <h2 style={{ textAlign: "center", marginBottom: 50 }}>
          <b>DONATIONS</b>
        </h2>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th className="col-1">Name</th>
                <th className="col-3">Date</th>
                <th className="col-1">Donation Amount</th>
                <th className="col-1">Donation Type</th>
                <th className="col-1">User Id</th>
              </tr>
            </thead>
            <tbody>
              {donation.map((donation) => {
                return (
                  <tr>
                    <td>{donation.name}</td>
                    <td>{donation.date.toDate().toString()}</td>
                    <td>{donation.amount}</td>
                    <td>{donation.typeoftransaction}</td>
                    <td>{donation.userid}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* <div className="p-4 m-4 row">
        <div className="col-md-6">
          <h2 style={{ textAlign: "center", marginBottom: 40 }}>
            <b>FAVOURITE QUOTES</b>
          </h2>
          <div>
            <table className="table" style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th className="col-1">Name</th>
                  <th className="col-2">Quotes</th>
                  <th className="col-3">Favourtie Quotes</th>
                </tr>
              </thead>
              <tbody>
                {favourite.map((favourite) => {
                  return (
                    <tr>
                      <td>{favourite.name}</td>
                      <td>{favourite.quote}</td>

                      <td>
                        <FavoriteIcon />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-md-5 ">
          <h2 style={{ textAlign: "center", marginBottom: 40 }}>
            <b>LIKED QUOTES</b>
          </h2>
          <div>
            <table className="table" style={{ textAlign: "center" }}>
              <thead>
                <tr>
                  <th className="col-1">Name</th>
                  <th className="col-2">Quotes</th>
                  <th className="col-3">Favourtie Quotes</th>
                </tr>
              </thead>
              <tbody>
                {favourite.map((favourite) => {
                  return (
                    <tr>
                      <td>{favourite.name}</td>
                      <td>{favourite.quote}</td>

                      <td>
                        <ThumbUpIcon />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div> */}
    </div>
  );
}
