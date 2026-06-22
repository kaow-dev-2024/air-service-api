require("dotenv").config();

const PORT = process.env.PORT || 5001;

const uploadSingle = async (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/svg+xml",
    "application/svg+xml",
  ];
  if (!allowedTypes.includes(file.mimetype)) {
    return res.status(409).json({ message: "Invalid file type" });
  }
  const MAX_SIZE_MB = 3;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return res.status(409).json({ message: "File size exceeds 3MB" });
  }

  let urlFile = `http://${process.env.BASE_URL}:${PORT}/uploads/` + file.filename;
  return res.status(200).json({ message: "File uploaded successfully", fileUrl: urlFile });

};

const uploadMultiple = async (req, res) => {
  const files = req.files;

  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/svg+xml",
    "application/svg+xml",
  ];
  for (const file of files) {
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(409).json({ message: "Invalid file type" });
    }
    const MAX_SIZE_MB = 3;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return res.status(409).json({ message: "File size exceeds 3MB" });
    }
  }
  const fileUrls = files.map(file => `http://${process.env.BASE_URL}:${PORT}/uploads/` + file.filename);
  return res.status(200).json({ message: "Files uploaded successfully", fileUrls });
}


module.exports = {
  uploadSingle,
  uploadMultiple
};
