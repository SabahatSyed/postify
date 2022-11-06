import { Autocomplete, Button, Card, Modal, TextField } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteOutlineTwoToneIcon from '@mui/icons-material/DeleteOutlineTwoTone';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  query,
  doc,
  deleteDoc,
  where,
  orderBy,
} from "firebase/firestore";
import Message from "./Message";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Image } from "@mui/icons-material";
import { async } from "@firebase/util";
import FlagSharpIcon from '@mui/icons-material/FlagSharp';
export default function Forums() {
  const handleOpen = () => setOpen(true);
  const handleOpenComment = () => setOpenComment(true);
  const handleOpenReply = () => setOpenReply(true);

  const handleModalOpen = () => setmodal(true);
  const [open, setOpen] = useState(false);
  const [opencomment, setOpenComment] = useState(false);
  const [openreply, setOpenReply] = useState(false);

  const [modal, setmodal] = useState(false);
  const [cat, setCat] = useState([]);
  const [img, setImg] = useState("");
  const [text1, setText] = useState("");
  const [name, setName] = useState("");
  const forumsRef = collection(db, "forumtesting");
  const stagessCollectionRef = collection(db, "stagesoflife");
  const [forum, setforum] = useState([]);
  const [Comments, setComments] = useState([]);
  const { id, cname } = useParams();
  const [forums, setforums] = useState([]);
  const [replies, setreplies] = useState([]);

  const [showcomments,setshow]=useState(false)
  const [showreplies,setshowreplies]=useState(false)

  const [forumId, setforumId] = useState("");
  const [editdata,seteditdata]=useState();
  const setshowcomment=()=>{
    setshow(!showcomments)
  }
  const setshowreply=()=>{
    setshowreplies(!showreplies)
  }
  const handleAdd = async () => {
    const frankDocRef = doc(db, "forumtesting", editdata.id);
    await updateDoc(frankDocRef, editdata)
        .then((res) => {
          console.log("rees", res);
        })
        .catch((err) => {
          console.log("error", err);
        });
    setImg("");
    setName("");
    setText("");
    setCat("");
    seteditdata();
    getforums();
  };

  const handleAddComment = async () => {
    const frankDocRef = doc(db, `forumtesting/${editdata.forumid}/Comments`, editdata.id);
    await updateDoc(frankDocRef, {username:editdata.username})
        .then((res) => {
          console.log("rees", res);
        })
        .catch((err) => {
          console.log("error", err);
        });
    setImg("");
    setName("");
    setText("");
    setCat("");
    seteditdata();
    getforums();
    getoforumcomments(editdata.forumid)

  };

  const handleAddReply = async () => {
    const frankDocRef = doc(db, `forumtesting/${editdata.forumid}/Comments/${editdata.commentid}/replies`, editdata.id);
    await updateDoc(frankDocRef, {username:editdata.username})
        .then((res) => {
          console.log("rees", res);
        })
        .catch((err) => {
          console.log("error", err);
        });
    setImg("");
    setName("");
    setText("");
    setCat("");
    seteditdata();
     getforums();
     getoforumreplies(editdata.commentid,editdata.forumid)

  };
  const addpostflag = async (reportedby,idd) => {
    var data=[];
    data=reportedby

     data[data.length]=idd
    console.log("asda",data)
  const frankDocRef = doc(db, "forumtesting", idd);
   await updateDoc(frankDocRef, {reportedby:data})
        .then((res) => {
          console.log("rees", res);
        })
        .catch((err) => {
          console.log("error", err);
        });
        alert("forum has been reported")
    
  };

  const addcommentflag = async (reportedby,forumId,idd) => {
    var data=[];
    data=reportedby

     data[data.length]=forumId
    console.log("asda",data)
  const frankDocRef = doc(db, `forumtesting/${forumId}/Comments`, idd);
   await updateDoc(frankDocRef, {reports:data})
        .then((res) => {
          console.log("rees", res);
        })
        .catch((err) => {
          console.log("error", err);
        });

        alert("Comment has been reported")

    
  };

  const addreplyflag = async (reportedby,forumId,commentid,idd) => {
    var data=[];
    data=reportedby

     data[data.length]=forumId
    console.log("asda",data)
  const frankDocRef = doc(db, `forumtesting/${forumId}/Comments/${commentid}/replies`, idd);
   await updateDoc(frankDocRef, {reports:data})
        .then((res) => {
          console.log("rees", res);
        })
        .catch((err) => {
          console.log("error", err);
        });

        alert("Reply has been reported")

    
  };
  const getC = async () => {
    const querySnapshot = await getDocs(stagessCollectionRef);
    const datas = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id:doc.id
    }));
console.log("datas",datas)
    let backGroundImage = datas.find((doc) => doc.id === id).art;
    setImg(backGroundImage);
  };

  const getforums = async () => {
    console.log("isda",cname)
    const q = query(
      collection(db, "forumtesting"),
     //where("name", "==", cname)
    );

    const querySnapshot = await getDocs(q);

    const datas = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    console.log("ds",datas)
    var s=datas.filter((item)=>item.cat==cname)
    console.log("ds",s)
    setforum(s)

    //const comments=getoforumcomments()
    //setforum(comments);
   
  };

  const getoforumcomments =async(id) => {
    var comments=[]
    console.log("ads",forum)
    setforums([])
     //forum.map(async(item,index)=>{
      

     const qa = query(
       collection(db, `forumtesting/${id}/Comments`),
       orderBy("sent_time", "desc")
     );
     

     const querySnapshota=await getDocs(qa)
          console.log("res",querySnapshota)
          const datasa =await querySnapshota.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            forumid:id
          }));
          var a=[]
          
          a.push(datasa)
          console.log("asasa",a)
            setforums(a);
        //  comments.push({forum:item,comments:datasa})
      
  
   console.log("adoa",forum)
  // return comments
  };

  const getoforumreplies =async(id,forumid) => {
    var comments=[]
    
    
    setreplies([])
      
     const qa = query(
       collection(db, `forumtesting/${forumid}/Comments/${id}/replies`),
       orderBy("sent_time", "desc")
     );
     console.log("adffgs")

     const querySnapshota=await getDocs(qa)
          console.log("res",querySnapshota)
          const datasa =await querySnapshota.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            commentid:id,
            forumid:forumid
          }));
          var a=[]
          console.log("a",datasa)

          a.push(datasa)
          console.log("a",a)
            setreplies(a);
         // comments.push({forum:item,comments:datasa})
          console.log("Replies",datasa)
      
   console.log("adoa",forum)
  // return comments
  };


  const handleDelete = async (id) => {
    const forumsDoc = doc(db, "forumtesting", id);
    await deleteDoc(forumsDoc);
    getforums();
  };

  const handleDeleteComment = async (forumid,id,totalcomments) => {
    const forumsDoc = doc(db, `forumtesting/${forumid}/Comments`, id);
    await deleteDoc(forumsDoc);

    const frankDocRef = doc(db, "forumtesting", forumid);
    await updateDoc(frankDocRef, {totalcomments:(parseInt(totalcomments)-1)})
        .then((res) => {
          console.log("rees", res);
        })
        .catch((err) => {
          console.log("error", err);
        });
    getforums();
    getoforumcomments(forumid)

  };

  const handleDeletereply = async (forumid,commentid,id) => {
    const forumsDoc = doc(db, `forumtesting/${forumid}/Comments/${commentid}/replies`, id);
    await deleteDoc(forumsDoc);

    
    getoforumreplies(commentid,forumid)

  };


  useEffect(() => {
    getC();

  }, []);
  useEffect(() => {
    getforums();

  }, []);

  //useEffect(() => {
    //getforums();
 //   getoforumcomments();

 // }, [forum]);
 // useEffect(() => {
    //getforums();
   // getoforumreplies();

  //}, [getoforumcomments]);
  const handleClose = () => setOpen(false);
  const handleCloseComment = () => setOpenComment(false);
  const handleCloseReply = () => setOpenReply(false);

  const handleModal = () => setmodal(false);
  return (
    <div style={{ padding: 50 }}>
      <div className="row" style={{ marginBottom: 15 }}>
        <h1 style={{ textAlign: "center" }}>
          <b>{cname}</b>
        </h1>
        
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={{backgroundColor:'white',marginRight:'30%',marginLeft:'30%',padding:'30px',marginTop:"20px"}}>
          <h5 style={{ textAlign: "center", marginBottom: 15 }}>
            Update Post
          </h5>
          <label className="mb-2">
            <b>Upload Image: </b>
          </label>
          <input
            type="file"
            onChange={(e) => {setImg(e.target.files[0])
              seteditdata({
                ...editdata, // Copy the old fields
                image: e.target.value // But override this one
              });}}
          ></input>
         
          <label>
            <b>Description</b>
          </label>
          <textarea
            rows="4"
            cols="50"
            onChange={(e) => {setText(e.target.value)
              seteditdata({
                ...editdata, // Copy the old fields
                description: e.target.value // But override this one
              });}}
            value={editdata?.description}
          ></textarea>
          <Button
            style={{ backgroundColor: "brown", float: "right" }}
            variant="contained"
            size="small"
            onClick={()=>{
              handleAdd()
            setOpen(false)}}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      <Modal
        open={opencomment}
        onClose={handleCloseComment}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={{backgroundColor:'white',marginRight:'30%',marginLeft:'30%',padding:'30px',marginTop:"20px"}}>
          <h5 style={{ textAlign: "center", marginBottom: 15 }}>
            Update Comment
          </h5>
          
          
          <label>
            <b>Description</b>
          </label>
          <textarea
            rows="4"
            cols="50"
            onChange={(e) => {setText(e.target.value)
              seteditdata({
                ...editdata, // Copy the old fields
                commentdescription: e.target.value // But override this one
              });}}
            value={editdata?.comment_description}
            ></textarea>
          <Button
            style={{ backgroundColor: "brown", float: "right" }}
            variant="contained"
            size="small"
            onClick={()=>{
              handleAddComment()
            setOpenComment(false)}}
          >
            Submit
          </Button>
        </Box>
      </Modal>


      <Modal
        open={openreply}
        onClose={handleCloseReply}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box style={{backgroundColor:'white',marginRight:'30%',marginLeft:'30%',padding:'30px',marginTop:"20px"}}>
          <h5 style={{ textAlign: "center", marginBottom: 15 }}>
            Update Reply
          </h5>
          
          <label>
            <b>Description</b>
          </label>
          <textarea
            rows="4"
            cols="50"
            onChange={(e) => {setText(e.target.value)
              seteditdata({
                ...editdata, // Copy the old fields
                Replydescription: e.target.value // But override this one
              });}}
            value={editdata?.Reply_description}
            ></textarea>
          <Button
            style={{ backgroundColor: "brown", float: "right" }}
            variant="contained"
            size="small"
            onClick={()=>{
              handleAddReply()
            setOpenReply(false)}}
          >
            Submit
          </Button>
        </Box>
      </Modal>
      <div className="row">
      {console.log("forusm",forums)}
        {forum?.map((val, ind) => {
          let image = val.image;
         // console.log("ads",val)
          return (
            <div key={ind} className="col-md-4">
              <Card style={{ padding: 30, marginBottom: 20,backgroundColor:"papayawhip" }}>
                <div>
                  <div style={{display:'flex',flexDirection:'row'}}>
                    <AccountCircleTwoToneIcon sx={{ fontSize: "50px" }}>

                      </AccountCircleTwoToneIcon>
                    <p style={{marginLeft:30,fontSize:"26px",fontWeight:'bold'}}>{val.username}</p>  
                  
                    </div>
                    <hr></hr>
                    <div  style={{display:'flex',flexDirection:'row'}}>
                    
                  <h5>{val.description}</h5>
                  <div style={{alignContent:'right'}}>
                  <FlagSharpIcon sx={{ fontSize: "15px",color:'red'}} onClick={()=>addpostflag(val.reportedby,val.id)}>
                      </FlagSharpIcon >
                       </div>           
                  </div>
                  <p style={{textAlign:'right',fontSize:12}} onClick={()=>{
                    setshowcomment()
                    getoforumcomments(val.id)
                    }}>{val.totalcomments} comments</p>

                  {showcomments?
                  <div
                        style={{ overflowY: "scroll", width: 700, height: 250 }}
                      >
                        {forums[0]?.map((item, index) =>
                              item.forumid==val.id?
                              <div style={{marginRight:"27%"}}>
                                
                              <Card style={{backgroundColor:"beige",marginRight:"30%",marginBottom:10,padding:12}}>
                                <div style={{display:'flex',flexDirection:'row'}}>
                              <AccountCircleTwoToneIcon sx={{ fontSize: "20px" }}>

                              </AccountCircleTwoToneIcon>
                                <p style={{marginLeft:20,fontSize:'13px'}}>
                                {item.username}
                                </p>
                                </div>
                                <div  style={{display:'flex',flexDirection:'row'}}>
                                <p style={{marginLeft:20,fontSize:'13px'}}>
                                {item.comment_description}
                                </p>
                                
                      </div>
                      <div style={{display:'flex',flexDirection:'row',alignContent:'right'}}>
                      <EditTwoToneIcon sx={{ fontSize: "15px",color:'green'}} onClick={()=>{
                      seteditdata({forumid:val.id,id:item.id,username:item.username,comment_description:item.comment_description})
                      handleOpenComment()}}>
                      </EditTwoToneIcon >
                      <DeleteOutlineTwoToneIcon sx={{ fontSize: "15px",color:'darkblue'}} onClick={()=>handleDeleteComment(val.id,item.id,val.totalcomments)}>
                      </DeleteOutlineTwoToneIcon >
                      <FlagSharpIcon sx={{ fontSize: "15px",color:'red'}} onClick={()=>addcommentflag(item.reports,val.id,item.id)}>
                      </FlagSharpIcon >
                              <p style={{marginLeft:142,fontSize:10}} onClick={()=>{
                                setshowreply()
                                getoforumreplies(item.id,val.id)
                              }}>See replies</p>
                              </div>
                                   {showreplies?
                  <div
                        style={{ overflowY: "scroll", width: 350, height: 250 }}
                      >
                        {replies[0]?.map((it, index) =>{
                        
                            if(it.commentid==item.id){
                              console.log("faded",it)
                              return(
                                <div>
                               
                             <Card style={{marginRight:"10%",marginBottom:12,padding:13}}>
                                <div style={{display:'flex',flexDirection:'row'}}>
                              <AccountCircleTwoToneIcon sx={{ fontSize: "20px" }}>

                              </AccountCircleTwoToneIcon>
                                <p style={{marginLeft:2,fontSize:'13px'}}>
                                {it.username}
                                </p>
                                </div>
                            <div  style={{display:'flex',flexDirection:'row'}}>
                                <p style={{marginLeft:2,fontSize:'13px'}}>
                                {it.Reply_description}
                                </p>
                                
                      </div>
                      <div style={{display:'flex',flexDirection:'row',alignContent:'right'}}>
                      <EditTwoToneIcon sx={{ fontSize: "15px",color:'green'}} onClick={()=>{
                      seteditdata({forumid:val.id,commentid:item.id,username:it.username,id:it.id,Reply_description:it.Reply_description})
                      handleOpenReply()}}>
                      </EditTwoToneIcon >
                      <DeleteOutlineTwoToneIcon sx={{ fontSize: "15px",color:'darkblue'}} onClick={()=>handleDeletereply(val.id,item.id,it.id)}>
                      </DeleteOutlineTwoToneIcon >
                      <FlagSharpIcon sx={{ fontSize: "15px",color:'red'}} onClick={()=>addreplyflag(it.reports,val.id,item.id,it.id)}>
                      </FlagSharpIcon >
                            
                                  </div>
                      </Card>
                                </div>
                              
                              )
                    }}
                          )}
                          
                      </div>
                      
                      
                      :
                      <></>
        }
                                  
                                </Card>
                                </div>:<></>
                            
                          
                          )}
                      </div>
                      :
                      <></>
        }
                  <Button
                    style={{
                      backgroundColor: "#65350f",
                      marginLeft: 15,
                      float: "right",
                    }}
                    variant="contained"
                    size="small"
                    onClick={()=>{
                      seteditdata({id:val.id,image:val.image,description:val.description,username:val.username})
                      handleOpen()}}
                  >
                    Edit
                  </Button>
                  <Modal
                    open={modal}
                    onClose={handleModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      //  https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGBEpwrcx9BLcNgCluJrUoR5IGp0UzC7wt7_jQqpU1&s
                      style={{
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        backgroundSize: "cover",
                        //backgroundImage: `url("${image}")`,
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 600,
                        height: 600,
                        boxShadow: 24,
                        p: 4,
                      }}
                    >
                      <div
                        style={{ overflowY: "scroll", width: 600, height: 600 }}
                      >
                        {Comments.map((val, ind) => {
                          console.log(val)
                          return (
                            <Message
                              key={ind}
                              Name={val.username}
                              Time={val.sent_time}
                              comment={val.comment_description}
                              userimage={val.userimage}
                              commentId={val.id}
                              favlist={val.favlist}
                              reports={val.reports}
                              forumId={forumId}
                            />
                          );
                        })}
                      </div>
                    </Box>
                  </Modal>
                  <Button
                    style={{ backgroundColor: "#65350f", float: "right" }}
                    variant="contained"
                    size="small"
                    onClick={() => {
                      handleDelete(val.id);
                    }}
                  >
                    Delete
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
