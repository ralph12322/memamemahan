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

    //this part handles the emotion analysis, if the twinword can't identify the emotion that's when we use the gpt4
    let result = await getEmotionsv2(text);
    //usually complex text gets hard for twinword api, such as long messages, complex words, etc.
    if(result.emotion,length === 0){
      result = await getEmotions(text);

      if(!result || !result.emotion){
        return result = { translatedText:translated , emotion:"neutral", warning: "no API Used" };
      }
    } 
    
    res.json({ translatedText: translated, emotion: result.emotion, warning: result.source });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed.' });
  }
};
