import googleTranslateApi from '@vitalets/google-translate-api'; //using the @vitalets/google-translate-api for translation

export const translate = async (req, res) => {
    const { text, to } = req.body;
  
    if (!text || !to) {
      return res.status(400).json({ error: 'Missing text or target language.' });
    }
  
    try {
      const { translate } = googleTranslateApi;
      const result = await translate(text, { to });
  
      res.json({ translatedText: result.text });
    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({ error: 'Translation failed.' });
    }
  };
