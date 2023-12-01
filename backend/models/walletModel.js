import mongoose from "mongoose";

const walletSchema = mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  credits: [
    {
      appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
      date: {
        type: Date,
      },
      amount: {
        type: Number,
      },
    },
  ],
  debits: [
    {
      appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
      },
      date: {
        type: Date,
      },
      amount: {
        type: Number,
      },
    },
  ],
});

const Wallet = mongoose.model("Wallet", walletSchema);

export default Wallet;
