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
import MapsUgcIcon from "@mui/icons-material/MapsUgc";
import { Link } from "react-router-dom";
import "./css/styles.css";
//import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  where,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import * as XLSX from "xlsx";

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
  const [name, setName] = useState("");
  const [author, setAuthor] = useState([]);
  const [favUser, setfavUser] = useState([]);

  const [theme, setTheme] = useState([]);
  const [subtheme, setsubTheme] = useState([]);
  const [ename, seteName] = useState("");
  const [eauthor, seteAuthor] = useState([]);
  const [etheme, seteTheme] = useState([]);
  const [eid, seteid] = useState("");
  const [maincat, setmaincat] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const quotesRef = collection(db, "Quotes");
  const [quotes, setquotes] = useState([]);
  const [approval, setapproval] = useState([]);
  const [chk, setchk] = useState("");
  const stagessCollectionRef = collection(db, "stagesoflife");
  const [stages, setstages] = useState([]);

  const handleAdd = async () => {
    await addDoc(quotesRef, {
      name: name,
      author: author,
      cat: theme,
      subcat: subtheme,
      fav: favUser,
      isApprove: true,
      totalLikes: 0,
    });
    setName("");
    setAuthor("");
    setTheme([]);
    setsubTheme([]);
    getquotes();
  };
  console.log(etheme);
  const handleUpdate = async () => {
    try {
      const ref = doc(db, "Quotes", eid);
      const qoutedata = await getDoc(ref);
      console.log(qoutedata.data());
      const document = qoutedata.data();
      let objectsubmit = {};
      if (document !== subtheme) {
        objectsubmit = {
          name: ename,
          author: eauthor,
          cat: etheme,
          subcat: subtheme,
        };
      } else {
        objectsubmit = {
          name: ename,
          author: eauthor,
          cat: etheme,
          subcat: subtheme,
        };
      }
      const frankDocRef = doc(db, "Quotes", eid);
      await updateDoc(frankDocRef, objectsubmit)
        .then((res) => {
          console.log("rees", res);
        })
        .catch((err) => {
          console.log("error", err);
        });

      seteName("");
      seteAuthor("");
      seteTheme([]);
      setsubTheme([]);
      getquotes();
      setOpen1(false);
    } catch (err) {}
  };

  const getquotes = async () => {
    //console.log(data);
    const q = query(collection(db, "Quotes"), where("isApprove", "==", true));
    const querySnapshot = await getDocs(q);
    console.log("fhh",querySnapshot.docs)
    setquotes(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const getapproval = async () => {
    const q = query(collection(db, "Quotes"), where("isApprove", "==", false));

    const querySnapshot = await getDocs(q);
    setapproval(querySnapshot.docs.map((doc) => ({ id: doc.id })));
    if (approval.length != 0) {
      setchk("true");
    } else {
      setchk("false");
    }
  };

  const getstagesoflife = async () => {
    const data = await getDocs(stagessCollectionRef);
    console.log(data);
    setstages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDelete = async (id) => {
    const quoteDoc = doc(db, "Quotes", id);
    await deleteDoc(quoteDoc);
    getquotes();
    //setloading(true);
  };
  const readExcel = (file) => {
    const promise = new Promise((res, rej) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        res(data);
      };
      fileReader.onerror = (err) => {
        rej(err);
      };
    });
    promise.then((d) => {
      console.log(d);
      for (let i = 0; i < d.length; i++) {
        let array = d[i];

        addDoc(quotesRef, {
          name: array.name,
          author: array.author,
          cat: array.theme,
          subcat:array.subcat,
          fav: favUser,
          isApprove: true,
          totalLikes: 0,
        });
      }
    });
  };

  const exportdata = () => {
    console.log("exported",quotes);
    var quote=quotes
    quotes?.map((items,index)=>{
      var cats=""
      items.cat?.map((i)=>{
        cats=i+" "+cats
      })
      quote[index].cat=cats

    })
    quotes?.map((items,index)=>{
      var subcats=""
      items.subcat?.map((i)=>{
        subcats=i+" "+subcats
      })
      quote[index].subcat=subcats
    })
    quotes?.map((items,index)=>{
      var fav=""
      items.fav?.map((i)=>{
        fav=i+" "+fav
      })
      quote[index].fav=fav
    })
    console.log("finalquotes",quote)

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(quote);

    XLSX.utils.book_append_sheet(wb, ws, "Qoutes.xlsx");
    XLSX.writeFile(wb, "MyQoutes.xlsx");
  };
  // const addfile = (e) => {

  //   const file = e.target.files[0];
  //   console.log(file)
  //   const fileRef = ref(storage, `${file}`);
  //   console.log(fileRef)
  //   uploadBytes(fileRef, img);
  //   // const path = getDownloadURL(imageRef);
  // };
  let getsubid = [];
  const [Sub, setSub] = useState([]);

  let getMaincatName ;

  const dropdown = (e) => {
    let id = e;
    console.log("id",e);

    console.log("stages",stages);
    var array=[];
    e.map((item,index)=>{
      
      array[index]=(stages?.find((ID) => ID.name === item))
    })
    console.log("msindarray",array)

    array?.map((item)=>{
      if(item==undefined){
      }
      else{
        item?.subcat?.map((i)=>{
          if(i!=undefined){
            getsubid.push(i)
          }
        })
      }
    })
    console.log("msin",getsubid)
    console.log("msin",subtheme)

    //setsubTheme(getsubid)
    setSub(getsubid);
    //setmaincat(getMaincatName)
  };

  const dropdownedit = (e) => {
    let id = e;
    console.log("id",e);

    console.log("stages",stages);
    var array=[];
    e.map((item,index)=>{
      
      array[index]=(stages?.find((ID) => ID.name === item))
    })
    console.log("msindarray",array)

    array?.map((item)=>{
      if(item==undefined){
      }
      else{
        item?.subcat?.map((i)=>{
          if(i!=undefined){
            getsubid.push(i)
          }
        })
      }
    })
    console.log("msin",getsubid)
    console.log("msin",subtheme)

    //setsubTheme(getsubid)
    setSub(getsubid);
    //setmaincat(getMaincatName)
    
    //setmaincat(getMaincatName)
  };

  const [sort, setsort] = useState("ASC");
  const sortqoutes = (col) => {
    console.log("ads",[...quotes])
    console.log(col);
    if(col=="totalLikes"){
      if (sort === "ASC") {
        const sorted = [...quotes].sort((a, b) =>
          a[col]> b[col] ? 1 : -1
        );
        setquotes(sorted);
        setsort("DSC");
      }
      if (sort === "DSC") {
        const sorted = [...quotes].sort((a, b) =>
          a[col] < b[col] ? 1 : -1
        );
        setquotes(sorted);
        setsort("ASC");
      }
    }
    else{
    if (sort === "ASC") {
      const sorted = [...quotes].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setquotes(sorted);
      setsort("DSC");
    }
    if (sort === "DSC") {
      const sorted = [...quotes].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setquotes(sorted);
      setsort("ASC");
    }
  }
  };
  useEffect(() => {
    getapproval();
    getquotes();
    getstagesoflife();
  }, [chk]);
  return (
    <div>
      <div className="p-4 m-4">
        <h1 style={{ textAlign: "center", marginBottom: 40 }}>
          <b>QUOTES MANAGMENT</b>
        </h1>
        {chk === "true" && (
          <MapsUgcIcon
            style={{
              position: "absolute",
              right: 27,
              top: 114,
              zIndex: 1,
              marginBottom: 30,
              color: "red",
            }}
          />
        )}
        <Link to="/Dashboard/AddQuotes/Approval">
          <Button
            variant="contained"
            style={{
              marginLeft: 10,
              float: "right",
              backgroundColor: "#65350f",
              marginBottom: 30,
            }}
          >
            Requests
          </Button>
        </Link>
        <Button
          variant="contained"
          style={{
            marginLeft: 10,
            float: "right",
            backgroundColor: "#65350f",
            marginBottom: 30,
          }}
          onClick={handleOpen}
        >
          Add Quotes
        </Button>
        {/* <Button
        type='flie'
          variant="contained"
          style={{
            float: "right",
            backgroundColor: "#65350f",
            marginBottom: 30,
          }}
          //   onClick={handleOpen}
        >
          Upload Quotes
        </Button> */}

        <Button
          variant="contained"
          component="label"
          style={{
            float: "right",
            backgroundColor: "#65350f",
            marginBottom: 30,
          }}
        >
          Upload Quotes
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files[0];
              readExcel(file);
            }}
            hidden
          />
        </Button>
        <Button
          onClick={exportdata}
          variant="contained"
          component="label"
          style={{
            float: "right",
            backgroundColor: "#65350f",
            marginBottom: 30,
            marginRight: 10,
          }}
        >
          Export
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <h5 style={{ textAlign: "center", marginBottom: 15 }}>
              Add Quotes
            </h5>

            <TextField
              className="my-4"
              size="small"
              required
              fullWidth
              id="outlined-basic"
              label="Quote"
              value={name}
              variant="outlined"
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              required
              className="mb-4"
              size="small"
              fullWidth
              id="outlined-basic"
              label="Author"
              value={author}
              variant="outlined"
              onChange={(e) => setAuthor(e.target.value)}
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
                value={theme}
                label="Theme"
                onChange={(e) => {
                  console.log("dsa",e.target.value)
                  console.log("tehems",theme)
                  
                  setTheme([...e.target.value
                  ])
                dropdown(e.target.value)

                  
                }}
              >
                {stages.map((stages) => {
                  return <MenuItem value={stages.name}>{stages.name}</MenuItem>;
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
                value={subtheme}
                label="Theme"
                onChange={(e) => {
                  console.log("aubstehme",e.target.value)
                  console.log("ahme",subtheme)
                  setsubTheme([...e.target.value
                  ])
              }}
              >
                {Sub.map((Sub) => {
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
              onClick={handleAdd}
            >
              Submit
            </Button>
          </Box>
        </Modal>

        <div>
          <table className="table" style={{ textAlign: "center" }}>
            <thead>
              <tr>
                <th className="col-2" onClick={() => sortqoutes("name")}>
                  Quote
                </th>
                <th className="col-3" onClick={() => sortqoutes("cat")}>
                  Category
                </th>
                <th className="col-4" onClick={() => sortqoutes("author")}>
                  Author
                </th>
                <th className="col-5" onClick={() => sortqoutes("subcat")}>
                  Sub Category
                </th>
                <th className="col-7">Action</th>
                <th className="col-8" onClick={() => sortqoutes("totalLikes")}>
                  Likes
                </th>
              </tr>
            </thead>
            <tbody>
              {quotes?.map((quotes, ind) => {
                let sub = quotes?.subcat;
                return (
                  <tr key={ind}>
                    <td>{quotes.name}</td>
                    <td  >{quotes.cat}</td>
                    <td>{quotes.author}</td>
                    <tr >
                    {sub?.map((val, index) => {
                      return( <td style={{padding:11}} key={index}>{val}</td>)
                    })}
                    </tr>
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
                            seteName(quotes.name);
                            seteAuthor(quotes.author);
                            seteTheme(quotes.cat);
                            setsubTheme(quotes.subcat)
                            seteid(quotes.id);
                            handleOpen1();
                            // handleOpenEdit(stage)
                          }}
                        >
                          Edit
                        </Button>

                        <Button
                          style={{ backgroundColor: "#65350f" }}
                          variant="contained"
                          size="small"
                          onClick={() => {
                            handleDelete(quotes.id);
                          }}
                        >
                          Delete
                        </Button>
                      </>
                    </td>
                    <td>{quotes?.totalLikes}</td>

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
                value={ename}
                variant="outlined"
                onChange={(e) => seteName(e.target.value)}
              />
              <TextField
                required
                className="mb-4"
                size="small"
                fullWidth
                id="outlined-basic"
                label="Author"
                value={eauthor}
                variant="outlined"
                onChange={(e) => seteAuthor(e.target.value)}
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
                  value={etheme}
                  label="Theme"
                  onChange={(e) => {
                    console.log("dg",e.target.value)
                    console.log("deeg",etheme)

                    seteTheme([
                    ...e.target.value
                    ])
                  dropdownedit(e.target.value)
                  }}
                >
                  {stages.map((stages) => {
                    return (
                      <MenuItem
                        //onClick={() => dropdownedit(stages.id)}
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
                  value={subtheme}
                  label="Theme"
                  onChange={(e) => {
                    console.log("aubstehme",e.target.value)
                  console.log("ahme",subtheme)
                  setsubTheme([...e.target.value
                  ])
                }}
                >
                  {Sub.map((Sub) => {
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
