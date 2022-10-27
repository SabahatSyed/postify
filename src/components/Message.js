import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { db } from "../firebase";
import {
  doc,
  deleteDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import CloseIcon from "@mui/icons-material/Close";
export default function ImgMediaCard(props) {
  const handleDelete = async (id) => {
    console.log(id);
    const forumsDoc = doc(db, `forum testing/${props.forumId}/Comments`, id);
    await deleteDoc(forumsDoc);
    // const forumsDoc = doc(db, "forum testing", id);
    // await deleteDoc(forumsDoc);
  };
  const [open, setOpen] = useState(false);
  const [reply, setreply] = useState([]);
  const handleOpen = () => setOpen(false);

  const getoforumcommentsreply = async (id) => {
    console.log(id);
    let fid = props.forumId;
    console.log(fid);
    const q = query(
      collection(db, `forum testing/${fid}/Comments/${id}/replies`),
      orderBy("sent_time", "desc")
    );
    console.log(q);
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    const datas = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setreply(datas);
    console.log(reply);
  };

  useEffect(() => {
    getoforumcommentsreply();
  }, []);
  return (
    <>
      <Card sx={{ marginX: 5, marginY: 10 }}>
        <CardHeader
          avatar={<Avatar>{props.userimage}</Avatar>}
          title={props.Name}
          subheader={props.Time.toString()}
        />

        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Comment
          </Typography>
          <Typography gutterBottom variant="h5" component="div">
            {props.comment}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Likes {props.favlist.length}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Reports {props.reports.length}
          </Typography>
        </CardContent>
        <CardActions
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Button
            size="small"
            onClick={() => {
              handleDelete(props.commentId);
            }}
          >
            Delete
          </Button>
          <ArrowDropDownIcon
            style={{ fontSize: 50 }}
            onClick={() => {
              getoforumcommentsreply(props.commentId);
              setOpen(true);
            }}
          />
        </CardActions>
      </Card>

      {open && (
        <Card sx={{ marginX: 5 }}>
          {reply.map((val, ind) => (
            <>
              {" "}
              <CardHeader
                avatar={<Avatar>{val.userimage}</Avatar>}
                title={val.username}
                subheader={val.sent_time.toString()}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Reply
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  {val.Reply_description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Likes {val.favlist.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reports {val.reports.length}
                </Typography>
              </CardContent>
              <CardActions
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <Button
                  size="small"
                  onClick={() => {
                    handleDelete(props.commentId);
                  }}
                >
                  Delete
                </Button>
                <CloseIcon
                  style={{ fontSize: 50 }}
                  onClick={() => setOpen(false)}
                />
              </CardActions>
            </>
          ))}
        </Card>
      )}
    </>
  );
}
