import { Autocomplete, Button, Card, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  doc,
  deleteDoc,
  where,
} from "firebase/firestore";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background",
  boxShadow: 24,
  p: 4,
};
export default function Forums() {
  const handleOpen = () => setOpen(true);
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState([]);
  const [img, setImg] = useState("");
  const [text1, setText] = useState("");
  const forumsRef = collection(db, "forums");
  const stagessCollectionRef = collection(db, "stagesoflife");
  const [loading, setloading] = useState(false);
  const [forum, setforum] = useState([]);
  const { id } = useParams();

  console.log(img)


  const getforums = async () => {
    // const q = query(collection(db, "forums"), where("categoryID", "==", id));
    // const querySnapshot = await getDocs(q);
    // const datas = querySnapshot.docs.map((doc) => ({
    //   ...doc.data(),
    //   id: doc.id,
    // }));
    const data = await getDocs(stagessCollectionRef);
    setforum(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };



  useEffect(() => {
    getforums();
  }, []);


  return (
    <div style={{ padding: 50 }}>
      <div className="row" style={{ marginBottom: 15 }}>
        <h1 style={{ textAlign: "center" }}>
          <b>Forums</b>
        </h1>
      </div>

      <div className="row">
        {forum.map((val, ind) => {
          return (
            <div key={ind} className="col-md-6">
              <Card style={{ padding: 30, marginBottom: 20 }}>
                <div>
                  <img src={val.image} />
                  <h4> {val.name}</h4>
                  <Button
                    style={{
                      backgroundColor: "#65350f",
                      marginLeft: 15,
                      float: "right",
                    }}
                    variant="contained"
                    size="small"
                  >
                <Link to={`/Dashboard/Forums/${val.name}/${val.id}`}>View Forum </Link>
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

