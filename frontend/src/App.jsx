import React, { useState, useEffect } from 'react';
import axios from 'axios';

const languages = {
  ar: "Arabic",
  zh: "Chinese (Simplified)",
  cs: "Czech",
  nl: "Dutch",
  en: "English",
  fr: "French",
  de: "German",
  el: "Greek",
  he: "Hebrew",
  hi: "Hindi",
  hu: "Hungarian",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  ko: "Korean",
  la: "Latin",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  es: "Spanish",
  sw: "Swahili",
  sv: "Swedish",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  vi: "Vietnamese",
  tl: "Filipino (Tagalog)"
};


function App() {
  const [text, setText] = useState('');
  const [to, setTo] = useState('es');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);


  useEffect(() => {
    const speechSynthesis = window.speechSynthesis;

    if (speechSynthesis) {
      speechSynthesis.onvoiceschanged = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
        setSelectedVoice(availableVoices.find(voice => voice.lang === 'en-US') || availableVoices[0]);
      };
    }
  }, []);

  const handleTranslate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/translate', {
        text,
        to
      });
      setTranslated(res.data.translatedText);
    } catch (error) {
      console.error(error);
      setTranslated('Translation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
  
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.onstart = () => {
      setIsRecording(true);
    };
  
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText); 
      setIsRecording(false);
    };
  
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };
  
    recognition.onend = () => {
      setIsRecording(false);
    };
  
    recognition.start();
  };

  const handleSpeakTranslation = (text) => {
    const speechSynthesis = window.speechSynthesis;

    if (!speechSynthesis) {
      alert("Your browser does not support Text-to-Speech.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Set the language and voice based on user selection
    utterance.lang = selectedVoice.lang;

    // Optional adjustments (can be customized)
    utterance.rate = 1; // Speed of speech
    utterance.pitch = 1; // Pitch of speech
    utterance.volume = 1; // Volume (0 to 1)

    speechSynthesis.speak(utterance);
  };
  

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Translate Text</h2>
      <textarea
        rows="4"
        cols="50"
        placeholder="Enter text to translate..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <button onClick={handleVoiceInput} disabled={isRecording}>
  {isRecording ? "Listening..." : "🎤 Speak"}
</button>

      <label>
        Translate to:
        <select value={to} onChange={(e) => setTo(e.target.value)}>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </label>
      <br />
      <button onClick={handleTranslate} disabled={loading}>
        {loading ? 'Translating...' : 'Translate'}
      </button>
      <h3>Translated Text:</h3>
      <p>{translated}</p>
      
      <label>
        Select Voice:
        <select
          value={selectedVoice ? selectedVoice.lang : ''}
          onChange={(e) => {
            const voice = voices.find(voice => voice.lang === e.target.value);
            setSelectedVoice(voice);
          }}
        >
          {voices.map((voice, index) => (
            <option key={index} value={voice.lang}>{voice.name} ({voice.lang})</option>
          ))}
        </select>
      </label>
      <br />
      {/* Button to Speak Translated Text */}
      <button onClick={() => handleSpeakTranslation(translated)} disabled={!translated}>
        🗣️ Speak Translation
      </button>
    </div>
  );
}

export default App;
