import axiosClient from "./axios";

export const cloudinarySignatureSign = async () => {
    const response = await axiosClient.get(`${import.meta.env.VITE_API_URL}/v1/upload/cloudinary-signature`);

    return response.data;
}

export async function uploadToCloudinary(file: File) {
    const signature = await cloudinarySignatureSign();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signature.apiKey);
    formData.append("timestamp", signature.timestamp);
    formData.append("signature", signature.signature);
    formData.append("folder", "uploads");

    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    return res.json();
}
