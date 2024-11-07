import { NextFunction, Request, Response } from "express";
import User from "../../models/user";
import { CustomRequest } from "../../middlewares/authMiddleware";

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const _id = (req as CustomRequest).token.userId;

  try {
    const deletedRecord = await User.findByIdAndDelete(_id);

    if (!deletedRecord) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User successfully deleted",
      deletedUser: deletedRecord,
    });
  } catch (error) {
    console.error("Error during user deletion:", error);
    return res.status(500).json({
      error: "Server error, unable to delete user",
    });
  }
};
