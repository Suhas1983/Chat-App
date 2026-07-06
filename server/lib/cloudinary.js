import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

try {
  const result = await cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg"
  );

  console.log(result);
} catch (err) {
  console.dir(err, { depth: null });
}
export default cloudinary;