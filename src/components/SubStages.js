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
  const [obj,setobj]=useState()
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
            subcat:[],
            art: pathart,
          });
          console.log(documentid.id);
          await addDoc(createforum, {
            cat: name,
            subcat:[],
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
    console.log("namee",namee)
    console.log("namee",obj)

    let dataArray = {};
    console.log("stages",stages)
    var array=[]
    var objj;
    stages.map((item)=>{
      if(item.id==obj.id){
        item.subcat[obj.index]=namee
        objj=item
      }
      array.push(item)
    })
    setstages(array)
    console.log("stages",array)

    try {
      //console.log(eid);
     const frankDocRef = doc(db, "stagesoflife", obj.id);
      await updateDoc(frankDocRef, objj);
      setNamee("");
     alert("Subcategory Has been Updated!!")

      setOpen1(false);
    } catch (err) {
      console.log("error", err);
    }
  };
  const getstagesoflife = async () => {
    const data = await getDocs(stagessCollectionRef);
    console.log(data);
    setstages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const handleDelete = async (id,index) => {
    console.log("namee",id)
    console.log("namee",index)

    let dataArray = {};
    console.log("stages",stages)
    var array=[]
    var objj;
    stages.map((item)=>{
      if(item.id==id){
        
        item.subcat=item.subcat.filter((item,ind)=>ind!=index)
        objj=item
      }
      array.push(item)
    })
   // setstages(array)
    console.log("stages",array)

    try {
      //console.log(eid);
     const frankDocRef = doc(db, "stagesoflife", id);
      await updateDoc(frankDocRef, objj);
      setNamee("");
      setOpen1(false);
     alert("Subcategory Has been Deleted!!")
    } catch (err) {
      console.log("error", err);
    }

    getstagesoflife();
  };
 

  useEffect(() => {
    getstagesoflife();
  }, []);

  return (
    <div>
      <div className="p-4 m-4">
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>
          <b>SUBCATEGORIES</b>
        </h1>

        
       
       
        <div>
          <table className="table" style={{ textAlign: "center", height: 40 }}>
            <thead>
              <tr>
                <th className="col-1">Image</th>
                <th className="col-2">Name</th>
                <th className="col-2">SubCategory</th>
                <th className="col-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage, ind) => (
                stage.subcat?.map((item,index)=>(

                
                <tr key={ind}>
                  <td>
                    <img src={stage.image}></img>
                  </td>
                  <td>{stage.name}</td>
                  <td>{item}</td>

                  <td>
                    <>
                      
                      <Button
                        style={{
                          backgroundColor: "#65350f",
                          marginRight: 15,
                        }}
                        onClick={() => {
                          seteid(stage.id);
                          handleOpen1(stage.id);
                          setobj({id:stage.id,index:index})
                          setNamee(item)
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
                          handleDelete(stage.id,index);
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  </td>
                </tr>
                ))
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
            Change SubCategory
            </h5>
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
