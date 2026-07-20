"use strict";

/* ------------------------------------------------- */
/*                  REAL ESTATE API                  */
/* ------------------------------------------------- */

const Token = require("../models/token");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const CustomError = require("../errors/customErrors");
const { signAccessToken, signRefreshToken } = require("../helpers/jwtFunctions");
const { generateSimpleTokenKey } = require("../helpers/methodHelper");

// Single shared client instance for verifying Google ID tokens
const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.error("🚨 KRİTİK HATA: process.env.GOOGLE_CLIENT_ID bulunamadı! .env dosyanızı kontrol edin.");
  }
  return new OAuth2Client(clientId);
};

// Shared by login() and googleAuth() — issues the same Token/JWT pair regardless of how the user authenticated, so the rest of the app favorites, admin checks, etc.) never has to know or care which login method was used.
const issueSessionResponse = async (res, user, message) => {
  let tokenData = await Token.findOne({ userId: user._id });
  if (!tokenData) {
    tokenData = await Token.create({
      userId: user._id,
      token: generateSimpleTokenKey(user._id.toString()),
    });
  }
 
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
 
  res.status(200).send({
    error: false,
    message,
    data: {
      token: tokenData.token,
      jwt: {
        access: accessToken,
        refresh: refreshToken,
      },
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      },
    },
  });
};

module.exports = {
  signup: async (req, res) => {
    /*
      #swagger.tags = ["Authentication"]
      #swagger.summary = "Signup"
      #swagger.description = 'Signup with username, email and password for create new user'
      #swagger.parameters["body"] = {
        in: "body",
        required: true,
        schema: {
          "userName": "test",
          "email": "test@test.com",
          "password": "aA?123456",
          "firstName": "Test",    
          "lastName": "User"
        }
      }
    */
    const { userName, email, password, firstName, lastName } = req.body;
    console.log(req.body);
    
    if (!userName || !email || !password || !firstName || !lastName) {
      throw new CustomError("All fields are required", 400);
    }
    const user = await User.create({
      userName,
      email,
      password,
      firstName,
      lastName,
    });
    res.status(201).send({
      error: false,
      message: "User created successfully",
      data: user,
    });
  },
  login: async (req, res) => {
    /*
      #swagger.tags = ["Authentication"]
      #swagger.summary = "Login"
      #swagger.description = 'Login with username (or email) and password for get simpleToken and JWT'
      #swagger.parameters["body"] = {
        in: "body",
        required: true,
        schema: {
          "userName": "test",
          "password": "aA?123456",
        }
      }
    */
    const { userNameOrEmail, password } = req.body;
    // 1-Check if userName/email and password exist
    if (!(userNameOrEmail && password)) {
      throw new CustomError("Username/email and password are required", 400);
    }

    // 2-Check if user exists and password is correct
    const user = await User.findOne({
      $or: [
        { userName: userNameOrEmail },
        { email: userNameOrEmail }
      ],
    }).select("+password")

    if (!user) {
      throw new CustomError("Invalid username or password", 401);
    }

    // A Google-only account has no local password to compare against — guide the user to the correct sign-in method instead of a confusing "invalid password" error.
    if (!user.password) {
      throw new CustomError("This account uses Google Sign-In. Please continue with Google.", 401);
    }

    // 3-Check if user is active
    if (!user.isActive) {
      throw new CustomError("This account is no longer active", 401);
    }

    // 4-Check password
    const isPasswordCorrect = await user.correctPassword(
      password,
      user.password,
    );
    // console.log("isPasswordCorrect", isPasswordCorrect);
    if (!isPasswordCorrect) {
      throw new CustomError("Invalid username or password", 401);
    }

    // 5-If everything is okay, send token to client
    // --- SIMPLE TOKEN MANAGEMENT ---
    await issueSessionResponse(res, user, "Login successful");
  },
  // GOOGLE SIGN-IN
  googleAuth: async (req, res) => {
    /*
      #swagger.tags = ["Authentication"]
      #swagger.summary = "Google Sign-In"
      #swagger.description = 'Verifies a Google ID token from the frontend, finds or creates the matching user, and returns the same Token/JWT pair as a regular login'
      #swagger.parameters["body"] = {
        in: "body",
        required: true,
        schema: {
          "credential": "eyJhbGciOi..." 
        }
      }
    */
    const { credential } = req.body;
    if (!credential) {
      throw new CustomError("Google credential is required", 400);
    }
 
    // 1-Verify the ID token against Google's servers. This throws if the token is expired, malformed, or was issued for a different client.
    let payload;
    try {
      const clientInstance = getGoogleClient()
      const ticket = await clientInstance.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      throw new CustomError("Invalid or expired Google credential", 401);
    }
 
    const { sub: googleId, email, given_name, family_name, email_verified } = payload;
    if (!email || !email_verified) {
      throw new CustomError("Your Google account's email is not verified", 401);
    }
 
    // 2-Look up by googleId first (returning user)
    let user = await User.findOne({ googleId });
 
    // 3-Not found by googleId — maybe this email already has a classic account. Link the two instead of creating a duplicate.
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        user.googleId = googleId;
        user.isEmailVerified = true;
        await user.save({ validateBeforeSave: false });
      }
    }
 
    // 4-No account at all — create a brand new one. userName must be unique in this schema, so we derive one from the email's local part and disambiguate if it's already taken.
    if (!user) {
      const baseUserName = email.split("@")[0].replace(/[^a-zA-Z0-9_]/g, "") || "user";
      let candidateUserName = baseUserName;
      let suffix = 1;
      while (await User.findOne({ userName: candidateUserName })) {
        candidateUserName = `${baseUserName}${suffix++}`;
      }
 
      user = await User.create({
        googleId,
        email,
        userName: candidateUserName,
        firstName: given_name || "Google",
        lastName: family_name || "User",
        isEmailVerified: true,
      });
    }
 
    if (!user.isActive) {
      throw new CustomError("This account is no longer active", 401);
    }
 
    // 5-From here on, behave exactly like a normal login
    await issueSessionResponse(res, user, "Google sign-in successful");
  },
  // REFRESH JWT METHOD
  refresh: async (req, res) => {
    /*
      #swagger.tags = ["Authentication"]
      #swagger.summary = "Refresh JWT"
      #swagger.description = 'Refresh JWT access token using refresh token'
      #swagger.parameters["body"] = {
        in: "body",
        required: true,
        schema: {
          "token": "************************"
        }
      }
    */
  
    const {refreshToken: clientRefreshToken} = req.body
    if(!clientRefreshToken) {
      throw new CustomError("Refresh token is required", 400)
    }
    const decoded = jwt.verify(clientRefreshToken, process.env.REFRESH_KEY)
    if(!decoded || !decoded.id) {
      throw new CustomError("Invalid refresh token", 401)
    }
    if(!decoded.isActive) {
      throw new CustomError("This account is no longer active", 401)
    }
    const user = await User.findOne({_id: decoded.id})
    if(!user) {
      throw new CustomError("User not found", 404)
    }
    const newAccessToken = signAccessToken(user)
    const newRefreshToken = signRefreshToken(user)
    res.status(200).send({
      error: false,
      message: "Token refreshed successfully",
      data: {
        access: newAccessToken,
        refresh: newRefreshToken
      }
    })
  },
  logout: async (req, res) => {
    /*
      #swagger.tags = ["Authentication"]
      #swagger.summary = "Logout"
      #swagger.description = 'Logout by deleting simple token from database'
    */
    const authHeader = req.headers?.authorization || null
    // Guest-friendly and hybrid architecture check. If there's no token at all, it's missing. If there's a token, but it's not valid, it will be handled by the authentication middleware before reaching this point.
    if(!authHeader) {
      throw new CustomError("Authorization header is missing!", 401)
    }
    // If request contains a Simple Token, remove it from the database to destroy session
    if(authHeader.startsWith("Token")) {
      const tokenKey = authHeader.split(" ")[1]
      await Token.deleteOne({ token: tokenKey });
    }
    res.status(200).send({
      error: false,
      message: "Logout successful",
    });
  },
};
