export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error?.issues ?? result.error?.errors ?? [];

    if (issues.length === 0) {
      return res.status(400).json({ message: "Invalid request data." });
    }

    return res.status(400).json({
      errors: issues.map((e) => ({
        field: e.path?.join(".") || "unknown",
        message: e.message,
      })),
    });
  }

  req.body = result.data;
  next();
};