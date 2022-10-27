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

export default function FavTbody(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  return (
    <>
      <tr>
        <td style={{ paddingLeft: 30 }}>{props.name}</td>

        <td>
          <Button
            style={{ backgroundColor: "#65350f" }}
            variant="contained"
            size="small"
            onClick={handleOpen}
          >
            View
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h4>Total Likes {props.totalLikes}</h4>
              <div
                className="row"
                style={{
                  height: "calc(90vh - 56px)",
                  overflow: "auto",
                }}
              >
                <div className="col m-2">
                  <Card className="p-4">
                    <h5
                      style={{
                        marginBottom: 25,
                      }}
                    >
                      Favourite props
                    </h5>
                    <ol>
                      <li>{props.favName}</li>
                    </ol>
                  </Card>
                </div>

                <div className="col m-2">
                  <Card className="p-4">
                    <h5
                      style={{
                        marginBottom: 25,
                      }}
                    >
                      Liked props
                    </h5>
                    <ol>
                      <li>{props.likedName}</li>
                    </ol>
                  </Card>
                </div>
              </div>
            </Box>
          </Modal>
        </td>
      </tr>
    </>
  );
}
