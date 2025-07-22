import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      union : true
    },
    password : {
        type : String,
        require : true
    }
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
