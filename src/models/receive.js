import mongoose from "mongoose";
import jalaliMoment from 'moment-jalaali';      


const receiveSchema = new mongoose.Schema({
  date: {
    type: Date, // Example: "2024/5/3"
    required: true,
    default: new Date(),
  },
  afgDate: {
    type: String,
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  amount: {
    type: Number,
    required: false,
    min: [0, "مقدار رسید باید 0 یا یک عدد مثبت باشد"],
  },
  details: {
    type: String,
    required: false,
  },
});



receiveSchema.pre("save", function (next) {

  if (this.date) {
     this.afgDate = jalaliMoment(this.date).format('jYYYY/jM');
  }
  next();
});


export const Receive =
  mongoose.models.Receive || mongoose.model("Receive", receiveSchema);
