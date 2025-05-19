import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Sun,
  Moon,
  Mic,
  Copy,
  ArrowRightLeft,
  Volume2,
} from 'lucide-react';

const languages = {
  "auto": "Auto Detect",
  "af": "Afrikaans",
  "ar": "Arabic",
  "az": "Azerbaijani",
  "be": "Belarusian",
  "bg": "Bulgarian",
  "bn": "Bengali",
  "bs": "Bosnian",
  "ca": "Catalan",
  "ceb": "Cebuano",
  "cs": "Czech",
  "cy": "Welsh",
  "da": "Danish",
  "de": "German",
  "el": "Greek",
  "en": "English",
  "eo": "Esperanto",
  "es": "Spanish",
  "et": "Estonian",
  "eu": "Basque",
  "fa": "Persian",
  "fi": "Finnish",
  "fr": "French",
  "ga": "Irish",
  "gl": "Galician",
  "gu": "Gujarati",
  "ha": "Hausa",
  "haw": "Hawaiian",
  "he": "Hebrew",
  "hi": "Hindi",
  "hmn": "Hmong",
  "hr": "Croatian",
  "ht": "Haitian Creole",
  "hu": "Hungarian",
  "hy": "Armenian",
  "id": "Indonesian",
  "ig": "Igbo",
  "is": "Icelandic",
  "it": "Italian",
  "ja": "Japanese",
  "jw": "Javanese",
  "ka": "Georgian",
  "kk": "Kazakh",
  "km": "Khmer",
  "kn": "Kannada",
  "ko": "Korean",
  "ku": "Kurdish (Kurmanji)",
  "ky": "Kyrgyz",
  "la": "Latin",
  "lb": "Luxembourgish",
  "lo": "Lao",
  "lt": "Lithuanian",
  "lv": "Latvian",
  "mg": "Malagasy",
  "mi": "Maori",
  "mk": "Macedonian",
  "ml": "Malayalam",
  "mn": "Mongolian",
  "mr": "Marathi",
  "ms": "Malay",
  "mt": "Maltese",
  "my": "Myanmar (Burmese)",
  "ne": "Nepali",
  "nl": "Dutch",
  "no": "Norwegian",
  "ny": "Chichewa",
  "pa": "Punjabi",
  "pl": "Polish",
  "ps": "Pashto",
  "pt": "Portuguese",
  "ro": "Romanian",
  "ru": "Russian",
  "rw": "Kinyarwanda",
  "sd": "Sindhi",
  "si": "Sinhala",
  "sk": "Slovak",
  "sl": "Slovenian",
  "sm": "Samoan",
  "sn": "Shona",
  "so": "Somali",
  "sq": "Albanian",
  "sr": "Serbian",
  "st": "Sesotho",
  "su": "Sundanese",
  "sv": "Swedish",
  "sw": "Swahili",
  "ta": "Tamil",
  "te": "Telugu",
  "tg": "Tajik",
  "th": "Thai",
  "tl": "Filipino",
  "tr": "Turkish",
  "uk": "Ukrainian",
  "ur": "Urdu",
  "uz": "Uzbek",
  "vi": "Vietnamese",
  "xh": "Xhosa",
  "yi": "Yiddish",
  "yo": "Yoruba",
  "zh": "Chinese",
  "zu": "Zulu"
};

export default function EmoVox() {
  // Functional states
  const [text, setText] = useState('');
  const [to, setTo] = useState('tl');
  const [from, setFrom] = useState('en');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [emotion, setEmotion] = useState(null)

  // Speech Synthesis states
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voices, setVoices] = useState([]);

  // Dark mode state (also used by your design)
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode on the body element so that the relevant CSS applies
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Load available voices for text-to-speech
  useEffect(() => {
  const speechSynthesis = window.speechSynthesis;

  if (!speechSynthesis) return;

  const preferredVoiceName = "Google UK English Male"; // use a commonly available voice name
  const preferredLang = "en-GB"; // broader fallback language

  const loadVoices = () => {
    const availableVoices = speechSynthesis.getVoices();

    console.log("Available voices:", availableVoices.map(v => `${v.name} (${v.lang})`));

    let matchedVoice =
      availableVoices.find(voice => voice.name === preferredVoiceName) ||
      availableVoices.find(voice => voice.lang === preferredLang) ||
      availableVoices[0]; // fallback to first available

    setVoices(availableVoices);
    setSelectedVoice(matchedVoice);
  };

  // some browsers load voices asynchronously
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
  }

  loadVoices();
}, []);

  useEffect(() => {
    if(translated){
    handleSpeakTranslation(translated);
    }
  },[translated]);

  // Handle the translation request via Axios
  const handleTranslate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('https://memamemahan.onrender.com/translate', {
        // const res = await axios.post('http://localhost:3000/translate', {
        from,
        text,
        to,
      });
      // Expecting res.data.translatedText in the response.
      setTranslated(res.data.translatedText);
      setEmotion(res.data.emotion);
      console.log(res.data.warning);
    } catch (error) {
      console.error(error);
      setTranslated('Translation failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Speech Recognition for voice input
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setText(spokenText);
      setIsRecording(false);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.start();
  };

  // Uses the Speech Synthesis API to speak out the translated text
  const handleSpeakTranslation = (textToSpeak) => {
    const speechSynthesis = window.speechSynthesis;
    if (!speechSynthesis) {
      alert("Your browser does not support Text-to-Speech.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    if (selectedVoice) {
      utterance.lang = selectedVoice.lang;
    }
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    speechSynthesis.speak(utterance);
  };

  // Optional: A simple swap function to swap languages (here it toggles target between English and Spanish)
  const handleSwapLanguages = () => {
    if (to !== from) {
      setTo(from);
      setFrom(to);
      setText(translated);
      setTranslated(text);
    } else {
      setTo('es');
    }
  };

  return (
    <main className="main h-screen w-screen bg-bg text-text">

      <header className="glass-card">
        <nav>
          <div className="logo">
            <span className="gradient-text">EmoVOX</span>
          </div>
          <div className="nav-actions">
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Moon className="w-6 h-6" />
              ) : (
                <Sun className="w-6 h-6" />
              )}
            </button>
          </div>
        </nav>
      </header>

      <section className="hero">
        <h1>
          Emo <span className="gradient-text">VOX</span>
        </h1>
        <p>Decoding feelings, one word at a time.</p>
      </section>

      {/* Translator Section */}
      <section className="translator-container glass-card">
        {/* Language Selector */}
        <div className="language-selector">
          <div className="language-box ">
            <label>Source</label>
            {/* Fixed Source as English */}
            <div className="language-dropdown">
              <select value={from} onChange={(e) => setFrom(e.target.value)}>
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button using Lucide icon */}
          <button
            className="swap-btn"
            onClick={handleSwapLanguages}
            aria-label="Swap Languages"
          >
            <ArrowRightLeft className="w-6 h-6" />
          </button>
          {/* target language tagalog fixed */}
          <div className="language-box">
            <label>Target</label>
            <div className="language-dropdown">
              <select value={to} onChange={(e) => setTo(e.target.value)}>
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Translation Area */}
        <div className="translation-area">
          {/* Input Text Box (Left) */}
          <div className="text-box">
            <label>English</label>
            <textarea
              className="text-input"
              placeholder="Type or paste text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <div className="text-actions">
              <button
                className="action-btn"
                onClick={handleVoiceInput}
                disabled={isRecording}
                aria-label="Voice Input"
              >
                <Mic className="w-5 h-5" />{" "}
                {isRecording ? "Listening..." : "Voice input"}
              </button>
            </div>
          </div>

          {/* Translated Text Box (Right) */}
          <div className="text-box">
            <label>Translated Text</label>
            <div className="text-output">
              {loading
                ? "Translating..."
                : translated || "Your translation will appear here..."}
            </div>
            <div className="text-actions">
              <button
                className="action-btn"
                onClick={() => {
                  navigator.clipboard.writeText(translated);
                  alert("Copied to clipboard!");
                }}
                aria-label="Copy Text"
              >
                <Copy className="w-5 h-5" /> Copy
              </button>
              <button
                className="action-btn"
                onClick={() => handleSpeakTranslation(translated)}
                disabled={!translated}
                aria-label="Speak Translation"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Translate Button */}
        <div className="translate-btn-container">
          <button
            className="btn btn-gradient"
            onClick={handleTranslate}
            disabled={loading}
          >
            {loading ? "Translating..." : "Translate with Emotion"}
          </button>
        </div>

        {/* Voice Selection */}
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <label>
            Select Voice:
            <select
              value={selectedVoice ? selectedVoice.lang : ''}
              onChange={(e) => {
                const voice = voices.find(
                  (voice) => voice.lang === e.target.value
                );
                setSelectedVoice(voice);
              }}
              style={{ marginLeft: "0.5rem" }}
            >
              {voices.map((voice, index) => (
                <option key={index} value={voice.lang}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Emotion Analysis */}
        <div className="emotion-display">
          <div className="emotion-icon">💩</div>
          <div className="emotion-text">
            <h4>You Will see your emotions here.</h4>
            <h3 className='font-extrabold black' style={{color:'red'}}>{emotion}</h3>
            <p>
              The text conveys happiness and warmth. Tone is upbeat with 85%
              confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-column">

          </div>
        </div>
        <p className="copyright">
          &copy; 2025 EmoVOX. Built with ❤️
        </p>
      </footer>
    </main>
  );
}
