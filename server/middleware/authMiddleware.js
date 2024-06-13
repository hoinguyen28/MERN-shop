const jwt = require("jsonwebtoken");
function verifyToken(req, res, next) {
  try {
    let token = req.header("Authorization");
    if (!token) {
      return res.status(403).send("Truy cập bị từ chối");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    // res.json(verified);
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const checkAdmin = (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
      res.status(403).send("Truy cập bị từ chối");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified.role !== "admin") {
      return res.status(400).json({
        status: "",
        message: "Bạn cần phải là admin",
        data: "",
      });
    }

    next();
  } catch (error) {}
};

const checkCopyright = (req, res, next) => {
  try {
  } catch (error) {}
};
module.exports = {
  verifyToken,
  checkAdmin,
};
