const TryCatch = (callback) => {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      console.error("Internal Server Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

export default TryCatch;
