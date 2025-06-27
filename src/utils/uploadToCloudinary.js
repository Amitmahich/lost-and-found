export const uploadImageToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "chatApp"); // ✅ Replace this
  data.append("cloud_name", " amitmahich-cloud"); // ✅ Replace this

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/amitmahich-cloud/image/upload", // ✅ Replace this
    {
      method: "POST",
      body: data,
    }
  );

  const result = await res.json();
  return result.secure_url;
};
