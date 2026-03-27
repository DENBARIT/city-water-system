import { AppError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }

  if (err.code === "P2002") {
    const field = err.meta?.target?.[0] ?? "field";
    return res.status(400).json({ message: `${field} already exists.` });
  }

  if (err.code === "P2025") {
    return res.status(404).json({ message: "Record not found." });
  }

  return res.status(500).json({ message: "Internal server error." });
};

export default errorHandler;