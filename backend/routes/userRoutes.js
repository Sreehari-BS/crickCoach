import express from "express";
const router = express.Router();
import {
  authUser,
  registerUser,
  userProfile,
  updateUserProfile,
  logoutUser,
  listCoach,
  listCoachServices,
  listAllUniqueServices,
  listCoachByService,
  captureOrder,
  createOrder,
  listUserAppointment,
  appointmentCancel,
  walletBalance,
  walletPayment,
  addReview,
  listReviews,
  walletHistory,
  verifyOtp,
  checkCompletedAppointment,
  searchCoach,
  googleLogin,
  resendOTP,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import multer from "multer";

const userProfileImageStorage = multer.memoryStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const userProfileImageUpload = multer({ storage: userProfileImageStorage });

router.post("/signup", registerUser);
router.post("/auth", authUser);
router.post("/googleLogin", googleLogin);
router.post("/resendOTP", resendOTP);
router.patch("/verifyOtp", verifyOtp);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, userProfile)
  .put(protect, userProfileImageUpload.single("image"), updateUserProfile);
router.get("/home", protect, listCoach);
router.get("/services/:coachId", protect, listCoachServices);
router.get("/allServices", protect, listAllUniqueServices);
router.get("/listCoachByService", protect, listCoachByService);
router.post("/orders", async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { cart } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order." });
  }
});

router.post("/orders/:orderID/capture", async (req, res) => {
  try {
    const { cart } = req.body;
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID, cart);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    res.status(500).json("Failed to capture order.");
    console.log(error);
  }
});
router.get("/listAppointments", protect, listUserAppointment);
router.patch("/cancelAppointment/:appointmentId", protect, appointmentCancel);
router.get("/walletBalance", protect, walletBalance);
router.post("/walletPayment", protect, walletPayment);
router.post("/review", protect, addReview);
router.get("/review/:coachId", protect, listReviews);
router.get("/wallet", protect, walletHistory);
router.get(
  "/verifyCompletedAppointment/:coachId",
  protect,
  checkCompletedAppointment
);
router.get("/search/:search", protect, searchCoach);

export default router;
