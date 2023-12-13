import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js";
import Coach from "../models/coachModel.js";
import Appointment from "../models/appointmentModel.js";
import Service from "../models/servicesModel.js";
import { generateAdminToken } from "../utils/generateToken.js";
import dotenv from "dotenv";
dotenv.config();

// const saveAdminData = asyncHandler(async (email, password) => {
//   try {
//     const existingAdmin = await Admin.findOne({ email });
//     if (existingAdmin) {
//       return;
//     } else {
//       const admin = await Admin.create({
//         email: email,
//         password: password,
//       });
//     }
//   } catch (error) {
//     console.error("Error saving admin data:", error);
//     throw new Error("Unable to save admin data");
//   }
// });

// saveAdminData(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)

const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && admin.password === password) {
    const tokens = generateAdminToken(res, admin._id);
    res.status(200).json({
      _id: admin._id,
      email: admin.email,
      tokens,
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

const listUser = asyncHandler(async (req, res) => {
  const userData = await User.find();
  res.status(200).json(userData);
});

const listCoach = asyncHandler(async (req, res) => {
  const coachData = await Coach.find({ is_approved: true });
  res.status(200).json(coachData);
});

const listUnapprovedCoaches = asyncHandler(async (req, res) => {
  const unapprovedCoachList = await Coach.find({ is_approved: false });
  res.status(200).json(unapprovedCoachList);
});

const blockUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById({ _id: id });
  if (user) {
    user.is_blocked = true;
  } else {
    res.status(400);
    throw new Error("User not found");
  }
  await user.save();
  res.status(200).json(user);
});

const unblockUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById({ _id: id });
  if (user) {
    user.is_blocked = false;
  } else {
    res.status(400);
    throw new Error("User not found");
  }
  await user.save();
  res.status(200).json(user);
});

const blockCoach = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const coach = await Coach.findById({ _id: id });
  if (coach) {
    coach.is_blocked = true;
  } else {
    res.status(400);
    throw new Error("Coach not found");
  }
  await coach.save();
  res.status(200).json(coach);
});

const unblockCoach = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const coach = await Coach.findById({ _id: id });
  if (coach) {
    coach.is_blocked = false;
  } else {
    res.status(400);
    throw new Error("Coach not found");
  }
  await coach.save();
  res.status(200).json(coach);
});

const approveCoach = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const coach = await Coach.findById({ _id: id });
  if (coach) {
    coach.is_approved = true;
  } else {
    res.status(400);
    throw new Error("Coach not found");
  }
  await coach.save();
  res.status(200).json("Approved by Admin");
});

const rejectCoach = asyncHandler(async (req, res) => {
  const id = req.params.id;
  await Coach.deleteOne({ _id: id });
  res.status(200).json("Rejected by Admin");
});

const getAppointmentsByService = asyncHandler(async (req, res) => {
  let appointmentsByService = await Appointment.aggregate([
    {
      $group: {
        _id: "$service",
        appointments: { $push: "$$ROOT" },
      },
    },
  ]);

  for (let appointmentGroup of appointmentsByService) {
    const service = await Service.findById(appointmentGroup._id).populate(
      "coach"
    );
    appointmentGroup.coachName = service.coach.name;
    appointmentGroup.appointmentCount = appointmentGroup.appointments.length;

    let completedCount = 0;
    let totalRevenue = 0;
    for (let appointment of appointmentGroup.appointments) {
      if (appointment.status === "Completed") {
        completedCount++;
        totalRevenue += appointment.amount;
      }
    }
    appointmentGroup.completedCount = completedCount;
    appointmentGroup.totalRevenue = totalRevenue;
  }

  res.status(200).json(appointmentsByService);
});

const appointmentsReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.body;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const appointments = await Appointment.find({
    createdAt: {
      $gte: start,
      $lte: end,
    },
  })
  .populate('user', 'name')
  .populate({
    path: 'service',
    populate: {
      path: 'coach',
      model: 'Coach',
      select: 'name'
    }
  });

  if (!appointments) {
    res.status(404);
    throw new Error('No appointments found in the given date range');
  }

  res.status(200).json(appointments);
});

const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("adminAccessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.cookie("adminRefreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Admin Logged Out" });
});

export {
  authAdmin,
  listUser,
  listCoach,
  listUnapprovedCoaches,
  logoutAdmin,
  blockUser,
  unblockUser,
  blockCoach,
  unblockCoach,
  approveCoach,
  rejectCoach,
  getAppointmentsByService,
  appointmentsReport,
};
