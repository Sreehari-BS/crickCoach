import asyncHandler from "express-async-handler";
import { generateCoachToken } from "../utils/generateToken.js";
import ImageKit from "imagekit";
import Coach from "../models/coachModel.js";
import Service from "../models/servicesModel.js";
import Appointment from "../models/appointmentModel.js";
import Wallet from "../models/walletModel.js";
import Review from "../models/reviewModel.js";
import nodemailer from "nodemailer";

//Auth Coach
const authCoach = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const coach = await Coach.findOne({ email });

  if (coach) {
    if (coach.is_verified) {
      if (coach.is_approved) {
        if (!coach.is_blocked) {
          if (await coach.matchPassword(password)) {
            const tokens = generateCoachToken(res, coach._id);
            const wallet = await Wallet.findOne({ customer: coach._id });
            if (!wallet) {
              const newWallet = await Wallet.create({
                customer: coach._id,
              });
            }
            res.status(200).json({
              _id: coach._id,
              name: coach.name,
              email: coach.email,
              phoneNumber: coach.phoneNumber,
              profileImage: coach.profileImage,
              age: coach.age,
              experience: coach.experience,
              certificates: coach.certificates,
              tokens,
            });
          } else {
            res.status(400);
            throw new Error("Invalid Email or Password");
          }
        } else {
          res.status(400);
          throw new Error("Coach is Blocked by Admin");
        }
      } else {
        res.status(400);
        throw new Error("Admin Approval Needed");
      }
    } else {
      res.status(400);
      throw new Error("Please Verify Email");
    }
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

//register Coach
const registerCoach = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password, confirmPassword } = req.body;

  if (password === confirmPassword) {
    const coachExists = await Coach.findOne({
      $or: [{ phoneNumber }, { email }],
    });

    if (coachExists) {
      res.status(400);
      throw new Error("Coach Already Exists");
    }

    if (req.files && req.files.length > 0) {
      const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_END_POINT,
      });

      // uploading certificates to CDN
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          imagekit.upload(
            {
              file: file.buffer,
              fileName: `${Date.now()}-${file.originalname}`,
            },
            (error, result) => {
              if (error) {
                console.log("Error uploading image to imagekit", error);
                reject(error);
              } else {
                resolve(result.url);
              }
            }
          );
        });
      });

      try {
        const uploadImageUrls = await Promise.all(uploadPromises);

        const coach = await Coach.create({
          name,
          email,
          phoneNumber,
          password,
          certificates: uploadImageUrls,
        });

        if (coach) {
          const otp = Math.floor(Math.random() * 9000) + 1000;
          console.log(otp);

          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.NODE_MAILER_USER,
              pass: process.env.NODE_MAILER_PASS,
            },
          });

          let mailOptions = {
            from: process.env.NODE_MAILER_USER,
            to: email,
            subject: "crickCoach verification mail",
            text: `Welcome to crickCoach. Your otp for verification is: ${otp}`,
          };

          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          });

          res.status(201).json({
            email: coach.email,
            otp: otp,
          });
        } else {
          res.status(400);
          throw new Error("Invalid coach data");
        }
      } catch (error) {
        console.log(error.message);
        res.status(500).json({
          message: "Error uploading certificates to CDN",
        });
      }
    } else {
      const coach = await Coach.create({
        name,
        email,
        phoneNumber,
        password,
      });

      if (coach) {
        res.status(201).json({
          email: coach.email,
          otp: otp,
        });
      } else {
        res.status(400);
        throw new Error("Invalid coach data");
      }
    }
  } else {
    res.status(400);
    throw new Error("Passwords do not match");
  }
});

//OTP verification
const verifyOtp = asyncHandler(async (req, res) => {
  const { enteredOtp, otp, email } = req.body;

  if (enteredOtp == otp) {
    const coach = await Coach.findOne({ email });
    if (coach) {
      coach.is_verified = true;
      await coach.save();
      res.status(200).json("Otp Verified");
    } else {
      res.status(400);
      throw new Error("Coach not fount");
    }
  } else {
    res.status(400);
    throw new Error("Enter valid OTP");
  }
});

//getCoachProfile
const coachProfile = asyncHandler(async (req, res) => {
  const coach = {
    _id: req.coach._id,
    name: req.coach.name,
    email: req.coach.email,
    phoneNumber: req.coach.phoneNumber,
    certificates: req.coach.certificates,
    profileImage: req.coach.profileImage,
    age: req.coach.age,
    experience: req.coach.experience,
  };
  res.status(200).json(coach);
});

const updateCoachProfile = asyncHandler(async (req, res) => {
  const coach = await Coach.findById(req.coach._id);

  if (coach) {
    coach.name = req.body.name || coach.name;
    coach.email = req.body.email || coach.email;
    coach.phoneNumber = req.body.phoneNumber || coach.phoneNumber;

    if (req.body.age) {
      coach.age = req.body.age;
    }

    if (req.body.experience) {
      coach.experience = req.body.experience;
    }

    if (req.body.password) {
      coach.password = req.body.password;
    }

    if (req.file) {
      const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_END_POINT,
      });

      //uploading image to imageKit
      const uploadImage = () => {
        return new Promise((resolve, reject) => {
          imagekit.upload(
            {
              file: req.file.buffer,
              fileName: `${Date.now()}-${req.file.originalname}`,
            },
            (error, result) => {
              if (error) {
                console.log("Error uploading image to imagekit", error);
                reject(error);
              } else {
                resolve(result.url);
              }
            }
          );
        });
      };

      try {
        const imageUrl = await uploadImage();

        coach.profileImage = imageUrl;
      } catch (error) {
        res.status(500).json({ error: "Image Upload Failed" });
      }
    }

    const updatedCoach = await coach.save();

    res.status(201).json({
      _id: updatedCoach._id,
      name: updatedCoach.name,
      email: updatedCoach.email,
      phoneNumber: updatedCoach.phoneNumber,
      age: updatedCoach.age,
      experience: updatedCoach.experience,
      profileImage: updatedCoach.profileImage,
    });
  } else {
    res.status(404);
    throw new Error("Coach Not Found");
  }
});

//add servies
const addServices = asyncHandler(async (req, res) => {
  const { serviceName, serviceDescription, servicefees, serviceDuration } =
    req.body;

  const coach = await Service.findOne({ coach: req.coach._id });

  if (coach) {
    const existingService = coach.services.find(
      (service) => service.serviceName === serviceName
    );

    if (existingService) {
      res.status(400);
      throw new Error("Service is alredy exists");
    } else {
      const newService = {
        serviceName,
        description: serviceDescription,
        fees: servicefees,
        duration: serviceDuration,
        timeSlots: [],
      };
      coach.services.push(newService);

      await coach.save();

      res.status(201).json(coach);
    }
  } else {
    const newService = {
      serviceName,
      description: serviceDescription,
      fees: servicefees,
      duration: serviceDuration,
      timeSlots: [],
    };
    const newCoachService = new Service({
      coach: req.coach._id,
      services: [newService],
    });
    await newCoachService.save();

    res.status(201).json(newCoachService);
  }
});

//getServices
const getServices = asyncHandler(async (req, res) => {
  const services = await Service.findOne({ coach: req.coach._id });
  if (services) {
    res.status(200).json(services);
  } else {
    res.status(400);
    throw new Error("Services Not found");
  }
});

//Delete Service
const deleteService = asyncHandler(async (req, res) => {
  const serviceId = req.params.serviceId;

  const coachServices = await Service.findOneAndUpdate(
    { coach: req.coach._id },
    { $pull: { services: { _id: serviceId } } },
    { new: true }
  );

  if (coachServices) {
    res.status(200).json("Deleted");
  } else {
    res.status(400).json("service not found");
  }
});

//Adding Time Slots
const addTimeSlot = asyncHandler(async (req, res) => {
  const serviceName = req.body.serviceName;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const date = startTime.split("T")[0];
  const start = startTime.split("T")[1];
  const end = endTime.split("T")[1];

  const currentDate = new Date();

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  if (startDate < currentDate || endDate < currentDate) {
    return res.status(400).json({ message: "Time slot must be in the future" });
  }

  const servicesList = await Service.findOne({ coach: req.coach._id });
  const service = servicesList.services.find(
    (ser) => ser.serviceName === serviceName
  );

  if (service) {
    let timeSlot = service.timeSlots.find((slot) => slot.date === date);

    if (!timeSlot) {
      timeSlot = {
        date: date,
        availableSlots: [],
        bookedSlots: [],
      };
      service.timeSlots.push(timeSlot);
      //for not recognising the timeSlot for the first time
      timeSlot = service.timeSlots[service.timeSlots.length - 1];
    }
    timeSlot.availableSlots.push(`${start} - ${end}`);

    // Remove expired slots
    for (let slot of service.timeSlots) {
      const slotDate = new Date(slot.date);
      slotDate.setHours(0, 0, 0, 0);
      if (slotDate < currentDate) {
        const index = service.timeSlots.indexOf(slot);
        service.timeSlots.splice(index, 1);
      }
    }

    servicesList.markModified("services");

    await servicesList.save();

    res.status(200).json("Creating Time Slot is Successful");
  } else {
    res.status(404).json({ message: "Service not Found" });
  }
});

const deleteTimeSlot = asyncHandler(async (req, res) => {
  const coachId = req.coach._id;
  const timeSlotId = req.params.timeSlotId;
  const availableSlotsIndex = req.params.index;

  const serviceList = await Service.findOne({ coach: coachId });

  for (let i = 0; i < serviceList.services.length; i++) {
    for (let j = 0; j < serviceList.services[i].timeSlots.length; j++) {
      if (serviceList.services[i].timeSlots[j]._id.toString() === timeSlotId) {
        serviceList.services[i].timeSlots[j].availableSlots.splice(
          availableSlotsIndex,
          1
        );

        await serviceList.save();
          
        break;
      }
    }
  }

  res.status(200).json("Time slot removed")
});

//listBookings
const listBookings = asyncHandler(async (req, res) => {
  const coachId = req.coach._id;
  const service = await Service.findOne({ coach: coachId });
  const serviceId = service._id;
  const appointments = await Appointment.find({ service: serviceId }).populate(
    "user"
  );

  res.status(200).json(appointments);
});

//Cahange Status
const changeStatus = asyncHandler(async (req, res) => {
  const bookingId = req.query.bookingId;
  const status = req.query.status;
  const appointment = await Appointment.findById(bookingId);
  appointment.status = status;
  await appointment.save();

  res.status(200).json("Status Changed");
});

//list Reviews
const listReviews = asyncHandler(async (req, res) => {
  const coachId = req.coach._id;
  const reviews = await Review.find({ coach: coachId }).populate({
    path: "reviews.appointment",
    populate: {
      path: "user",
      model: "User",
    },
  });

  res.status(200).json(reviews);
});

//Wallet History
const walletHistory = asyncHandler(async (req, res) => {
  const coachId = req.coach._id;
  const wallet = await Wallet.findOne({ customer: coachId });

  res.status(200).json(wallet);
});

const uploadTrainingVideo = asyncHandler(async (req, res) => {
  const title = req.body.title;
  const coachId = req.coach._id;
  const coach = await Coach.findById(coachId);
  if (req.file) {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_END_POINT,
    });
    //uploading video to CDN(imageKit)
    const uploadVideo = () => {
      return new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: req.file.buffer,
            fileName: `${Date.now()}-${req.file.originalname}`,
          },
          (error, result) => {
            if (error) {
              console.log("Error uploading image to imagekit", error);
              reject(error);
            } else {
              resolve(result.url);
            }
          }
        );
      });
    };
    try {
      const videoUrl = await uploadVideo();

      const videoObj = {
        title: title,
        video: videoUrl,
      };

      coach.videos.push(videoObj);
    } catch (error) {
      res.status(500).json({ error: "Video upload failed" });
      return;
    }
  }

  await coach.save();

  res.status(200).json(coach.videos);
});

//logoutCoach
const logoutCoach = asyncHandler(async (req, res) => {
  res.cookie("coachAccessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.cookie("coachRefreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Coach Logged Out" });
});

export {
  authCoach,
  registerCoach,
  coachProfile,
  updateCoachProfile,
  addServices,
  getServices,
  addTimeSlot,
  deleteService,
  listBookings,
  changeStatus,
  listReviews,
  walletHistory,
  verifyOtp,
  uploadTrainingVideo,
  deleteTimeSlot,
  logoutCoach,
};
