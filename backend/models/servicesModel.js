import mongoose from "mongoose";

const serviceSchema = mongoose.Schema({
  coach: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Coach",
  },
  services: [
    {
      serviceName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      fees: {
        type: Number,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      timeSlots: [
        {
          date: {
            type: String,
          },
          availableSlots: [String],
          bookedSlot: [String],
        },
      ],
    },
  ],
});

const Service = mongoose.model("Service", serviceSchema);

export default Service;
