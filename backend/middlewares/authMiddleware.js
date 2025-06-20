// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import asyncHandler from "./asyncHandler.js";

// // Check if the user is authenticated or not
// const authenticate = asyncHandler(async (req, res, next) => {
//   let token;

//   // Read JWT from the 'jwt' cookie
//   token = req.cookies.jwt;

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.userId).select("-password");
//       next();
//     } catch (error) {
//       res.status(401);
//       throw new Error("Not authorized, token not found.");
//     }
//   } else {
//     res.status(401);
//     throw new Error("Not authorized. No token");
//   }
// });

// //  Check if user is admin or not
// const authorizedAdmin = (req, res, next) => {
//   if (req.user && req.user.isAdmin) {
//     next();
//   } else {
//     res.status(401).send("Not authorized as an admin");
//   }
// };

// export { authenticate, authorizedAdmin };

import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

// ✅ Now supports both Cookie *and* Header tokens
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // ✅ First try to read from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    // ✅ Fallback to cookie
    token = req.cookies.jwt;
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. No token.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed.");
  }
});

const authorizedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin");
  }
};

export { authenticate, authorizedAdmin };
