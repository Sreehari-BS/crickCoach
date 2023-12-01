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
import CoachHeader from "./CoachHeader"
import { useAddServiceMutation } from "../slices/coachApiSlice";
import { useGetServicesMutation } from "../slices/coachApiSlice";
import { useDeleteServiceMutation } from "../slices/coachApiSlice";
import { toast } from "react-toastify";
import Loader from "./Loader";
import CoachHomeSidebar from "./CoachHomeSidebar";

const CoachHome = () => {
  //modal
  const [open, setOpen] = React.useState(false);

  //Pagination
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(3);

  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicefees, setServicefees] = useState("");
  const [serviceDuration, setServiceDuration] = useState("");

  const [getServices, setGetServices] = useState("");

  const [addService] = useAddServiceMutation();

  const [serviceslist, { isLoading }] = useGetServicesMutation();

  const [deleteService] = useDeleteServiceMutation()

  const addServieSubmitHandler = async () => {
    try {
      const res = await addService({
        serviceName,
        serviceDescription,
        servicefees,
        serviceDuration,
      }).unwrap();

      if (res) {
        listServices();
        toast.success("New Service Added");
      } else {
        toast.error("Can't Add New Service");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const listServices = async () => {
    const { data } = await serviceslist();
    if (data) {
      setGetServices(data);
    }
  };

  const delService = async (id) => {
    try {
      const { data } = await deleteService(id);
      if (data) {
        toast.success("Service Deleted");
        listServices();
      } else {
        toast.error("Can't Delete");
      }
    } catch (error) {
      toast.error("Error: ", error);
    }
  };

  useEffect(() => {
    listServices();
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
            <Button
              variant="soft"
              color="warning"
              startDecorator={<Add />}
              onClick={() => setOpen(true)}
            >
              Service
            </Button>
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
              Available Services
            </Typography>
            {isLoading && <Loader />}
            {getServices && getServices.services.length > 0 ? (
              <>
                <Grid container spacing={4} justify="center">
                  {getServices.services
                    .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                    .map((service, index) => (
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
                              {service.serviceName}
                            </Typography>
                            <Typography level="body-sm">
                              {service.description}
                            </Typography>
                          </div>
                          <CardContent orientation="horizontal">
                            <div>
                              <Typography level="body-xs">Duration:</Typography>
                              <Typography
                                fontSize="lg"
                                fontWeight="lg"
                                fontFamily={"monospace"}
                              >
                                {service.duration}min
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
                              onClick={() => handleModal(coach)}
                            >
                              ₹{service.fees}
                            </Button>
                          </CardContent>
                          <CardContent>
                            <Button onClick={() => delService(service._id)}>
                              DELETE
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
                <Grid container justify="center" style={{ marginTop: "1rem" }}>
                  <Pagination
                    color="warning"
                    count={Math.ceil(
                      (getServices.services ? getServices.services.length : 0) /
                        rowsPerPage
                    )}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                  />
                </Grid>
              </>
            ) : (
              <Typography
                className={"text-center"}
                fontFamily={"monospace"}
                level="h4"
                color="danger"
              >
                No services available
              </Typography>
            )}

            <Modal open={open} onClose={() => setOpen(false)}>
              <ModalDialog>
                <DialogTitle>Add New Service</DialogTitle>
                <DialogContent>
                  Fill in the information about the Service.
                </DialogContent>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    addServieSubmitHandler();
                    setOpen(false);
                  }}
                >
                  <Stack spacing={2}>
                    <FormControl>
                      <FormLabel>Service Name</FormLabel>
                      <Input
                        name="serviceName"
                        autoFocus
                        onChange={(e) => setServiceName(e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        name="serviceDescription"
                        onChange={(e) => setServiceDescription(e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Fees</FormLabel>
                      <Input
                        type="number"
                        name="servicefees"
                        onChange={(e) => setServicefees(e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Duration</FormLabel>
                      <Select
                        name="serviceDuration"
                        value={serviceDuration}
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            setServiceDuration(e.target.value);
                          } else {
                            toast.error("Please select a Valid Duration");
                          }
                        }}
                        required
                      >
                        <MenuItem value="">Select duration</MenuItem>
                        <MenuItem value={30}>30 minutes</MenuItem>
                        <MenuItem value={60}>1 hour</MenuItem>
                        <MenuItem value={90}>1 hour 30 minutes</MenuItem>
                        <MenuItem value={120}>2 hours</MenuItem>
                      </Select>
                    </FormControl>
                    <Button type="submit" sx={{ backgroundColor: "coral" }}>
                      Submit
                    </Button>
                    {isLoading && <Loader />}
                  </Stack>
                </form>
              </ModalDialog>
            </Modal>
          </Box>
        </Paper>
      </Box>
    </Box>
    </>
  );
};

export default CoachHome;
