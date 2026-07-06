import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "tqqstb3e",
  api_key: "566219793121328",
  api_secret: "XdGY7Zajrk89MGO286MwlxI4lw4",
});

cloudinary.uploader
  .upload("https://res.cloudinary.com/demo/image/upload/sample.jpg")
  .then((r) => console.log("SUCCESS:", r.secure_url))
  .catch((e) => console.error("FULL ERROR:", e));