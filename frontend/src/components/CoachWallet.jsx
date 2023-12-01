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
  Table,
  Sheet,
} from "@mui/joy";
import { toast } from "react-toastify";
import Loader from "./Loader";
import CoachHeader from "./CoachHeader"
import CoachHomeSidebar from "./CoachHomeSidebar";
import { useCoachWalletHistoryMutation } from "../slices/coachApiSlice";
import Lottie from "react-lottie-player";
import WalletAnimation from "../animations/coachWalletAnimation - 1699938283810.json";
import { useSelector } from "react-redux";

const CoachHome = () => {
  const [wallet, setWallet] = useState("");
  const [walletData, { isLoading }] = useCoachWalletHistoryMutation();

  const walletInfo = async () => {
    try {
      const { data } = await walletData();
      if (data) {
        setWallet(data);
      }
    } catch (error) {
      toast.error(error?.data?.message || error.error || error.message);
    }
  };

  const { coachInfo } = useSelector((state) => state.coachAuth);

  const createWalletCreditData = (date, amount) => {
    return { date, amount };
  };

  const createWalletDebitAmount = (date, amount) => {
    return { date, amount };
  };

  const walletCreditRows =
    wallet &&
    wallet?.credits?.map((item) =>
      createWalletCreditData(item.date, item.amount)
    );

  const walletDebitRows =
    wallet &&
    wallet?.debits?.map((item) =>
      createWalletDebitAmount(item.date, item.amount)
    );

  useEffect(() => {
    walletInfo();
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
            <Typography
              level="h2"
              align="center"
              fontFamily={"monospace"}
              gutterBottom
            >
              {coachInfo && coachInfo.name}'s Wallet
            </Typography>
            <Lottie
              animationData={WalletAnimation}
              play
              style={{ maxWidth: 200, maxHeight: 200, margin: "auto" }}
            />
            <Typography
              className="text-center"
              level="h4"
              sx={{ fontWeight: 600, fontFamily: "monospace" }}
            >
              Wallet Balance:
              <b style={{ color: "coral" }}> ₹{wallet && wallet.balance}</b>
            </Typography>
            <br />
            <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            >
              <Box>
                <Typography
                  color="success"
                  level="h3"
                  sx={{ fontWeight: 600, fontFamily: "monospace" }}
                >
                  Credits:
                </Typography>
                <hr />
                {isLoading && <Loader />}
                <Sheet sx={{ maxHeight: 300, overflow: "auto" }}>
                  <Table
                    sx={{ maxWidth: 500 }}
                    borderAxis="yBetween"
                    stickyHeader
                    size="lg"
                  >
                    <thead>
                      <tr>
                        <th>Si.No:</th>
                        <th>date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletCreditRows &&
                        walletCreditRows.map((row, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {new Date(row.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td style={{ color: "green", fontWeight: 700 }}>
                              ₹{row.amount}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Sheet>
              </Box>
              <Box>
                <Typography
                  color="danger"
                  level="h3"
                  sx={{ fontWeight: 600, fontFamily: "monospace" }}
                >
                  Debits:
                </Typography>
                <hr />
                <Sheet sx={{ maxHeight: 300, overflow: "auto" }}>
                  <Table
                    sx={{ maxWidth: 500 }}
                    borderAxis="yBetween"
                    stickyHeader
                    size="lg"
                  >
                    <thead>
                      <tr>
                        <th>Si.No:</th>
                        <th>date</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletDebitRows &&
                        walletDebitRows.map((row, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {new Date(row.date).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                              })}
                            </td>
                            <td style={{ color: "red", fontWeight: 700 }}>
                              ₹{row.amount}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Sheet>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
    </>
  );
};

export default CoachHome;
