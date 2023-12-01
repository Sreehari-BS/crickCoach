import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Coach",
  },
  reviews: [
    {
      appointment: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Appointment",
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
