import User from "../models/user.model";

export const updateUserById = async (id: string, updateData: any) => {
  return User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate({
    path: "preferences.defaultAccount",
    select: "name _id",
  });
};

export const getUserById = async (id: string) => {
  return User.findById(id);
};
