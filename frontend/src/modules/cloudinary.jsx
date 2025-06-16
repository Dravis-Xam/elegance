import axios from 'axios';

// Upload each image one-by-one and return an array of secure URLs
export const uploadImagesToCloudinary = async (files) => {
  if (!files.length) return [];

  const uploadPromises = files.map(async (file) => {
    const formData = new FormData();
    formData.append('file', file); // ✅ Cloudinary expects 'file' not 'thumbnails'
    formData.append('upload_preset', 'elegance_images'); // ✅ must match your Cloudinary preset

    try {
      const res = await axios.post(import.meta.env.VITE_CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data.secure_url; // ✅ Return secure URL
    } catch (err) {
      console.error('Cloudinary upload error:', err);
      throw new Error('Failed to upload image');
    }
  });

  return Promise.all(uploadPromises);
};
