// import path from "path";
// import express from "express";
// import multer from "multer";

// const router = express.Router();

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },

//   filename: (req, file, cb) => {
//     const extname = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${Date.now()}${extname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const filetypes = /png|jpg|jpe?g|webp/;
//   const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

//   const extname = path.extname(file.originalname);
//   const mimetype = file.mimetype;

//   if (filetypes.test(extname) && mimetypes.test(mimetype)) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });
// const uploadSingleImage = upload.single("image");

// router.post("/", (req, res) => {
//   uploadSingleImage(req, res, (err) => {
//     if (err) {
//       res.status(400).json({ message: err.message });
//     } else if (req.file) {
//       res.json({
//         message: "File uploaded successfully",
//         image: `/${req.file.path}`,
//       });
//     } else {
//       res.json({ message: "No file uploaded" });
//     }
//   });
// });

// export default router;

import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = "uploads/";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /\.(png|jpg|jpeg|webp)$/i;
  const mimetypes = /^image\/(jpe?g|png|webp)$/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files (PNG, JPG, JPEG, WebP) are allowed!"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);

      // Handle different types of multer errors
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "File too large. Maximum size is 5MB.",
          });
        }
        return res.status(400).json({
          message: `Upload error: ${err.message}`,
        });
      }

      // Handle custom file filter errors
      return res.status(400).json({
        message: err.message,
      });
    }

    if (req.file) {
      res.json({
        message: "File uploaded successfully",
        image: `/${req.file.path}`,
        filename: req.file.filename,
        size: req.file.size,
      });
    } else {
      res.status(400).json({
        message: "No file uploaded. Please select an image file.",
      });
    }
  });
});

export default router;
