const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/djjcqzebw/image/upload";
const UPLOAD_PRESET = "Maua's_hause";

export const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const response = await fetch(CLOUDINARY_URL, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Erreur lors de l'upload Cloudinary");
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error("Error uploading image to Cloudinary: ", error);
        throw error;
    }
};
