import axios from 'axios';
import getEmotions from '../lib/emotions.js';

export const translate = async (req, res) => {
  const LINGVA_BASE_URL = 'https://lingva-translate-brw0.onrender.com';
  const { from, text, to } = req.body;

  if (!text || !to || !from) {
    return res.status(400).json({ error: 'Missing text or target language.' });
  }


  try {

    const response = await axios.get(
      `${LINGVA_BASE_URL}/api/v1/${from}/${to}/${encodeURIComponent(text)}`
    );
    const translated = response.data?.translation;

    if (!translated) {
      return res.status(500).json({ error: 'Failed to get translation' });
    }

    const emotion = await getEmotions(text)
    res.json({ translatedText: translated, emotion: emotion });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed.' });
  }
};


