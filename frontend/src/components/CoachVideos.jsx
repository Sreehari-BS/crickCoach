import React, { useEffect, useState } from "react";
import { Box, Paper, Select, MenuItem, Grid, Pagination } from "@mui/material";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  Card,
  CardContent,
} from "@mui/joy";
import Add from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import Loader from "./Loader";
import CoachHeader from "./CoachHeader"
import CoachHomeSidebar from "./CoachHomeSidebar";
import { useUploadVideoMutation } from "../slices/coachApiSlice";
import axios from "axios";

const CoachHome = () => {
  //modal
  const [open, setOpen] = React.useState(false);

  const [title, setTitle] = useState("");
  const [video, setVideo] = useState(null);
  const [uploadVideo, { isLoading }] = useUploadVideoMutation();

  const handleVideoUpload = (e) => {
    const selectedVideo = e.target.files[0];
    if (!selectedVideo.type.startsWith("video/")) {
      toast.error("Please select a video file");
      return;
    }
    setVideo(selectedVideo);
  };

  const videoUpload = async (e) => {
    try {
      const formData = new FormData();
      formData.append("video", video);
      formData.append("title", title);
      await axios.post("https://crick-coach-azure-app.azurewebsites.net/api/coach/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
        toast.success("Video uploaded");
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  return (
    <>
    <CoachHeader />
    <Box marginTop={8} sx={{ backgroundColor: "#FFF1EE", height: "91vh" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        maxWidth="95%"
        mx="auto"
        paddingTop={"1.5rem"}
      >
        <CoachHomeSidebar />
        <Paper elevation={10} style={{ width: "75%", borderRadius: "20px" }}>
          <Box p={2}>
            <Typography
              level="h2"
              align="center"
              fontFamily={"monospace"}
              gutterBottom
            >
              Uploaded Videos
            </Typography>
            <hr style={{ width: "70%", margin: "auto" }} />
            <Button
              variant="soft"
              color="warning"
              startDecorator={<Add />}
              sx={{ m: 2 }}
              onClick={() => setOpen(true)}
            >
              Video
            </Button>
          </Box>

          {/* Modal */}
          <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog>
              <DialogTitle>Add Training Video</DialogTitle>
              <DialogContent>
                Fill in the information about the Video.
              </DialogContent>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  videoUpload();
                  setOpen(false);
                }}
              >
                <Stack spacing={2}>
                  <FormControl>
                    <FormLabel>Video title</FormLabel>
                    <Input
                      onChange={(e) => setTitle(e.target.value)}
                      name="title"
                      autoFocus
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Upload Video</FormLabel>
                    <Input
                      onChange={handleVideoUpload}
                      name="video"
                      type="file"
                      accept="video/*"
                      required
                    />
                  </FormControl>
                  <Button type="submit" sx={{ backgroundColor: "coral" }}>
                    Submit
                  </Button>
                  {isLoading && <Loader />}
                </Stack>
              </form>
            </ModalDialog>
          </Modal>
        </Paper>
      </Box>
    </Box>
    </>
  );
};

export default CoachHome;
