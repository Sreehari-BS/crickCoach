import React, { useEffect, useState } from "react";
import { Box, Paper, Select, MenuItem, Grid, Pagination } from "@mui/material";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  Tabs,
  TabList,
  Tab,
  TabPanel,
} from "@mui/joy";
import Add from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import Loader from "./Loader";
import CoachHeader from "./CoachHeader"
import CoachHomeSidebar from "./CoachHomeSidebar";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useGetServicesMutation } from "../slices/coachApiSlice";
import { useAddTimeSlotMutation } from "../slices/coachApiSlice";
import { useRemoveTimeSlotMutation } from "../slices/coachApiSlice";

const CoachHome = () => {
  //modal
  const [open, setOpen] = React.useState(false);

  //Seting the End time
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");

  const [serviceName, setServiceName] = useState("");

  const [getServices, setGetServices] = useState();
  const [selectedService, setSelectedService] = useState({ serviceName: "" });

  const [serviceslist, { isLoading }] = useGetServicesMutation();
  const [timeSlot] = useAddTimeSlotMutation();
  const [removeTimeSlot] = useRemoveTimeSlotMutation();

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleFromTimeChange = (event) => {
    setStartTime(event.target.value);

    let startTimeDate = new Date(event.target.value);
    startTimeDate.setMinutes(
      startTimeDate.getMinutes() +
        (selectedService.duration !== undefined ? selectedService.duration : 0)
    );

    let toTimeDate = new Date(
      startTimeDate.getTime() - startTimeDate.getTimezoneOffset() * 60000
    );
    setEndTime(toTimeDate.toISOString().slice(0, 16));
  };

  const listServiceList = async () => {
    const { data } = await serviceslist();
    if (data) {
      setGetServices(data);
    }
  };

  const deleteTimeSlot = async (timeSlotId, index) => {
    try {
      const { data } = await removeTimeSlot({ timeSlotId, index });
      if (data) {
        toast.success("Time Slot deleted");
        listServiceList();
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const addTimeSlotSubmitHandler = async () => {
    try {
      const res = await timeSlot({
        serviceName,
        startTime,
        endTime,
      }).unwrap();

      if (res) {
        listServiceList();
        toast.success("New Time Slot Addded");
        setSelectedService({ serviceName: "" });
        setServiceName("");
        setStartTime("");
        setEndTime("");
      } else {
        toast.error("Can't Add New Time Slot");
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  useEffect(() => {
    listServiceList();
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
          <Box p={2} sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Button
                variant="soft"
                color="warning"
                startDecorator={<Add />}
                onClick={() => setOpen(true)}
              >
                Time Slot
              </Button>
            </Box>
            <br />
            <br />
            <br />
            <br />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography
                level="h2"
                align="center"
                fontFamily={"monospace"}
                gutterBottom
              >
                Available Time Slots
              </Typography>
              <Paper
                elevation={10}
                style={{
                  width: "75%",
                  borderRadius: "20px",
                }}
              >
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  aria-label="Vertical tabs"
                  orientation="vertical"
                  color="primary"
                  size="lg"
                  sx={{
                    height: 300,
                    borderRadius: "20px",
                    backgroundColor: "#FFF1EE",
                  }}
                >
                  <TabList sx={{ justifyContent: "center" }}>
                    {getServices &&
                      getServices.services.map((service, index) => (
                        <Tab
                          key={index}
                          variant="plain"
                          color="warning"
                          disableIndicator
                          indicatorInset
                          sx={{
                            fontWeight: 800,
                            fontFamily: "monospace",
                            borderRadius: "20px",
                          }}
                        >
                          {service.serviceName}
                        </Tab>
                      ))}
                  </TabList>
                  {getServices &&
                    getServices.services.map((service, index) => (
                      <TabPanel value={index} key={index}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row", // Changed from 'column' to 'row'
                            flexWrap: "wrap",
                          }}
                        >
                          {service.timeSlots.map((slot, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                marginLeft: 2.5,
                              }}
                            >
                              <Typography
                                variant="h6"
                                component="div"
                                sx={{ fontWeight: "bold" }}
                              >
                                {slot.date}
                              </Typography>
                              {slot.availableSlots.map((time, index) => (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                  key={index}
                                >
                                  <Typography
                                    variant="body1"
                                    component="div"
                                    sx={{ fontFamily: "monospace" }}
                                  >
                                    {time}
                                  </Typography>
                                  <DeleteForeverIcon
                                    onClick={() =>
                                      deleteTimeSlot(slot._id, index)
                                    }
                                    sx={{ ml: 2, cursor: "pointer" }}
                                    fontSize="sm"
                                  />
                                </div>
                              ))}
                            </Box>
                          ))}
                        </Box>
                      </TabPanel>
                    ))}
                </Tabs>
              </Paper>
            </Box>
          </Box>
        </Paper>
      </Box>
      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Add New Time Slot</DialogTitle>
          <DialogContent>
            Fill the informations for add time slots.
          </DialogContent>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              addTimeSlotSubmitHandler();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Service Name</FormLabel>
                <Select
                  value={selectedService.serviceName}
                  onChange={(e) => {
                    const selected = getServices.services.find(
                      (service) => service.serviceName === e.target.value
                    );
                    setSelectedService(selected);
                    setServiceName(e.target.value);
                  }}
                  name="serviceName"
                  required
                >
                  {getServices &&
                    getServices.services.map((service, index) => (
                      <MenuItem value={service.serviceName} key={index}>
                        {service.serviceName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Start Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="startTime"
                  value={startTime}
                  onChange={handleFromTimeChange}
                  required
                />
              </FormControl>
              <FormControl>
                <FormLabel>End Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="endTime"
                  value={endTime}
                  disabled
                  required
                />
              </FormControl>
              <Button type="submit" sx={{ backgroundColor: "coral" }}>
                Submit
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </Box>
    </>
  );
};

export default CoachHome;
