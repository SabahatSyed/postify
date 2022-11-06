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
//import { DataGrid } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where
} from "firebase/firestore";

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
export default function AddQuotes() {
  const stagessCollectionRef = collection(db, "stagesoflife");
  const [stages, setstages] = useState([]);
  const [quotes, setquotes] = useState([]);
   const [subtheme, setsubTheme] = useState([]);
  const [ename, seteName] = useState("");
  const [eauthor, seteAuthor] = useState([]);
  const [etheme, seteTheme] = useState([]);
  const [eid, seteid] = useState("");
  const [selectquote,setselect]=useState({})
  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);
  const [maincat, setmaincat] = useState([]);
  var maincatt=[]
  const getquotes = async () => {
    //console.log(data);
    const q =query( collection(db, "Quotes"),where("isApprove", "==", false) );
    const querySnapshot = await getDocs(q)
    setquotes(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    var quote=querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    var quotee=quote
    quotee?.map((item,index)=>{
      if(typeof (item?.cat)=="string"){
        var arr=[];
        arr.push(item.cat)
        quote[index].cat=arr
        console.log("fssf")
      }
      if(item?.subcat==undefined){
        quote[index].subcat=[]
      }
    })
    setquotes(quote)
    console.log("quotes",quote)
  };

  console.log(quotes)
  let getsubid = [];
let getMaincatName=[]
  const getstagesoflife = async () => {
    const data = await getDocs(stagessCollectionRef);
    console.log(data);
    setstages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const [Sub,setSub]=useState()
  const dropdown = (e) => {
    console.log("da",maincatt);

    let id = e;
    console.log(id);
    var array=[];
    e.map((item,index)=>{
      
      array[index]=(stages.find((ID) => ID.name === item).subcat || [])
    })
    console.log("subcatergesarray",array)
    array.map((item)=>{
      item.map((it)=>{
        getsubid.push(it)
      })
    })
    console.log("subcaterges",getsubid)

    setSub(getsubid);

    getMaincatName = stages.find((ID) => ID.id === id)?.name;
    
    setmaincat(getMaincatName)
    
  };
  const handleRefuse = async (id) => {

    try {
      const quoteDoc = doc(db, "Quotes", id);
      await deleteDoc(quoteDoc);
    } catch (err) {
        console.log(err)
    }
    getquotes()
  };

  const handleApprove = async (id) => {

    try {
      console.log("ds",selectquote.id)

      const frankDocRef = doc(db, "Quotes", selectquote.id);
      const a=await updateDoc(frankDocRef, {
        isApprove:true,
        author:selectquote.author,
        cat:selectquote.cat,
        subcat:selectquote.subcat,
        name:selectquote.name
      })
    } catch (err) {
        console.log(err)
    }
    handleClose1()
    getquotes()
  };


  useEffect(() => {
    getquotes();
    getstagesoflife()
  }, []);
  return (
    <div>
      <div className="p-4 m-4">
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>
          <b>APPROVE QUOTES</b>
        </h1>
        <div>
          <table className="table" style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th className="col-5">Quote</th>
                <th className="col-3">Category</th>
                <th className="col-2">Author</th>
                <th className="col-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((quotes, ind) => {
                return (
                  <tr key={ind}>
                    <td>{quotes.name}</td>
                    <td>{quotes.cat}</td>
                    <td>{quotes.author}</td>
                    <td>
                      <>
                        <Button
                          style={{
                            backgroundColor: "#65350f",
                            marginRight: 15,
                          }}
                          variant="contained"
                          size="small"
                          value={quotes.id}
                          onClick={()=>{
                            seteName(quotes.name);
                            seteAuthor(quotes.author);
                            seteTheme(quotes.cat);
                            setsubTheme(quotes.subcat)
                            seteid(quotes.id);
                            console.log("quotes.cat",quotes.cat)
                            var arr=[];

                            if(typeof (quotes.cat)=="string"){
                              arr.push(quotes.cat)
                              console.log("quotes.cat",arr)
                            }
                            else{
                              arr=quotes.cat
                            }
                           

                            setselect({id:quotes.id,name:quotes.name,cat:arr,author:quotes.author,subcat:quotes.subcat})
                            handleOpen1()}}
                        >
                          Approve
                        </Button>
                        <Button
                          style={{ backgroundColor: "#65350f" }}
                          variant="contained"
                          size="small"
                          value={quotes.id}
                          onClick={(e)=>handleRefuse(e.target.value)}
                        >
                          Refuse
                        </Button>
                      </>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Modal
            open={open1}
            onClose={handleClose1}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <h5 style={{ textAlign: "center", marginBottom: 15 }}>
                Edit Quote
              </h5>

              <TextField
                className="my-4"
                size="small"
                required
                fullWidth
                id="outlined-basic"
                label="Quote"
                value={selectquote.name}
                variant="outlined"
                onChange={(e) => {
                  var value={name:e.target.value}
                  setselect(shopCart => ({
                  ...shopCart,
                  ...value
                }))}}
              />
              <TextField
                required
                className="mb-4"
                size="small"
                fullWidth
                id="outlined-basic"
                label="Author"
                value={selectquote.author}
                variant="outlined"
                onChange={(e) => {
                  var value={author:e.target.value}
                  setselect(shopCart => ({
                  ...shopCart,
                  ...value
                }))}}
              />

              <FormControl fullWidth className="mb-4">
                <InputLabel id="demo-simple-select-label">
                  Set Category Of Your Quote
                </InputLabel>
                <Select
                  multiple
                  labelId="demo-simple-select-label"
                  size="small"
                  id="demo-simple-select"
                  value={selectquote.cat}
                  label="Theme"
                  onChange={(e) =>{
                    var x={cat:e.target.value}
                    console.log("sda",x)
                    setselect(shopCart => ({
                    ...shopCart,
                    ...x
                  }))
                  dropdown(e.target.value)
                  }}
                  
                    
                >
                  {stages?.map((stages) => {
                    return (
                      <MenuItem
                       // onClick={() => dropdown(stages.id)}
                        value={stages.name}
                      >
                        {stages.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth className="mb-4">
                <InputLabel id="demo-simple-select-label">
                  Set Sub-Category Of Your Quote
                </InputLabel>
                <Select
                  multiple
                  labelId="demo-simple-select-label"
                  size="small"
                  id="demo-simple-select"
                  value={selectquote.subcat}
                  label="Theme"
                  onChange={(e) => {
                    var x={subcat:e.target.value}
                    setselect(shopCart => ({
                    ...shopCart,
                    ...x
                  }))
                  console.log("sd",selectquote)
                }}
                >
                  {Sub?.map((Sub) => {
                    return <MenuItem value={Sub}>{Sub}</MenuItem>;
                  })}
                </Select>
              </FormControl>
              <Button
                style={{
                  backgroundColor: "#80471C",
                  float: "right",
                }}
                variant="contained"
                size="small"
                onClick={()=>handleApprove(quotes.id)
                }
              >
                Approve
              </Button>
              <Button
                style={{
                  backgroundColor: "#80471C",
                  float: "right",
                }}
                variant="contained"
                size="small"
                onClick={()=>{
                  handleClose1()
                  setselect({})
                }}
              >
                Cancel
              </Button>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}

