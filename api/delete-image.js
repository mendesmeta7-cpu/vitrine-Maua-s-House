// api/delete-image.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { public_id } = req.body;
  console.log('--- API /delete-image ---');
  console.log('Payload reçu:', req.body);
  console.log('Public ID cible:', public_id);

  if (!public_id) {
    console.error('Erreur: Le champ public_id est manquant');
    return res.status(400).json({ error: 'Le champ public_id est requis' });
  }

  try {
    console.log(`Tentative de suppression sur Cloudinary pour: ${public_id}...`);
    const result = await cloudinary.uploader.destroy(public_id);
    console.log('Résultat Cloudinary:', result);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Erreur lors de la suppression Cloudinary:', error);
    return res.status(500).json({ error: 'Erreur serveur lors de la suppression', details: error.message });
  }
}
