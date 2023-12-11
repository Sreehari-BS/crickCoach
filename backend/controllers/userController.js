import asyncHandler from "express-async-handler";
import { generateUserToken } from "../utils/generateToken.js";
import ImageKit from "imagekit";
import User from "../models/userModel.js";
import Coach from "../models/coachModel.js";
import Service from "../models/servicesModel.js";
import Appointment from "../models/appointmentModel.js";
import Wallet from "../models/walletModel.js";
import Review from "../models/reviewModel.js";
import axios from "axios";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

//Auth User
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (user.is_verified) {
      if (!user.is_blocked) {
        if (await user.matchPassword(password)) {
          const tokens = generateUserToken(res, user._id);
          console.log(tokens)
          const wallet = await Wallet.findOne({ customer: user._id });
          if (!wallet) {
            const newWallet = await Wallet.create({
              customer: user._id,
            });
          }
          res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            profileImage: user.profileImage,
          });
        } else {
          res.status(400);
          throw new Error("Invalid Email or Password");
        }
      } else {
        res.status(400);
        throw new Error("User is Blocked by Admin");
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

//Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, password, confirmPassword } = req.body;

  if (password === confirmPassword) {
    const userExists = await User.findOne({
      $or: [{ phoneNumber }, { email }],
    });

    if (userExists) {
      res.status(400);
      throw new Error("User Already Exists");
    }

    const user = await User.create({
      name,
      email,
      phoneNumber,
      password,
    });

    if (user) {
      let otp = Math.floor(Math.random() * 9000) + 1000;

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "isreeharibs@gmail.com",
          pass: "epdsxkiiajhtltdq",
        },
      });

      let mailOptions = {
        from: "isreeharibs@gmail.com",
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
        email: user.email,
        otp: otp,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } else {
    res.status(400);
    throw new Error("Passwords do not match");
  }
});

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  let otp = Math.floor(Math.random() * 9000) + 1000;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "isreeharibs@gmail.com",
      pass: "epdsxkiiajhtltdq",
    },
  });

  let mailOptions = {
    from: "isreeharibs@gmail.com",
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
    email: email,
    otp: otp,
  });
});

const googleLogin = asyncHandler(async (req, res) => {
  const { name, email, profileImage } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (!existingUser.is_blocked) {
      generateUserToken(res, existingUser._id);
      const wallet = await Wallet.findOne({ customer: existingUser._id });

      if (!wallet) {
        const newWallet = await Wallet.create({
          customer: existingUser._id,
        });
      }

      return res.status(200).json({
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        profileImage: existingUser.profileImage,
      });
    } else {
      res.status(400);
      throw new Error("User is Blocked by Admin");
    }
  } else {
    const user = await User.create({
      name,
      email,
      profileImage,
      is_verified: true,
    });

    generateUserToken(res, user._id);

    const newWallet = await Wallet.create({
      customer: user._id,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
    });
  }
});

//OTP verification
const verifyOtp = asyncHandler(async (req, res) => {
  const { enteredOtp, otp, email } = req.body;

  if (enteredOtp == otp) {
    const user = await User.findOne({ email });
    if (user) {
      user.is_verified = true;
      await user.save();
      res.status(200).json("Otp Verified");
    } else {
      res.status(400);
      throw new Error("User not fount");
    }
  } else {
    res.status(400);
    throw new Error("Enter valid OTP");
  }
});

//getUserProfile
const userProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phoneNumber: req.user.phoneNumber,
    profileImage: req.user.profileImage,
  };

  res.status(200).json(user);
});

//updateUsrProfile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.file) {
      const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_END_POINT,
      });
      //uploading image to CDN(imageKit)
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

        user.profileImage = imageUrl;
      } catch (error) {
        res.status(500).json({ error: "Image upload failed" });
        return;
      }
    }

    const updatedUser = await user.save();

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      profileImage: updatedUser.profileImage,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

//list All Coaches
const listCoach = asyncHandler(async (req, res) => {
  const coachData = await Coach.find({ is_approved: true });
  res.status(200).json(coachData);
});

//list services of specific coach from the services collection
const listCoachServices = asyncHandler(async (req, res) => {
  const coachId = req.params.coachId;
  const coachServices = await Service.findOne({ coach: coachId }).populate(
    "coach"
  );
  res.status(200).json(coachServices);
});

//list all unique services
const listAllUniqueServices = asyncHandler(async (req, res) => {
  const allServices = await Service.find();
  const uniqueServices = new Set();

  allServices.forEach((coach) => {
    coach.services.forEach((service) => {
      uniqueServices.add(service.serviceName);
    });
  });

  const uniqueServicesArray = [...uniqueServices];

  res.status(200).json(uniqueServicesArray);
});

//list Coach Based on the Services
const listCoachByService = asyncHandler(async (req, res) => {
  const serviceName = req.query.serviceName;
  const services = await Service.find().populate("coach");
  const coachList = [];
  services.forEach((service) => {
    service.services.forEach((ser) => {
      if (ser.serviceName === serviceName) {
        const coachObject = {
          _id: service._id,
          coach: service.coach,
          serviceName: serviceName,
          description: ser.description,
          fees: ser.fees,
          duration: ser.duration,
          timeSlot: ser.timeSlots,
        };
        coachList.push(coachObject);
      }
    });
  });

  res.status(200).json(coachList);
});

//SPaypal
const generateAccessToken = async () => {
  const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
  const base = "https://api-m.sandbox.paypal.com";
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await axios.post(
      `${base}/v1/oauth2/token`,
      "grant_type=client_credentials", // Move this to the request body
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded", // Specify the content type
        },
      }
    );

    const data = response.data; // Use response.data to get the access token
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

const createOrder = async (cart, data) => {
  const base = "https://api-m.sandbox.paypal.com";
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: cart[0].cost,
        },
      },
    ],
  };
  try {
    const response = await axios.post(url, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        // Uncomment one of these to force an error for negative testing (in sandbox mode only).
        // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
        // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

const captureOrder = async (orderID, cart) => {
  const base = "https://api-m.sandbox.paypal.com";
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  try {
    const response = await axios.post(
      url,
      null, // No request body needed
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          // Uncomment one of these to force an error for negative testing (in sandbox mode only).
          // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
          // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
          // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
        },
      }
    );
    if (response.status === 201) {
      const appointment = new Appointment({
        user: cart.user,
        service: cart.service,
        serviceName: cart.sku,
        duration: cart.duration,
        amount: cart.cost,
        date: cart.appointmentDate,
        time: cart.appointmentTime,
        status: "Pending",
      });

      const res = await appointment.save();

      if (res) {
        const serviceList = await Service.findById(cart.service);

        const currentService = serviceList.services.find((service) => {
          return service.serviceName === cart.sku;
        });
        const currentSlot = currentService.timeSlots.find((slot) => {
          return slot.date === cart.appointmentDate;
        });

        const index = currentSlot.availableSlots.indexOf(cart.appointmentTime);
        if (index > -1) {
          currentSlot.availableSlots.splice(index, 1);
        }

        currentSlot.bookedSlot.push(cart.appointmentTime);

        // Saving the updated serviceList
        await serviceList.save();

        const coachId = cart.coach;
        const wallet = await Wallet.findOne({ customer: coachId });
        if (wallet) {
          const newBalance = wallet.balance + cart.cost;
          const credit = {
            appointment: appointment._id,
            date: new Date(),
            amount: cart.cost,
          };

          await Wallet.updateOne(
            { customer: coachId },
            { $set: { balance: newBalance }, $push: { credits: credit } }
          );
        }
      }
    }

    return handleResponse(response);
  } catch (error) {
    console.error("Failed to capture order:", error);
    throw error;
  }
};

async function handleResponse(response) {
  try {
    const jsonResponse = response.data;
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = err.response.data; // Use err.response.data to get the error message
    throw new Error(errorMessage);
  }
}

//Payment Using Wallet
const walletPayment = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const serviceId = req.query.serviceId;
  const serviceName = req.query.serviceName;
  const duration = req.query.duration;
  const amount = req.query.amount;
  const date = req.query.date;
  const time = req.query.time;
  const coachId = req.query.coachId;

  const appointment = new Appointment({
    user: user,
    service: serviceId,
    serviceName: serviceName,
    duration: duration,
    amount: amount,
    date: date,
    time: time,
  });

  const appo = await appointment.save();

  if (appo) {
    const serviceList = await Service.findById(serviceId);

    const currentService = serviceList.services.find((service) => {
      return service.serviceName === serviceName;
    });

    const currentSlot = currentService.timeSlots.find((slot) => {
      return slot.date === date;
    });

    const index = currentSlot.availableSlots.indexOf(time);
    if (index > -1) {
      currentSlot.availableSlots.splice(index, 1);
    }

    currentSlot.bookedSlot.push(time);

    await serviceList.save();

    const userWallet = await Wallet.findOne({ customer: user });

    if (userWallet) {
      const newBalance = userWallet.balance - amount;
      const debit = {
        appointment: appointment._id,
        date: new Date(),
        amount: amount,
      };

      await Wallet.updateOne(
        { customer: user },
        { $set: { balance: newBalance }, $push: { debits: debit } }
      );
    }

    const coachWallet = await Wallet.findOne({ customer: coachId });

    if (coachWallet) {
      const newBalance = coachWallet.balance + amount;
      const credit = {
        appointment: appointment._id,
        date: new Date(),
        amount: amount,
      };

      await Wallet.updateOne(
        { customer: coachId },
        { $set: { balance: newBalance }, $push: { credits: credit } }
      );
    }

    res.status(200).json("Payment using wallet is successful");
  }
});

//list appointments by user
const listUserAppointment = asyncHandler(async (req, res) => {
  const userID = req.user._id;
  const appointments = await Appointment.find({ user: userID }).populate({
    path: "service",
    populate: {
      path: "coach",
      model: "Coach",
    },
  });

  res.status(200).json(appointments);
});

//Cancel Appointment
const appointmentCancel = asyncHandler(async (req, res) => {
  const appointmentId = req.params.appointmentId;
  const appointment = await Appointment.findById(appointmentId).populate(
    "service"
  );

  if (appointment) {
    await Appointment.updateOne(
      { _id: appointmentId },
      { $set: { status: "Cancelled" } }
    );

    const coachId = appointment.service.coach;

    const userWallet = await Wallet.findOne({ customer: req.user._id });
    const coachWallet = await Wallet.findOne({ customer: coachId });

    if (userWallet) {
      const newBalance = userWallet.balance + appointment.amount;
      const credit = {
        appointment: appointment._id,
        date: new Date(),
        amount: appointment.amount,
      };

      await Wallet.updateOne(
        { customer: req.user._id },
        { $set: { balance: newBalance }, $push: { credits: credit } }
      );
    }

    if (coachWallet) {
      const newBalance = coachWallet.balance - appointment.amount;
      const debit = {
        appointment: appointment._id,
        date: new Date(),
        amount: appointment.amount,
      };

      await Wallet.updateOne(
        { customer: coachId },
        { $set: { balance: newBalance }, $push: { debits: debit } }
      );
    }

    res.status(200).json("Appointment Cancelled");
  } else {
    res.status(400).json("Appointment not found");
  }
});

//Get Wallet Balance
const walletBalance = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const wallet = await Wallet.findOne({ customer: userId });
  const balance = wallet.balance;

  res.status(200).json(balance);
});

//Adding review
const addReview = asyncHandler(async (req, res) => {
  // const userId = req.user._id;
  const rating = req.query.rating;
  const comment = req.query.comment;
  const appointmentId = req.query.appointmentId;
  let coachId;

  const appointmentData = await Appointment.findById(appointmentId).populate(
    "service"
  );

  if (appointmentData) {
    coachId = appointmentData.service.coach;
  }

  const review = await Review.findOne({ coach: coachId });

  const appointment = await Appointment.findById(appointmentId);

  const reviewObj = {
    appointment: appointmentId,
    rating: rating,
    comment: comment,
  };
  if (review) {
    review.reviews.push(reviewObj);
    await review.save();

    appointment.is_reviewed = true;
    await appointment.save();

    res.status(200).json(review);
  } else {
    const reviews = [reviewObj];
    const newReview = await Review.create({
      coach: coachId,
      reviews: reviews,
    });

    appointment.is_reviewed = true;
    await appointment.save();

    res.status(200).json(newReview);
  }
});

//list Reviews
const listReviews = asyncHandler(async (req, res) => {
  const coachId = req.params.coachId;
  const reviews = await Review.find({ coach: coachId }).populate({
    path: "reviews.appointment",
    populate: {
      path: "user",
      model: "User",
    },
  });

  let avgRating = 0;

  if (reviews && reviews.length > 0) {
    let totalRating = 0;
    let count = 0;

    reviews.forEach((reviewDoc) => {
      reviewDoc.reviews.forEach((review) => {
        totalRating += review.rating;
        count++;
      });
    });

    avgRating = (totalRating / count).toFixed(2);
  }

  res.status(200).json({ reviews, avgRating });
});

//Wallet History
const walletHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const wallet = await Wallet.findOne({ customer: userId });

  res.status(200).json(wallet);
});

//Checking for a completed Appointment with a coach
const checkCompletedAppointment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const coachId = req.params.coachId;
  const userAppointments = await Appointment.find({ user: userId }).populate({
    path: "service",
    populate: {
      path: "coach",
      model: "Coach",
    },
  });
  if (userAppointments) {
    for (let i = 0; i < userAppointments.length; i++) {
      if (
        userAppointments[i].service.coach._id.toString() === coachId &&
        userAppointments[i].status === "Completed"
      ) {
        return res.status(200).json(userAppointments[i]);
      }
    }
  }

  res.status(400);
  throw new Error("Complete an appointment first");
});

//search Coach
const searchCoach = asyncHandler(async (req, res) => {
  const search = req.params.search;
  const coaches = await Coach.find({
    $and: [{ name: new RegExp("^" + search, "i") }, { is_approved: true }],
  });

  res.status(200).json(coaches);
});

//LogoutUser
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("userAccessToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.cookie("userRefreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User Logged Out" });
});

export {
  authUser,
  registerUser,
  googleLogin,
  userProfile,
  updateUserProfile,
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
  resendOTP,
  logoutUser,
};
