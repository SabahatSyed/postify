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
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import FavTbody from "./FavTbody";

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
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const quotesRef = collection(db, "Quotes");
  const [quotes, setquotes] = useState([]);

  const getquotes = async () => {
    const q = query(collection(db, "Quotes"), where("totalLikes", ">", 10));
    const querySnapshot = await getDocs(q);
    const datas = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    }));
    setquotes(datas)
  };

console.log(quotes)

  useEffect(() => {
    getquotes();
  }, []);

  //   const handleDelete = async (id) => {
  //     const userDoc = doc(db, "favourite", id);
  //     await deleteDoc(userDoc);
  //     getfav();
  //     //setloading(true);
  //   };

  return (
    <div>
      <div className="p-4 m-4">
        <h2 style={{ textAlign: "center", marginBottom: 40 }}>
          <b>FAVOURITE QUOTES</b>
        </h2>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th className="col-4" style={{ paddingLeft: 30 }}>
                  Quotes
                </th>
                <th className="col-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((val,ind) => {
                return <FavTbody
                key={ind}
                name={val.name}
                totalLikes={val.totalLikes}
                favName={val.favName}
                likedName={val.likedName}
                />
                
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
