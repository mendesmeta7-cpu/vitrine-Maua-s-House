export const uploadImage = async (file) => {
    if (!file) return null;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Configuration Cloudinary manquante (VITE_CLOUDINARY_CLOUD_NAME ou VITE_CLOUDINARY_UPLOAD_PRESET)");
    }

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(cloudinaryUrl, {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Erreur lors de l'upload Cloudinary");
        }

        const data = await response.json();
        return {
            url: data.secure_url,
            publicId: data.public_id
        };
    } catch (error) {
        console.error("Error uploading image to Cloudinary: ", error);
        throw error;
    }
};
