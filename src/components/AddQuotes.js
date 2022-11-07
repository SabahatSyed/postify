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
import { async } from "@firebase/util";

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

  const [theme, setTheme] = useState("");
  const [subtheme, setsubTheme] = useState([]);
  const [ename, seteName] = useState("");
  const [eauthor, seteAuthor] = useState([]);
  const [etheme, seteTheme] = useState();
  const [eid, seteid] = useState("");
  const [maincat, setmaincat] = useState();

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
  const userid = JSON.parse(localStorage.getItem("user"));
  const handleAdd = async () => {
    const date=new Date(Date.now())
    const datee=date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
    const Time=date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
    await addDoc(quotesRef, {
      name: name,
      author: author,
      cat: theme,
      subcat: subtheme,
      fav: favUser,
      userbyNumber:userid.user.uid,
      userbyName:userid.user.providerData[0].displayName,
      date:datee,
      time:Time,
      isApprove: true,
      totalLikes: 0,
    });

    setName("");
    setAuthor("");
    setTheme();
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
      seteTheme();
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
    var quote=querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    //var quotee=quote
    //quotee?.map((item,index)=>{
    //  if(typeof (item?.cat)=="string"){
    //    quote[index].cat=item.cat
    //  }
   // })
    setquotes(quote)
    console.log("quotes",quote)
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
      console.log("fs",d);
      var arrayobj=[]
      var Array=[]
      d.map((item,index)=>{
        
        
        let array = d;

        console.log("asah",d)
        if((Array.find((i)=>i.id==item.id))==undefined){
          let dummy=d.filter((it)=>it.id==item.id)
          console.log("dummy",dummy)
          let obj,Cat=[],subcat=[];
          dummy.map((itm)=>{
            
            if(!(subcat.find((item)=>item==itm.subcat))){
              subcat.push(itm.subcat)
            }
            obj=itm;
          })
          
          obj.subcat=subcat
          console.log("fs",typeof (obj.id))
          if(typeof (obj.id)=="number"){
            obj.id=obj.id+""

          }
          console.log("catss",Cat)
          console.log("subcats",subcat)
          console.log("finalobj",obj)
            arrayobj.push(obj)
            Array.push(obj)
        }
        
      })
      var finalarray=[]
      console.log("carrayobj",arrayobj)
      arrayobj.map((item)=>{
        if(!(finalarray?.find((it)=>it.id==item.id))){
          finalarray.push(item)
        }
      })
      console.log("finalarray",finalarray)
      var quoteDoc,add;
      finalarray.map(async(it)=>{
        console.log("it,",it)
        quoteDoc = doc(db, "Quotes", it.id)
        add=collection(db,"Quotes")
        const q = query(
          collection(db, "Quotes"),
         //where("name", "==", cname)
        );
    
        const querySnapshot = await getDocs(q);
        const datas = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        const a=datas.find((item)=>item.id==it.id)
        console.log("dso",a)
        	
            console.log("else",it)

        const c=await updateDoc(quoteDoc,it)
        .then((res)=>{
            console.log("ress",res)
        }).catch(async(err)=>{
          const b=await addDoc(add,it)
        })
      
      })
      
            console.log("asa",finalarray)
            getquotes()


    });
  };

  const exportdata = () => {
    console.log("exported",quotes);
    var quote=quotes
    var final=[]
    quotes?.map((item,index)=>{
        item.subcat?.map((i)=>{
          final.push({...item,subcat:i})
        })
      
      console.log("final",final)

     // item?.cat

    })
    /*quotes?.map((items,index)=>{
      var cats=""
      items.cat?.map((i)=>{
        if(i!=null){
           cats=i+","+cats
        }
       
      })
      quote[index].cat=cats

    })
    quotes?.map((items,index)=>{
      var subcats=""
      items.subcat?.map((i)=>{
        if(i!=null){
        subcats=i+","+subcats}
      })
      quote[index].subcat=subcats
    })
    quotes?.map((items,index)=>{
      var fav=""
      items.fav?.map((i)=>{
        if(i!=null){
        fav=i+","+fav
        }
      })
      quote[index].fav=fav
    })
    console.log("finalquotes",quote)*/

    let wb = XLSX.utils.book_new();
    let ws = XLSX.utils.json_to_sheet(final);

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
    var array="";
   
      array=(stages?.find((ID) => ID.name === e))
  
    console.log("msindarray",array)

   
      if(array==undefined){
      }
      else{
        array?.subcat?.map((i)=>{
          if(i!=undefined){
            getsubid.push(i)
          }
        })
      }
    
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
    var array="";
   
      array=(stages?.find((ID) => ID.name === e))
  
    console.log("msindarray",array)

  
      if(array==undefined){
      }
      else{
      array?.subcat?.map((i)=>{
          if(i!=undefined){
            getsubid.push(i)
          }
        })
      }
    
    console.log("msin",getsubid)
    console.log("msin",subtheme)
    setsubTheme(subtheme?.filter((item)=>item!=""))

    //setsubTheme(getsubid)
    setSub(getsubid?.filter((item)=>item!=""));
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
          <b>QUOTES MANAGEMENT</b>
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
                labelId="demo-simple-select-label"
                size="small"
                id="demo-simple-select"
                value={theme}
                label="Theme"
                onChange={(e) => {
                  console.log("dsa",e.target.value)
                  console.log("tehems",theme)
                  
                  setTheme(e.target.value
                  )
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
                <th className="col-2" onClick={() => sortqoutes("author")}>
                  Author
                </th>
                <th className="col-2" onClick={() => sortqoutes("subcat")}>
                  Sub Category
                </th>
                <th className="col-6">Action</th>
                <th className="col-10" onClick={() => sortqoutes("totalLikes")}>
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
                            setsubTheme([])
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
                  labelId="demo-simple-select-label"
                  size="small"
                  id="demo-simple-select"
                  value={etheme}
                  label="Theme"
                  onChange={(e) => {
                    console.log("dg",e.target.value)
                    console.log("deeg",etheme)

                    seteTheme(e.target.value
                    )
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
