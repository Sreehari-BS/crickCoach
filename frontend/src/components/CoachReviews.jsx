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
import { toast } from "react-toastify";
import Loader from "./Loader";
import CoachHeader from "./CoachHeader"
import CoachHomeSidebar from "./CoachHomeSidebar";
import { useListReviewsMutation } from "../slices/coachApiSlice";

const CoachHome = () => {
  //Pagiantion
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);

  const [userReviews, { isLoading }] = useListReviewsMutation();
  const [review, setReview] = useState("");

  const listReviews = async () => {
    const { data } = await userReviews();
    if (data) {
      setReview(data);
    }
  };

  useEffect(() => {
    listReviews();
  }, []);

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
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <Typography
              level="h2"
              align="center"
              fontFamily={"monospace"}
              gutterBottom
            >
              User Reviews
            </Typography>
            {isLoading && <Loader />}
            {review && review.length > 0 ? (
              <Box>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={3}
                >
                  {review.map((rev) =>
                    rev.reviews
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((item, index) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={3}
                          key={index}
                          sx={{ marginRight: "5.5em" }}
                        >
                          <Card
                            orientation="vertical"
                            size="lg"
                            variant="soft"
                            invertedColors
                            sx={{
                              width: 312,
                              height: "100%",
                              backgroundColor: "#F49884",
                            }}
                          >
                            <div>
                              <Typography level="h3" fontFamily={"monospace"}>
                                {item.appointment.user.name}
                              </Typography>
                              <Typography level="body-sm">
                                {item.comment}
                              </Typography>
                            </div>
                            <CardContent orientation="horizontal">
                              <div>
                                <Typography level="body-xs">
                                  Service Name:
                                </Typography>
                                <Typography
                                  fontSize="lg"
                                  fontWeight="lg"
                                  fontFamily={"monospace"}
                                >
                                  {item.appointment.serviceName}
                                </Typography>
                              </div>
                              <Button
                                variant="solid"
                                size="md"
                                color="primary"
                                aria-label="Explore Bahamas Islands"
                                sx={{
                                  ml: "auto",
                                  alignSelf: "center",
                                  fontWeight: 600,
                                  fontFamily: "monospace",
                                }}
                              >
                                {item.rating}
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))
                  )}
                </Grid>
                <br />
                <Box sx={{display: "flex", justifyContent: "center"}}>
                    <br />
                    <Pagination
                      color="warning"
                      count={Math.ceil(
                        (review && review.length
                          ? review[0].reviews.length
                          : 0) / rowsPerPage
                      )}
                      page={page}
                      onChange={(event, value) => setPage(value)}
                    />
                  </Box>
              </Box>
            ) : (
              <Typography
                className={"text-center"}
                fontFamily={"monospace"}
                level="h4"
                color="danger"
              >
                No Reviews Available
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
    </>
  );
};

export default CoachHome;
