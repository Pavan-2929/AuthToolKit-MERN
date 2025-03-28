import cron from "node-cron";
import { User } from "../models/user.model.js";

export const removeUnverifiedUsers = () => {
  cron.schedule("0 */12 * * *", async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    await User.deleteMany({
      isVerified: false,
      verificationCodeExpire: {
        $lt: thirtyMinutesAgo,
      },
    });
  });
};
