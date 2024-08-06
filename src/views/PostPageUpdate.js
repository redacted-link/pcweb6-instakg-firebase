import React, { useEffect, useState } from "react";
import { Button, Container, Form , Image} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import SiteNav from "../templates/SiteNav";
import {updateDoc, doc, getDoc} from "firebase/firestore";
import {useAuthState} from "react-firebase-hooks/auth";
import { auth,db, storage} from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


export default function PostPageUpdate() {
  const params = useParams();
  const id = params.id;
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const navigate=useNavigate();
  const [user,loading]= useAuthState(auth);
  const [previewImage, setPreviewImage]=useState("https://picsum.photos/id/10/600");

  async function updatePost() {
    const imageReference= ref(storage, `images/${image.name}`);
    const response = await uploadBytes(imageReference, image);
    const imageUrl= await getDownloadURL(response.ref)                  
    await updateDoc(doc(db, "posts", id), {caption, image:imageUrl  });
    navigate("/");
  }

  async function getPost(id) {
    const postDocument= await getDoc(doc(db, "posts", id));
    const post = postDocument.data();
    setCaption(post.caption);
    setImage(post.image);
    setPreviewImage(post.image);
  }

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/login")
    getPost(id);
  }, [id,loading,navigate,user]);

  return (
    <div>
      <SiteNav />
      <Container>
        <h1 style={{ marginBlock: "1rem" }}>Update Post</h1>
        <Form>
          <Form.Group className="mb-3" controlId="caption">
            <Form.Label>Caption</Form.Label>
            <Form.Control
              type="text"
              placeholder="Lovely day"
              value={caption}
              onChange={(text) => setCaption(text.target.value)}
            />
          </Form.Group>
          <Image 
           src={previewImage}
           style= {{objectFit: "cover",
             width: "10rem",
             height: "10rem"}}/>                           
          <Form.Group className="mb-3" controlId="image">
            <Form.Label>Image </Form.Label>
            <Form.Control
              type="file"
              placeholder="https://picsum.photos/id/10/600"
              onChange={(e) => {
                const imageFile= e.target.files[0]
                const previewImage= URL.createObjectURL(imageFile);
                setImage(imageFile);
                setPreviewImage(previewImage)

              }}
            />  
            <Form.Text className="text-muted">
              Make sure the url has a image type at the end: jpg, jpeg, png.
            </Form.Text>
          </Form.Group>
          <Button variant="primary" onClick={(e) => updatePost()}>
            Submit
          </Button>
        </Form>
      </Container>
    </div>
  );
}