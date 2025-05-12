import axios from 'axios';
import {getEmotions, getEmotionsv2 } from '../lib/emotions.js';

export const translate = async (req, res) => {
  const LINGVA_BASE_URL = 'https://lingva-translate-brw0.onrender.com';
  const { from, text, to } = req.body;

  if(!LINGVA_BASE_URL) {
    console.log("mistake")
  }

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
    let emotion = await getEmotions(text);
    let warning = "api used: OPENAI"
    if(!emotion){
      warning = "api used: error in OPENAPI now using TWINWORD";
      emotion = await getEmotionsv2(text)
    }
    res.json({ translatedText: translated, emotion: emotion, warning: warning });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed.' });
  }
};


