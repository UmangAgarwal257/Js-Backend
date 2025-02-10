const { Schema } = require("mongoose");
const ObjectId = mongoose.ObjectId;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  name: String,
});

const adminSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  password: String,
  name: String,
});

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  adminId: ObjectId,
});

const purchaseSchema = new Schema({
  courseId: ObjectId,
  userId: ObjectId,
});

const UserModel = mongoose.model("users", userSchema);
const AdminModel = mongoose.model("admin", adminSchema);
const CourseModel = mongoose.model("course", courseSchema);
const PurchasesModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
  UserModel: UserModel,
  AdminModel: AdminModel,
  CourseModel: CourseModel,
  PurchasesModel: PurchasesModel,
};
