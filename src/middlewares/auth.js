const adminAuth = (req, res, next) => {
  // logic to check authentication
  const token = "xyz";
  const isAdminAuthorzed = token === "xyz";
  if (isAdminAuthorzed) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};
const userAuth = (req, res, next) => {
  // logic to check authentication
  const token = "xyz";
  const isUserAuthorzed = token === "xyz";
  if (isUserAuthorzed) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = {userAuth, adminAuth };