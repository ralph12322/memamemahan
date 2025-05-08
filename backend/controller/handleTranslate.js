import googleTranslateApi from '@vitalets/google-translate-api'; //using the @vitalets/google-translate-api for translation
import axios from 'axios';

export const translate = async (req, res) => {
    const LINGVA_BASE_URL = 'https://lingva-translate-brw0.onrender.com';
    const { from, text, to } = req.body;
  
    if (!text || !to || !from) {
      return res.status(400).json({ error: 'Missing text or target language.' });
    }
  
    try {
      // const { translate } = googleTranslateApi;
      // const result = await translate(text, { to });

    const response = await axios.get(
      `${LINGVA_BASE_URL}/api/v1/${from}/${to}/${encodeURIComponent(text)}`
    );
    const translated = response.data?.translation;

    if (!translated) {
      return res.status(500).json({ error: 'Failed to get translation' });
    }
  
      res.json({ translatedText: translated });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ error: 'Translation failed.' });
    }
  };
