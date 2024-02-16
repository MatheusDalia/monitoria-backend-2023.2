// authMiddleware.js

import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";

export const authMiddleware = async (req, res, next) => {
  // Get the JWT token from the request headers
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    // Verify the JWT token and extract the user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Fetch the user from the database using the user ID
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Attach the user object to the request for further use
    req.user = user;

    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
};
