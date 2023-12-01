import express from "express";
const router = express.Router();
import {
  authAdmin,
  blockCoach,
  blockUser,
  unblockUser,
  unblockCoach,
  listCoach,
  listUser,
  logoutAdmin,
  listUnapprovedCoaches,
  approveCoach,
  rejectCoach,
  getAppointmentsByService,
  appointmentsReport,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";

router.post("/auth", authAdmin);
router.get("/userList", protectAdmin, listUser);
router.get("/coachList", protectAdmin, listCoach);
router.get("/unapprovedCoachList", protectAdmin, listUnapprovedCoaches);
router.patch("/userList/:id", protectAdmin, blockUser);
router.patch("/coachList/:id", protectAdmin, blockCoach);
router.patch("/userList/unblock/:id", protectAdmin, unblockUser);
router.patch("/coachList/unblock/:id", protectAdmin, unblockCoach);
router.patch("/unapprovedCoachList/approve/:id", protectAdmin, approveCoach);
router.delete("/unapprovedCoachList/reject/:id", protectAdmin, rejectCoach);
router.get("/coachAppointments", protectAdmin, getAppointmentsByService);
router.post("/appointmentReport", protectAdmin, appointmentsReport)
router.post("/logout", logoutAdmin);

export default router;
