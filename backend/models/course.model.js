import mongoose from "mongoose";

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    image: {
      public_id: {
        type: String,
        require: true,
      },
      url: {
        type: String,
        require: true,
      },
    },
    creatorId : {
      type : mongoose.Types.ObjectId,
      ref : "Admin"
    }
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model("Course", courseSchema);
