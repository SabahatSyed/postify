import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Link } from "react-router-dom";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  where,
  query,
} from "firebase/firestore";

import { textAlign } from "@mui/system";

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
export default function StagesOfLife() {
  //  const [rows, setrows] = useState([]);

  //Modal open System
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //Add Docs

  const [img, setImg] = useState("");
  const [art, setArt] = useState("");
  const [name, setName] = useState("");

  //add SubCat
  const [p_cat, setPcat] = useState("");
  const [Sub_cat, setSubcat] = useState("");

  //update Docs
  const [p_cate, setPcate] = useState([]);
  const [imge, setImge] = useState();
  const [arte, setArte] = useState();
  const [namee, setNamee] = useState("");
  const [eid, seteid] = useState("");

  const stagessCollectionRef = collection(db, "stagesoflife");
  const createforum = collection(db, "forum testing");
  const [loading, setloading] = useState(false);
  const [headerimg, setheaderImg] = useState();
  const [stages, setstages] = useState([]);

  const handleAdd = async () => {
    if (img !== null) {
      const imageRef = ref(storage, `${img.name}`);
      await uploadBytes(imageRef, img);
      const path = await getDownloadURL(imageRef);

      if (art !== null) {
        const imageRefart = ref(storage, `${art.name}`);
        await uploadBytes(imageRefart, art);
        const pathart = await getDownloadURL(imageRefart);

        // console.log(imageRef);
        try {
          console.log("pathhh", headerimg);

          const documentid = await addDoc(stagessCollectionRef, {
            name: name,
            image: path,
            art: pathart,
          });
          console.log(documentid.id);
          await addDoc(createforum, {
            cat: name,
            image: pathart,
            categoryID: documentid.id,
          });

          setName("");
          setImg("");
          setArt("");
          setOpen(false);
          window.location.reload(true);
        } catch (err) {}
      }
    }
  };
  const handleUpdate = async () => {
    console.log(eid);
    console.log(imge);
    console.log(arte);
    let path;
    let pathart;
    if (imge !== undefined) {
      const imageRef = ref(storage, `${imge.name}`);
      await uploadBytes(imageRef, imge);
      path = await getDownloadURL(imageRef);
    }
    console.log(path);
    if (arte !== undefined) {
      const imageRefart = ref(storage, `${arte.name}`);
      await uploadBytes(imageRefart, arte);
      pathart = await getDownloadURL(imageRefart);
    }
    console.log(pathart);
    let dataArray = {};
    if (namee !== "" && path !== undefined && pathart !== undefined) {
      console.log("1");
      dataArray = {
        name: namee,
        image: path,
        art: pathart,
      };
    }
    if (namee !== "" && path === undefined && pathart === undefined) {
      console.log("2");
      dataArray = {
        name: namee,
      };
    }
    if (namee === "" && path !== undefined && pathart === undefined) {
      console.log("3");
      dataArray = {
        image: path,
      };
    }
    if (namee === "" && path === undefined && pathart !== undefined) {
      dataArray = {
        art: pathart,
      };
    }
    if (namee !== "" && path !== undefined && pathart === undefined) {
      dataArray = {
        name: namee,
        image: path,
      };
    }
    if (namee !== "" && path === undefined && pathart !== undefined) {
      dataArray = {
        name: namee,

        art: pathart,
      };
    }
    if (namee === "" && path !== undefined && pathart !== undefined) {
      dataArray = {
        image: path,
        art: pathart,
      };
    }
    try {
      console.log(eid);
      const frankDocRef = doc(db, "stagesoflife", eid);
      await updateDoc(frankDocRef, dataArray);
      setNamee("");
      setImge("");
      setArte("");
      setOpen1(false);
      window.location.reload(true);
    } catch (err) {
      console.log("error", err);
    }
  };
  const getstagesoflife = async () => {
    const data = await getDocs(stagessCollectionRef);
    console.log(data);
    setstages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const handleDelete = async (id) => {
    const q = query(
      collection(db, "forum testing"),
      where("categoryID", "==", id)
    );
    const querySnapshot = await getDocs(q);
    const datas = querySnapshot.docs.map((doc) => ({
      forumid: doc.id,
    }));
    const stageDoc = doc(db, "stagesoflife", id);
    for (let i = 0; i < datas.length; i++) {
      const forumdel = doc(db, "forum testing", datas[i].forumid);
      await deleteDoc(forumdel);
    }
    await deleteDoc(stageDoc);
    getstagesoflife();
  };
  const handleAddSubcat = async (id) => {
    console.log(id);
    let datasub = Sub_cat;
    const cat = doc(db, "stagesoflife", id);
    try {
      await updateDoc(cat, {
        subcat: arrayUnion(datasub),
      })
        .then((res) => {
          console.log("rees", res);
        })
        .catch((err) => {
          console.log("error", err);
        });

      setSubcat("");
      getstagesoflife();
      setOpen2(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getstagesoflife();
  }, []);

  return (
    <div>
      <div className="p-4 m-4">
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>
          <b>CATEGORIES</b>
        </h1>

        <Button
          variant="contained"
          style={{
            float: "right",
            backgroundColor: "#65350f",
            marginBottom: 30,
          }}
          onClick={handleOpen}
        >
          Add Categories
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h5 style={{ textAlign: "center", marginBottom: 15 }}>
              Add New Categories
            </h5>

            <label className="mb-2">
              <b>Upload Icon</b>
            </label>
            <input
              type="file"
              onChange={(e) => setImg(e.target.files[0])}
            ></input>
            <TextField
              className="my-4"
              size="small"
              fullWidth
              id="outlined-basic"
              label="Category Name"
              value={name}
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
            />

            <label className="mb-2">
              <b>Upload Background Art</b>
            </label>
            <input
              type="file"
              onChange={(e) => setArt(e.target.files[0])}
            ></input>

            <Button
              style={{ backgroundColor: "#65350f", float: "right" }}
              variant="contained"
              size="small"
              onClick={handleAdd}
            >
              Submit
            </Button>
          </Box>
        </Modal>

        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h5 style={{ textAlign: "center", marginBottom: 15 }}>
              Add New Sub-Categories
            </h5>
            {/* <FormControl fullWidth className="mb-4">
              <InputLabel id="demo-simple-select-label">
                Set Theme Of Your Quote
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                size="small"
                id="demo-simple-select"
                label="Theme"
                onChange={(e) => setPcat(e.target.value)}
              >
                {stages.map((stages) => {
                  return <MenuItem value={stages.id}>{stages.name}</MenuItem>;
                })}
              </Select>
            </FormControl> */}
            <TextField
              floatingLabelStyle={{color: 'black' }}
              className="my-4 "
              size="small"
              fullWidth
              id="outlined-basic"
              label={p_cat[1]}
              variant="outlined"
              disabled={true}
            />
            <TextField
              className="my-4"
              size="small"
              fullWidth
              id="outlined-basic"
              label="Category Name"
              value={Sub_cat}
              variant="outlined"
              onChange={(e) => setSubcat(e.target.value)}
            />
            <Button
              style={{ backgroundColor: "#65350f", float: "right" }}
              variant="contained"
              size="small"
              onClick={() => {
                handleAddSubcat(p_cat[0]);
              }}
            >
              Submit
            </Button>
          </Box>
        </Modal>

        <div>
          <table className="table" style={{ textAlign: "center", height: 40 }}>
            <thead>
              <tr>
                <th className="col-1">Image</th>
                <th className="col-2">Name</th>
                <th className="col-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage, ind) => (
                <tr key={ind}>
                  <td>
                    <img src={stage.image}></img>
                  </td>
                  <td>{stage.name}</td>
                  <td>
                    <>
                      <Button
                        variant="contained"
                        style={{
                          float: "right",
                          backgroundColor: "#65350f",
                          marginBottom: 30,
                          marginRight: 5,
                        }}
                        onClick={() => {
                          handleOpen2();
                          setPcat([stage.id, stage.name]);
                        }}
                      >
                        Add Sub-Categories
                      </Button>
                      <Button
                        style={{
                          backgroundColor: "#65350f",
                          marginRight: 15,
                        }}
                        onClick={() => {
                          seteid(stage.id);
                          handleOpen1();
                        }}
                        variant="contained"
                        size="small"
                      >
                        Edit
                      </Button>
                      <Button
                        style={{ backgroundColor: "#65350f" }}
                        variant="contained"
                        size="small"
                        onClick={() => {
                          handleDelete(stage.id);
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          open={open1}
          onClose={handleClose1}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h5 style={{ textAlign: "center", marginBottom: 15 }}>
            Change category
            </h5>
            <label className="mb-2">
              <b>Upload Category Icon</b>
            </label>
            <input
              type="file"
              onChange={(e) => setImge(e.target.files[0])}
            ></input>
            <TextField
              className="my-4"
              size="small"
              fullWidth
              id="outlined-basic"
              label="Name"
              value={namee}
              variant="outlined"
              onChange={(e) => setNamee(e.target.value)}
            />
            <label className="mb-2">
              <b>Upload Background Image</b>
            </label>
            <input
              type="file"
              onChange={(e) => setArte(e.target.files[0])}
            ></input>

            <Button
              style={{ backgroundColor: "#65350f", float: "right" }}
              variant="contained"
              size="small"
              onClick={() => handleUpdate()}
            >
              Submit
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
