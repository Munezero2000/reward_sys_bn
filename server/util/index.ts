import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from "cloudinary";
import { encodeBase64 } from "hono/utils/encode";

export async function uploadImageToCloudinary(file: File): Promise<string> {
  try {
    const byteArrayBuffer = await file.arrayBuffer();
    const base64 = encodeBase64(byteArrayBuffer);
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64}`, {
      folder: "rewards",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image");
  }
}
