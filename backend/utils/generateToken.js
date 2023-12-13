import jwt from "jsonwebtoken";

const generateUserToken = (res, userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_USER_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_USER_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.cookie("userAccessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });

  res.cookie("userRefreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV !== "development",
  });

  return { accessToken, refreshToken };
};

const generateCoachToken = (res, coachId) => {
  const accessToken = jwt.sign(
    { coachId },
    process.env.JWT_COACH_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { coachId },
    process.env.JWT_COACH_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.cookie("coachAccessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("coachRefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const generateAdminToken = (res, adminId) => {
  const accessToken = jwt.sign(
    { adminId },
    process.env.JWT_ADMIN_ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );

  const refreshToken = jwt.sign(
    { adminId },
    process.env.JWT_ADMIN_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30d",
    }
  );

  res.cookie("adminAccessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("adminRefreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return { accessToken, refreshToken };
};

export { generateUserToken, generateCoachToken, generateAdminToken };
