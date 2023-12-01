import express from "express";
const router = express.Router();
import {
  addServices,
  getServices,
  authCoach,
  coachProfile,
  logoutCoach,
  registerCoach,
  updateCoachProfile,
  addTimeSlot,
  deleteService,
  listBookings,
  changeStatus,
  listReviews,
  walletHistory,
  verifyOtp,
  uploadTrainingVideo,
  deleteTimeSlot,
} from "../controllers/coachController.js";
import multer from "multer";
import { protectCoach } from "../middlewares/authMiddleware.js";

const coachCertificate = multer.memoryStorage({
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const coachCertificateUpload = multer({ storage: coachCertificate });

router.post("/auth", authCoach);
router.post("/signup", coachCertificateUpload.array("images"), registerCoach);
router.patch("/verifyOtp", verifyOtp);
router.post("/logout", logoutCoach);
router
  .route("/profile")
  .get(protectCoach, coachProfile)
  .put(
    protectCoach,
    coachCertificateUpload.single("image"),
    updateCoachProfile
  );
router.post("/addService", protectCoach, addServices);
router.get("/getServices", protectCoach, getServices);
router.post("/addTimeSlot", protectCoach, addTimeSlot);
router.post("/delete/:serviceId", protectCoach, deleteService);
router.get("/bookings", protectCoach, listBookings);
router.patch("/changeStatus", protectCoach, changeStatus);
router.get("/reviews", protectCoach, listReviews);
router.get("/wallet", protectCoach, walletHistory);
router.post(
  "/video",
  protectCoach,
  coachCertificateUpload.single("video"),
  uploadTrainingVideo
);
router.patch("/removeTimeSlot/:timeSlotId/:index", protectCoach, deleteTimeSlot);

export default router;
