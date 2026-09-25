import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Share,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  Clipboard,
  Pressable,
  PlatformColor,
  RootTagContext,
  Dimensions,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import Voice from '@react-native-voice/voice';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SoundPlayer from 'react-native-sound-player';
import { SWATheam } from '../constant/ConstentValue';
import MsgModal from './common/MsgModal';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 🔑 Gemini API Key (Verified & Live)


// Educational Diagram Database
const DIAGRAM_DATABASE = {
  photosynthesis: {
    title: 'Photosynthesis Diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Photosynthesis_en.svg/1280px-Photosynthesis_en.svg.png',
  },
  watercycle: {
    title: 'Water Cycle Diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Water_cycle.png/1280px-Water_cycle.png',
  },
  solarsystem: {
    title: 'Solar System Diagram',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Planets2013.svg/1280px-Planets2013.svg.png',
  },
  plantcell: {
    title: 'Plant Cell Structure',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Plant_cell_structure_svg.svg/1280px-Plant_cell_structure_svg.svg.png',
  },
  heart: {
    title: 'Human Heart Anatomy',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Diagram_of_the_human_heart_%28cropped%29.svg/1280px-Diagram_of_the_human_heart_%28cropped%29.svg.png',
  },
};

// System Instruction for Clean Formatting (Strict English Default, Multi-Turn Context Aware, Clean Bullets '•', Bold Headers, Real Math)
const SYSTEM_PROMPT = `You are Swa-AI, an intelligent LMS teaching assistant for students and teachers.
STRICT FORMATTING & LANGUAGE RULES:
1. DEFAULT LANGUAGE & CONVERSATION CONTEXT:
   - Always respond in clean, professional ENGLISH by default for all general questions, concepts, science, math, lesson plans, questions, and worksheets.
   - MULTI-TURN CONTEXT & LANGUAGE SWITCHING: If the user refers to the ongoing conversation or previous topic/image (e.g. "esi topic ko hindi me aur details me samjhayen", "is image ko hindi me explain karo", "explain this in gujarati", "marathi me batao", "explain in more detail"), ALWAYS refer to the previous topic/image discussed in the chat history and provide a comprehensive, detailed explanation in the requested language using its authentic native script (e.g. हिन्दी for Hindi, ગુજરાતી for Gujarati, मराठी for Marathi, etc.).
   - If the user prompt is in English (e.g. "Explain photosynthesis", "What is force?", "Write a poem on rain"), you MUST respond 100% in English. Never reply in Gujarati/Marathi/Hindi unless explicitly asked.
2. NO EMOJIS: Do NOT use decorative emojis. Use clean standard bullet points (• ) for lists so the text can be copied cleanly for worksheets/exams without editing.
3. BOLD HEADERS: Mark section headings clearly with '📌 Heading Name' on a new line so they render bold.
4. REAL MATHEMATICAL NOTATION:
   - Always write mathematical powers as real Unicode superscripts: (a + b)² = a² + 2ab + b², (a - b)² = a² - 2ab + b², a² - b² = (a - b)(a + b). NEVER write caret ^ like (a+b)^2.
   - For any exponents/powers, use real superscripts: x², y³, z⁴, 10⁵, 2ⁿ, n⁻¹.
   - Write real arithmetic symbols: × for multiply, ÷ for divide, √ for square root, π for Pi, ± for plus-minus, ≠, ≤, ≥, ° for degrees.
   - Do NOT use raw arrows or LaTeX commands like \\xrightarrow{}, \\rightarrow, \\to, \\frac.
   - For fractions use real fractions like ½, ⅓, ¼, ¾ or clean (numerator / denominator).
5. SUBSCRIPTS FOR FORMULAS: Always write chemical formulas using exact Unicode subscript numbers (e.g. CO₂, H₂O, O₂, C₆H₁₂O₆).
6. EXAMPLES & TRICKS: Include a simple real-world example and a memory trick in the response.`;

// 🔊 ChatGPT-Style High-Definition Multi-Lingual Speech Engine (With Fast Speech Rate Switching & Native Voice Selection)
const TTS_ENGINE_HTML = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body>
  <script>
    var currentUtterance = null;
    var systemVoices = [];

    function loadVoices() {
      if (window.speechSynthesis) {
        systemVoices = window.speechSynthesis.getVoices() || [];
      }
    }
    loadVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    function isNoveltyVoice(name) {
      var lower = (name || '').toLowerCase();
      var bad = [
        'fred', 'zarvox', 'whisper', 'albert', 'junior', 'ralph',
        'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos',
        'deranged', 'good news', 'hysterical', 'pipe organ', 'princess',
        'trinoids', 'wobble', 'organ', 'jester', 'sinister', 'decay',
        'bruce', 'agnes', 'vicki', 'kathy', 'victoria'
      ];
      for (var i = 0; i < bad.length; i++) {
        if (lower.indexOf(bad[i]) !== -1) return true;
      }
      return false;
    }

    function findBestVoice(lang) {
      if (!systemVoices || systemVoices.length === 0) loadVoices();
      var target = (lang || 'en-US').toLowerCase().replace('_', '-');
      var prefix = target.split('-')[0];

      if (prefix === 'hi') {
        for (var i = 0; i < systemVoices.length; i++) {
          var v = systemVoices[i];
          var vLang = (v.lang || '').toLowerCase().replace('_', '-');
          var vName = (v.name || '').toLowerCase();
          if ((vLang.startsWith('hi') || vName.indexOf('lekha') !== -1 || vName.indexOf('hindi') !== -1) && !vLang.startsWith('en')) {
            return v;
          }
        }
        return null;
      }

      if (prefix === 'en') {
        var preferred = ['samantha', 'siri', 'alex', 'daniel', 'ava', 'karen', 'moira', 'serena', 'allison', 'tom', 'oliver', 'rishi'];
        for (var p = 0; p < preferred.length; p++) {
          for (var i = 0; i < systemVoices.length; i++) {
            var v = systemVoices[i];
            var vName = (v.name || '').toLowerCase();
            var vLang = (v.lang || '').toLowerCase().replace('_', '-');
            if (vLang.startsWith('en') && vName.indexOf(preferred[p]) !== -1 && !isNoveltyVoice(vName)) {
              return v;
            }
          }
        }
        for (var i = 0; i < systemVoices.length; i++) {
          var v = systemVoices[i];
          var vName = (v.name || '').toLowerCase();
          var vLang = (v.lang || '').toLowerCase().replace('_', '-');
          if (vLang.startsWith('en') && !isNoveltyVoice(vName)) {
            return v;
          }
        }
        return null;
      }

      for (var i = 0; i < systemVoices.length; i++) {
        var v = systemVoices[i];
        var vLang = (v.lang || '').toLowerCase().replace('_', '-');
        var vName = (v.name || '').toLowerCase();
        if (vLang === target && !isNoveltyVoice(vName) && !vLang.startsWith('en')) return v;
      }
      for (var i = 0; i < systemVoices.length; i++) {
        var v = systemVoices[i];
        var vLang = (v.lang || '').toLowerCase().replace('_', '-');
        var vName = (v.name || '').toLowerCase();
        if (vLang.startsWith(prefix) && !isNoveltyVoice(vName) && !vLang.startsWith('en')) return v;
      }
      return null;
    }

    function speakText(text, lang, rate) {
      try {
        if (!window.speechSynthesis) return;

        if (currentUtterance) {
          currentUtterance.onend = null;
          currentUtterance.onerror = null;
        }
        window.speechSynthesis.cancel();

        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang || 'en-US';
        utterance.pitch = 1.0;

        // Map speed rate for distinct fast teji-teji audio
        var rateVal = parseFloat(rate) || 1.0;
        if (rateVal === 1.25) rateVal = 1.35;
        else if (rateVal === 1.5) rateVal = 1.65;
        else if (rateVal === 2.0) rateVal = 2.0;

        utterance.rate = rateVal;

        var matchedVoice = findBestVoice(utterance.lang);
        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }

        utterance.onstart = function() {
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'TTS_START' }));
        };
        utterance.onend = function() {
          window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'TTS_END' }));
        };
        utterance.onerror = function(e) {
          if (e && e.error !== 'canceled' && e.error !== 'interrupted') {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'TTS_ERROR', error: e.error || 'error' }));
          }
        };

        currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'TTS_ERROR', error: err.message }));
      }
    }

    function pauseSpeech() {
      try { window.speechSynthesis.pause(); } catch(e) {}
    }

    function resumeSpeech() {
      try { window.speechSynthesis.resume(); } catch(e) {}
    }

    function stopSpeech() {
      try {
        if (currentUtterance) {
          currentUtterance.onend = null;
          currentUtterance.onerror = null;
        }
        window.speechSynthesis.cancel();
      } catch(e) {}
    }

    function handleTtsMsg(e) {
      try {
        var data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data.command === 'SPEAK') {
          speakText(data.text, data.lang, data.rate);
        } else if (data.command === 'PAUSE') {
          pauseSpeech();
        } else if (data.command === 'RESUME') {
          resumeSpeech();
        } else if (data.command === 'STOP') {
          stopSpeech();
        }
      } catch(err) {}
    }
    window.addEventListener('message', handleTtsMsg);
    document.addEventListener('message', handleTtsMsg);
  </script>
</body>
</html>
`;

// Helper to sanitize & parse text into clean real mathematical & scientific notation
const formatAiContent = (rawText) => {
  if (!rawText) return '';

  let text = rawText;

  // 1. Superscript Map for Powers & Exponents
  const supMap = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', 'n': 'ⁿ', 'x': 'ˣ', 'y': 'ʸ', 'a': 'ᵃ', 'b': 'ᵇ', 'm': 'ᵐ'
  };

  // Convert LaTeX fractions \frac{a}{b} -> (a / b)
  text = text.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)');

  // Convert \sqrt{x} -> √(x)
  text = text.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
  text = text.replace(/\\sqrt\b/g, '√');

  // Remove LaTeX arrows and convert to clean =
  text = text.replace(/\\xrightarrow\{[^}]*\}/g, ' = ');
  text = text.replace(/\\(rightarrow|to|Rightarrow|longrightarrow)/g, ' = ');
  text = text.replace(/➔|->|-->/g, ' = ');

  // Convert LaTeX symbols to real mathematical symbols
  text = text.replace(/\\times/g, '×');
  text = text.replace(/\\div/g, '÷');
  text = text.replace(/\\pm/g, '±');
  text = text.replace(/\\pi/g, 'π');
  text = text.replace(/\\cdot/g, '·');
  text = text.replace(/\\degree|\\circ/g, '°');
  text = text.replace(/\\neq/g, '≠');
  text = text.replace(/\\leq/g, '≤');
  text = text.replace(/\\geq/g, '≥');

  // Convert Powers / Carets ^{...} and ^2, ^3, ^n into real Superscripts
  text = text.replace(/\^\{([^}]+)\}/g, (_, chars) =>
    chars.split('').map((c) => supMap[c] || c).join('')
  );
  text = text.replace(/\^([0-9\+\-nxyabm]+)/g, (_, chars) =>
    chars.split('').map((c) => supMap[c] || c).join('')
  );

  // Convert common fractions to real Unicode fractions
  text = text.replace(/\b1\/2\b/g, '½');
  text = text.replace(/\b1\/3\b/g, '⅓');
  text = text.replace(/\b1\/4\b/g, '¼');
  text = text.replace(/\b3\/4\b/g, '¾');
  text = text.replace(/\b1\/5\b/g, '⅕');

  // Convert Chemical Formulas to Unicode Subscripts
  text = text
    .replace(/CO_?2\b/g, 'CO₂')
    .replace(/H_?2O\b/g, 'H₂O')
    .replace(/O_?2\b/g, 'O₂')
    .replace(/C_?6H_?12O_?6\b/g, 'C₆H₁₂O₆')
    .replace(/CO2\b/g, 'CO₂')
    .replace(/H2O\b/g, 'H₂O')
    .replace(/O2\b/g, 'O₂');

  // Convert markdown headers to clean 📌 Header
  text = text.replace(/^#{1,6}\s*(.*)$/gm, '\n📌 $1\n');

  // Remove LaTeX $ delimiters
  text = text.replace(/\$+/g, '');

  // Replace asterisks *** or ** with clean text
  text = text.replace(/\*{2,3}([^*]+)\*{2,3}/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');

  return text.trim();
};

// Smart Educational Image Engine:
// 1. Checks curated high-accuracy textbook diagram database
// 2. Only searches authentic specimens or generates AI diagrams if user explicitly requests drawing/diagram
const fetchSmartEducationalImage = async (promptText, hasUploadedImage) => {
  // If user uploaded a photo/document to analyze, do NOT generate any AI image/diagram
  if (!promptText || hasUploadedImage) return null;
  const lower = promptText.toLowerCase().trim();

  // 1. Curated textbook diagram database (Multilingual: Hindi, English, Gujarati, Marathi, Kannada, etc.)
  if (lower.includes('photosynthesis') || lower.includes('प्रकाश संश्लेषण') || lower.includes('प्रकाशसंश्लेषण') || lower.includes('પ્રકાશસંશ્લેષણ') || lower.includes('ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ')) {
    return DIAGRAM_DATABASE.photosynthesis;
  }
  if (lower.includes('water cycle') || lower.includes('जल चक्र') || lower.includes('जलचक्र') || lower.includes('જળચક્ર') || lower.includes('ಜಲಚಕ್ರ')) {
    return DIAGRAM_DATABASE.watercycle;
  }
  if (lower.includes('solar system') || lower.includes('सौर मंडल') || lower.includes('सूर्यमाला') || lower.includes('સૌરમંડળ') || lower.includes('ಸೌರವ್ಯೂಹ')) {
    return DIAGRAM_DATABASE.solarsystem;
  }
  if (lower.includes('plant cell') || lower.includes('पादप कोशिका') || lower.includes('वनस्पती पेशी') || lower.includes('વનસ્પતિ કોષ') || lower.includes('ಸಸ್ಯ ಜೀವಕೋಶ')) {
    return DIAGRAM_DATABASE.plantcell;
  }
  if (lower.includes('heart') || lower.includes('हृदय') || lower.includes('હૃદય') || lower.includes('ಹೃದಯ')) {
    return DIAGRAM_DATABASE.heart;
  }

  // 2. Only trigger if user EXPLICITLY asks to draw or generate an image/diagram
  const explicitImageTriggers = [
    'generate image', 'generate photo', 'create image', 'draw a', 'draw diagram', 'diagram of',
    'चित्र बनाओ', 'फोटो बनाओ', 'तस्वीर बनाओ', 'डायग्राम दिखाओ', 'चित्र दिखाओ', 'डायग्राम बनाओ'
  ];

  const wantsImage = explicitImageTriggers.some((kw) => lower.includes(kw));
  if (!wantsImage) return null;

  // Clean the subject query from command words
  const cleanSubject = promptText
    .replace(/\b(generate|create|draw|image|photo|picture|diagram|illustration|show|of|an|a|the|in|banao|dikhao|ka|ki|ke|ek|chitra|tasveer|banaiye|dikhaye)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If query is trivial, empty, or generic pronouns, do not generate
  if (!cleanSubject || cleanSubject.length < 3 || /^(this|that|it|me|kya|hai|karo|batao|explain|samjhao)$/i.test(cleanSubject)) {
    return null;
  }

  const queryTerm = cleanSubject;

  // 3. Search Wikimedia Commons for real photographic specimens
  try {
    const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(queryTerm)}&gsrlimit=8&iiprop=url&origin=*`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(wikiUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'SwaAI/1.0 (https://swaadhyayan.com)' }
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const pages = Object.values(data?.query?.pages || {});
      pages.sort((a, b) => (a.index || 0) - (b.index || 0));

      for (const page of pages) {
        const imgUrl = page?.imageinfo?.[0]?.url;
        if (imgUrl && /\.(jpe?g|png)/i.test(imgUrl) && !/icon|logo|stub|flag|symbol/i.test(imgUrl)) {
          const cleanTitle = (page.title || queryTerm)
            .replace(/^File:/i, '')
            .replace(/\.[^/.]+$/, '')
            .replace(/_/g, ' ');
          return {
            title: `Authentic: ${cleanTitle}`,
            url: imgUrl,
            isAuthentic: true,
          };
        }
      }
    }
  } catch (err) {
    console.log('Wikimedia search fallback:', err.message);
  }

  // 4. High-Res AI fallback only for explicit drawing requests
  const encodedPrompt = encodeURIComponent(`educational scientific illustration diagram of ${queryTerm}, clean white background`);
  return {
    title: `AI Diagram: ${queryTerm}`,
    url: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=768&nologo=true`,
    isAiGenerated: true,
  };
};

const SwaAiAssistant = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // { uri, base64 }
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const [msgModalVisible, setMsgModalVisible] = useState({ msg: '', status: false, type: '' });
  const [fullscreenImage, setFullscreenImage] = useState(null); // { uri, title }
  const [chatHistory, setChatHistory] = useState([]); // Last 5 chat sessions
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState(Date.now().toString());

  //Real Voice-to-Text states (Inline Bar style)
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceLang, setVoiceLang] = useState('hi-IN'); // 'hi-IN' or 'en-IN'

  //Read Aloud (TTS) States & Refs (ChatGPT style via Native SoundPlayer)
  const [activeTtsMsgId, setActiveTtsMsgId] = useState(null);
  const [isTtsPlaying, setIsTtsPlaying] = useState(false);
  const [ttsSeconds, setTtsSeconds] = useState(0);
  const [ttsSpeed, setTtsSpeed] = useState(1); // 1, 1.25, 1.5, 2
  const currentSpeakingTextRef = useRef('');
  const currentSpeakingLangRef = useRef('en');
  const audioChunksRef = useRef([]);
  const currentChunkIndexRef = useRef(0);
  const isTtsPlayingRef = useRef(false);

  //Read Aloud Timer Effect
  useEffect(() => {
    let interval = null;
    if (activeTtsMsgId && isTtsPlaying) {
      interval = setInterval(() => {
        setTtsSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTtsMsgId, isTtsPlaying]);

  //Native SoundPlayer FinishedPlaying Listener & Screen Blur Cleanup
  useEffect(() => {
    let finishedListener = null;
    try {
      finishedListener = SoundPlayer.addEventListener('FinishedPlaying', () => {
        if (isTtsPlayingRef.current) {
          const nextIdx = currentChunkIndexRef.current + 1;
          if (nextIdx < audioChunksRef.current.length) {
            currentChunkIndexRef.current = nextIdx;
            playCurrentChunk();
          } else {
            setIsTtsPlaying(false);
            setActiveTtsMsgId(null);
            setTtsSeconds(0);
            isTtsPlayingRef.current = false;
          }
        }
      });
    } catch (e) {
      console.log('SoundPlayer listener error:', e);
    }

    const unsubscribeBlur = navigation.addListener('blur', () => {
      stopTts();
    });

    const unsubscribeBeforeRemove = navigation.addListener('beforeRemove', () => {
      stopTts();
    });

    return () => {
      finishedListener?.remove?.();
      unsubscribeBlur?.();
      unsubscribeBeforeRemove?.();
      try {
        SoundPlayer.stop();
      } catch (e) { }
    };
  }, [navigation]);

  //WhatsApp-like Image Zoom state & ref
  const imageScrollRef = useRef(null);
  const lastTapRef = useRef(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Soundwave Bars (20 animated bars)
  const waveBars = useRef(
    Array.from({ length: 20 }, () => new Animated.Value(6))
  ).current;

  // Sound Wave animation loop when recording
  useEffect(() => {
    if (isVoiceRecording) {
      const minHeights = [4, 6, 8, 5, 7, 9, 6, 4, 7, 8, 5, 9, 6, 7, 4, 8, 6, 5, 7, 4];
      const maxHeights = [20, 26, 32, 22, 28, 36, 24, 18, 30, 34, 22, 38, 26, 30, 20, 32, 24, 22, 28, 18];
      const durations = [280, 340, 300, 390, 260, 320, 360, 290, 310, 370, 280, 330, 350, 270, 320, 300, 380, 290, 310, 340];

      const anims = waveBars.map((bar, idx) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(bar, {
              toValue: maxHeights[idx % maxHeights.length],
              duration: durations[idx % durations.length],
              useNativeDriver: false,
            }),
            Animated.timing(bar, {
              toValue: minHeights[idx % minHeights.length],
              duration: durations[idx % durations.length],
              useNativeDriver: false,
            }),
          ])
        )
      );

      anims.forEach((a) => a.start());

      return () => {
        anims.forEach((a) => a.stop());
        waveBars.forEach((bar) => bar.setValue(6));
      };
    } else {
      waveBars.forEach((bar) => bar.setValue(6));
    }
  }, [isVoiceRecording]);

  // Native Voice-to-Text Event Listeners (@react-native-voice/voice)
  useEffect(() => {
    Voice.onSpeechStart = () => {
      setIsVoiceRecording(true);
    };

    Voice.onSpeechEnd = () => {
      setIsVoiceRecording(false);
    };

    Voice.onSpeechError = (e) => {
      console.log('Voice recognition error:', e.error);
      setIsVoiceRecording(false);
    };

    Voice.onSpeechResults = (e) => {
      if (e.value && e.value.length > 0) {
        setVoiceTranscript(e.value[0]);
      }
    };

    Voice.onSpeechPartialResults = (e) => {
      if (e.value && e.value.length > 0) {
        setVoiceTranscript(e.value[0]);
      }
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners).catch(() => { });
    };
  }, []);

  const CHAT_HISTORY_STORAGE_KEY = '@swa_ai_chat_history_v1';

  const scrollViewRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Load last 5 chat sessions on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  //Stop Audio and Speech when leaving or navigating back from the screen
  useEffect(() => {
    const unsubscribe = navigation?.addListener?.('beforeRemove', () => {
      stopTts();
      try { Voice.stop(); } catch (e) { }
    });

    const unsubscribeBlur = navigation?.addListener?.('blur', () => {
      stopTts();
      try { Voice.stop(); } catch (e) { }
    });

    return () => {
      stopTts();
      try { Voice.stop(); } catch (e) { }
      unsubscribe && unsubscribe();
      unsubscribeBlur && unsubscribeBlur();
    };
  }, [navigation]);

  const loadChatHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setChatHistory(parsed.slice(0, 5));
        }
      }
    } catch (e) {
      console.log('Error loading chat history:', e);
    }
  };

  // Save current conversation session into the 5-session history
  const persistChatSession = async (updatedMessages, sessionId = currentSessionId) => {
    if (!updatedMessages || updatedMessages.length === 0) return;

    try {
      const firstUserMsg = updatedMessages.find((m) => m.role === 'user');
      const sessionTitle = firstUserMsg?.text
        ? (firstUserMsg.text.length > 40 ? firstUserMsg.text.substring(0, 40) + '...' : firstUserMsg.text)
        : 'Chat Session';

      const existingSessions = await AsyncStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
      let list = existingSessions ? JSON.parse(existingSessions) : [];
      if (!Array.isArray(list)) list = [];

      list = list.filter((s) => s.id !== sessionId);

      const now = new Date();
      const timeStr = now.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });

      const newSession = {
        id: sessionId,
        title: sessionTitle,
        timestamp: timeStr,
        messageCount: updatedMessages.length,
        messages: updatedMessages,
      };

      const updatedList = [newSession, ...list].slice(0, 5);
      setChatHistory(updatedList);
      await AsyncStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.log('Error saving chat session:', err);
    }
  };

  // Start fresh chat session
  const startNewChat = () => {
    setMessages([]);
    setCurrentSessionId(Date.now().toString());
    setInputText('');
    setSelectedImage(null);
    setShowHistoryModal(false);
  };

  // Load an existing chat session from history
  const loadChatSession = (session) => {
    if (session && session.messages) {
      setMessages(session.messages);
      setCurrentSessionId(session.id);
      setShowHistoryModal(false);
    }
  };

  // Delete a session from history
  const deleteSession = async (sessionId, e) => {
    e?.stopPropagation?.();
    const updated = chatHistory.filter((s) => s.id !== sessionId);
    setChatHistory(updated);
    await AsyncStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(updated));
    if (currentSessionId === sessionId) {
      setMessages([]);
      setCurrentSessionId(Date.now().toString());
    }
  };

  // Clear all history
  const clearAllHistory = async () => {
    setChatHistory([]);
    await AsyncStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
    startNewChat();
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, loading]);

  // Pulse animation for voice listening state
  useEffect(() => {
    if (isListening) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isListening]);

  // Image Selection Handler (1-click photo picker fix)
  const handleImagePick = (mode) => {
    setShowPlusMenu(false);

    setTimeout(() => {
      const options = {
        mediaType: 'photo',
        includeBase64: true,
        quality: 0.7,
      };

      const handleResponse = (response) => {
        if (response.didCancel) return;
        if (response.errorMessage) {
          Alert.alert('Image Error', response.errorMessage);
          return;
        }
        if (response.assets && response.assets.length > 0) {
          setSelectedImage({
            uri: response.assets[0].uri,
            base64: response.assets[0].base64,
          });
        }
      };

      if (mode === 'camera') {
        launchCamera(options, handleResponse);
      } else {
        launchImageLibrary(options, handleResponse);
      }
    }, 250);
  };


  // ─── Smart Content Filter (Context-Aware) ─────────────────────────────────
  //
  // LAYER 1 — Hard Blocklist
  //   Only words that are NEVER educational or scientific. These are blocked
  //   immediately regardless of context.
  //
  // LAYER 2 — Explicit Intent Patterns
  //   Medical/scientific terms (sex, penis, vagina, condom, rape, etc.) are NOT
  //   blocked by default. Instead, regex patterns detect EXPLICIT INTENT.
  //   Example:
  //     ✅ ALLOWED: "What is the function of the penis?" (biology)
  //     ✅ ALLOWED: "Explain sexual reproduction in plants" (NCERT)
  //     ✅ ALLOWED: "What is rape law in India?" (legal/social)
  //     ❌ BLOCKED: "penis dikhao" (explicit request)
  //     ❌ BLOCKED: "sex kaise karte hain" (explicit how-to)
  //     ❌ BLOCKED: "mujhe sex video chahiye" (explicit content request)
  //
  // LAYER 3 — Gemini BLOCK_LOW_AND_ABOVE (semantic, in API payload)
  //   Handles edge cases and anything that slips past layers 1 & 2.
  // ────────────────────────────────────────────────────────────────────────────

  // LAYER 1: Hard Blocklist — unmistakably abusive, NEVER educational
  const HARD_BLOCKLIST = [
    // Hindi gaaliyan (no valid educational use)
    'madarchod', 'maderchod', 'bahanchod', 'bhenchod', 'bhen ke laude', 'bhen ke lode',
    'bhosdike', 'bhosdiwale', 'bhosda', 'bhosdi', 'bhosd',
    'gaandu', 'gaanda', 'gandmara', 'gandmari', 'gandwa', 'gandmaro', 'gandua',
    'chudail', 'chudel', 'chudai', 'chodo', 'chodu', 'chumu', 'chomo',
    'randi', 'randwa', 'randwe', 'raand',
    'haramzada', 'haramzadi', 'jhantu', 'jhatu', 'jhant', 'ghassar', 'ghassarni',
    // Hindi slang body-part abuse (no medical Hindi term — medical uses Sanskrit/English)
    'lund', 'loda', 'lauda', 'lund',
    'chut', 'choot',
    'gand', 'gaand',
    'topa',
    // Explicit pornographic/sexual acts (no educational context)
    'blowjob', 'handjob', 'dildo', 'vibrator',
    'ghodi sex', 'standing sex', 'doggy style', 'doggy',
    // English strong profanity
    'fucking', 'fuck', 'cunt', 'whore', 'slut',
    // Pornographic content identifiers
    'porn', 'pornography', 'xxx',
    // Masturbation (explicit, not educational framing usually)
    'masturbate', 'masturbation', 'masturbating', 'hath maarna', 'hath marna',
    // Ejaculation explicit framing
    'ejaculate', 'ejaculation', 'orgasm',
  ];

  const hardBlocklistCheck = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase().trim();
    return HARD_BLOCKLIST.some((word) => {
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Whole-word boundary match
      const regex = new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, 'i');
      return regex.test(lower);
    });
  };

  // LAYER 2: Explicit Intent Patterns
  // These patterns catch medical/scientific terms used in an EXPLICIT (non-educational) context.
  // Educational questions (what is, explain, define, function of, biology, NCERT) are NOT matched.
  const EXPLICIT_INTENT_PATTERNS = [
    // Requests to show/send explicit visuals
    /\b(show|send|share|dikhao|dikha|bhejo|chahiye)\b.{0,40}\b(sex|nude|naked|boob|penis|vagina|lund|chut)\b/i,
    /\b(sex|nude|naked|boob|penis|vagina)\b.{0,40}\b(dikhao|dikha|bhejo|send|photo|image|video|pic)\b/i,
    // How-to explicit sexual acts
    /\b(sex|chudai|fucking|intercourse)\s+(kaise|karna|karo|karte|karein|position|scene)\b/i,
    /\bhow\s+to\s+(have|do|perform)\s+sex\b/i,
    /\bsex\s+(position|scene|video|photo|image|clip)\b/i,
    /\b(anal|oral|vaginal)\s+(sex|intercourse|karo|karna|kaise)\b/i,
    // Explicit seduction/sexual solicitation
    /\b(seduce|seduction)\s+(karo|karna|kaise|me|karein)\b/i,
    /\b(mujhe|usse|use)\s+(sex|chudai|fuck)\b/i,
    // Rape framing as explicit request (vs legal/awareness context)
    /\b(rape|balatkar)\s+(karo|karna|kaise|karte|scene)\b/i,
    // Erotic content request
    /\b(erotic|erotica|sexual\s+fantasy|sex\s+story|sex\s+kahani)\b/i,
    // Naked/nude content request
    /\b(nude|naked|nudes)\s+(image|photo|video|pic|send|dikhao)\b/i,
    /\b(send|dikhao|bhejo)\s+(nude|naked|nudes)\b/i,
  ];

  const explicitIntentCheck = (text) => {
    if (!text) return false;
    return EXPLICIT_INTENT_PATTERNS.some((pattern) => pattern.test(text));
  };

  // Combined content safety check (Layer 1 + Layer 2)
  const isContentBlocked = (text) => {
    return hardBlocklistCheck(text) || explicitIntentCheck(text);
  };

  // ────────────────────────────────────────────────────────────────────────────


  // Call Gemini AI with Full Multi-Turn Conversation History
  const callGeminiAI = async (userText, imageObj, historyMessages = []) => {
    const cleanKey = GEMINI_API_KEY.trim();

    if (!cleanKey || cleanKey === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error(
        'Gemini API Key not found!\n\nPlease set GEMINI_API_KEY in TeacherAiScannerDemo.js.'
      );
    }

    // ── Client-side content safety check (Layer 1 + Layer 2, runs BEFORE API call) ──
    if (isContentBlocked(userText)) {
      return formatAiContent(
        '⚠️ सुरक्षा और नीति (Safety Policy) के तहत इस प्रकार के अभद्र, हानिकारक या संवेदनशील प्रश्नों का उत्तर प्रदान नहीं किया जा सकता। कृपया केवल शैक्षणिक और अध्ययन संबंधी विषय ही पूछें।'
      );
    }

    // Build multi-turn conversation contents for full contextual continuity
    const contents = [];

    // Append up to last 8 messages so AI remembers previous topics, explanations, images & follow-ups
    const priorTurns = (historyMessages || []).slice(-8);
    for (const msg of priorTurns) {
      if (msg.role === 'user') {
        const parts = [{ text: msg.text || '' }];
        if (msg.imageBase64) {
          parts.push({
            inline_data: {
              mime_type: 'image/jpeg',
              data: msg.imageBase64,
            },
          });
        }
        contents.push({ role: 'user', parts });
      } else if (msg.role === 'assistant' && msg.text) {
        contents.push({
          role: 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    // Append current user prompt
    const currentParts = [{ text: userText }];
    if (imageObj?.base64) {
      currentParts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: imageObj.base64,
        },
      });
    }
    contents.push({ role: 'user', parts: currentParts });

    const payload = {
      system_instruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      contents: contents,
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_LOW_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_LOW_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_LOW_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_LOW_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_CIVIC_INTEGRITY',
          threshold: 'BLOCK_LOW_AND_ABOVE',
        },
      ],
    };

    // Verified live active models with high-availability priority
    const activeModels = [
      'gemini-flash-lite-latest',
      'gemini-3.7-flash',
      'gemini-3.5-flash',
      'gemini-3.6-flash',
    ];

    let resultText = null;
    let lastErr = '';

    for (const modelName of activeModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanKey}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        // Check if prompt or response was blocked by Google Gemini Safety Filters
        if (
          data?.promptFeedback?.blockReason === 'SAFETY' ||
          data?.candidates?.[0]?.finishReason === 'SAFETY'
        ) {
          resultText = "⚠️ सुरक्षा और नीति (Safety Policy) के तहत इस प्रकार के अभद्र, हानिकारक या संवेदनशील प्रश्नों का उत्तर प्रदान नहीं किया जा सकता। कृपया केवल शैक्षणिक और अध्ययन संबंधी विषय ही पूछें।";
          break; // Stop immediately on safety block
        }

        if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          resultText = data.candidates[0].content.parts[0].text;
          break; // SUCCESS! Stop immediately
        } else {
          lastErr = data?.error?.message || `${modelName} call failed`;
        }
      } catch (err) {
        lastErr = err.message;
      }
    }

    if (resultText) {
      return formatAiContent(resultText);
    } else {
      throw new Error(lastErr || 'There was a problem getting answers from Google AI. Please try again.');
    }
  };

  // Send Message Action
  const handleSend = async (customPrompt = null) => {
    const textToSend = customPrompt || inputText.trim();
    const currentImage = selectedImage;

    if (!textToSend && !currentImage) return;

    setInputText('');
    setSelectedImage(null);
    setShowPlusMenu(false);

    const userMsgId = Date.now().toString();
    const newMsg = {
      id: userMsgId,
      role: 'user',
      text: textToSend,
      imageUri: currentImage?.uri || null,
      imageBase64: currentImage?.base64 || null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentHistory = [...messages];
    setMessages((prev) => [...prev, newMsg]);
    setLoading(true);

    try {
      // Fetch Gemini AI response with conversation history and Smart Authentic Image in parallel
      const hasUploadedImage = !!currentImage?.base64 || !!currentImage?.uri;
      const [aiReply, diagram] = await Promise.all([
        callGeminiAI(
          textToSend || 'Explain this image in detail.',
          currentImage,
          currentHistory
        ),
        fetchSmartEducationalImage(textToSend, hasUploadedImage),
      ]);

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: aiReply,
        diagram: diagram,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => {
        const updated = [...prev, aiMsg];
        persistChatSession(updated);
        return updated;
      });
    } catch (error) {
      // If Gemini text servers experienced high demand, still deliver the authentic image gracefully
      let fallbackDiagram = null;
      try {
        const hasUploadedImage = !!currentImage?.base64 || !!currentImage?.uri;
        fallbackDiagram = await fetchSmartEducationalImage(textToSend, hasUploadedImage);
      } catch (e) { }

      if (fallbackDiagram) {
        const aiMsg = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          text: 'Here is the authentic image (Authentic Photo / Diagram) you requested. Tap on it to view it in full screen and share it.',
          diagram: fallbackDiagram,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => {
          const updated = [...prev, aiMsg];
          persistChatSession(updated);
          return updated;
        });
      } else {
        Alert.alert('AI Notice', error.message || 'Please try again in a few seconds due to heavy server load.');
      }
    } finally {
      setLoading(false);
    }
  };

  //Start ChatGPT-style Inline Voice Recording
  const startVoiceRecording = async () => {
    Keyboard.dismiss();
    setVoiceTranscript('');
    setIsVoiceRecording(true);
    try {
      await Voice.stop();
      await Voice.start(voiceLang);
    } catch (err) {
      console.log('Voice start error:', err);
    }
  };

  // Stop recording and place recognized speech into text input
  const stopVoiceRecording = async () => {
    try {
      await Voice.stop();
    } catch (_) { }
    setIsVoiceRecording(false);
    if (voiceTranscript.trim()) {
      setInputText(voiceTranscript.trim());
    }
  };

  // Cancel recording and revert
  const cancelVoiceRecording = async () => {
    try {
      await Voice.stop();
    } catch (_) { }
    setIsVoiceRecording(false);
    setVoiceTranscript('');
  };

  // Submit voice recording directly as AI prompt (ChatGPT style)
  const submitVoiceRecording = async () => {
    try {
      await Voice.stop();
    } catch (_) { }
    const textToSend = (voiceTranscript || inputText).trim();
    setIsVoiceRecording(false);
    setVoiceTranscript('');
    if (textToSend) {
      handleSend(textToSend);
    }
  };

  // Change voice language between Hindi (hi-IN) and English (en-IN)
  const handleChangeVoiceLang = async (lang) => {
    setVoiceLang(lang);
    if (isVoiceRecording) {
      try {
        await Voice.stop();
        setTimeout(async () => {
          try {
            await Voice.start(lang);
          } catch (e) {
            console.log('Voice restart error:', e);
          }
        }, 150);
      } catch (err) {
        console.log('Voice switch lang error:', err);
      }
    }
  };

  //Format TTS seconds into mm:ss
  const formatTtsTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Clean text for natural speech pronunciation
  const cleanTextForSpeech = (rawText) => {
    if (!rawText) return '';
    let text = rawText;
    // Remove markdown symbols, headers, asterisks, bullet points & emojis
    text = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    text = text.replace(/📌|💡|✅|🔍|🎙️|🔊|📖|🔬|🧪|✨|🌟/g, '');
    text = text.replace(/#{1,6}\s*/g, '');
    text = text.replace(/\*\*/g, '');
    text = text.replace(/\*/g, '');
    text = text.replace(/`{1,3}[^`]*`{1,3}/g, '');
    text = text.replace(/[•\-\_]/g, ' ');
    text = text.replace(/\s+/g, ' ');
    return text.trim();
  };

  // Auto-detect language of AI response for correct Multi-lingual TTS accent (Hindi, Punjabi, Gujarati, Marathi, etc.)
  const detectLanguageForTTS = (text) => {
    if (!text) return 'en';
    if (/[\u0A00-\u0A7F]/.test(text)) return 'pa'; // Punjabi (Gurmukhi)
    if (/[\u0A80-\u0AFF]/.test(text)) return 'gu'; // Gujarati
    if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta'; // Tamil
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te'; // Telugu
    if (/[\u0C80-\u0CFF]/.test(text)) return 'kn'; // Kannada
    if (/[\u0D00-\u0D7F]/.test(text)) return 'ml'; // Malayalam
    if (/[\u0900-\u097F]/.test(text)) {
      // Devanagari script: Distinguish Marathi from Hindi
      if (/\u0933|\b(आहे|नाही|म्हणजे|मध्ये|करणे|झाले|केले|होते|करा)\b/.test(text)) {
        return 'mr'; // Marathi
      }
      return 'hi'; // Hindi
    }
    return 'en';
  };

  // Split text into natural sentence chunks for continuous audio streaming
  const chunkTextForAudio = (text, maxLen = 160) => {
    if (!text) return [];
    const sentences = text.match(/[^.!?।\n,;]+[.!?।\n,;]+|[^.!?।\n,;]+$/g) || [text];
    const chunks = [];
    let current = '';

    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i].trim();
      if (!s) continue;
      if ((current + ' ' + s).length <= maxLen) {
        current = current ? `${current} ${s}` : s;
      } else {
        if (current) chunks.push(current);
        if (s.length > maxLen) {
          const words = s.split(' ');
          let sub = '';
          for (let w = 0; w < words.length; w++) {
            if ((sub + ' ' + words[w]).length <= maxLen) {
              sub = sub ? `${sub} ${words[w]}` : words[w];
            } else {
              if (sub) chunks.push(sub);
              sub = words[w];
            }
          }
          current = sub;
        } else {
          current = s;
        }
      }
    }
    if (current) chunks.push(current);
    return chunks;
  };

  // Speed parameter mapping for Google TTS API (Aggressive scale for noticeable fast teji-teji audio feel)
  const getGoogleTtsSpeedParam = (speedVal) => {
    if (speedVal === 1.25) return '0.55'; // Noticeably fast
    if (speedVal === 1.5) return '0.38';  // Rapid speed
    if (speedVal === 2) return '0.24';    // 200% Super fast teji-teji audio
    return '1';                           // 1x Normal
  };

  //Play current audio chunk via native SoundPlayer
  const playCurrentChunk = (speedOverride) => {
    if (!audioChunksRef.current || currentChunkIndexRef.current >= audioChunksRef.current.length) {
      setIsTtsPlaying(false);
      setActiveTtsMsgId(null);
      setTtsSeconds(0);
      isTtsPlayingRef.current = false;
      return;
    }

    const chunk = audioChunksRef.current[currentChunkIndexRef.current];
    const lang = currentSpeakingLangRef.current || 'en';
    const effectiveSpeed = speedOverride || ttsSpeed || 1;
    const speedParam = getGoogleTtsSpeedParam(effectiveSpeed);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lang}&client=tw-ob&ttsspeed=${speedParam}`;

    try {
      SoundPlayer.setSpeaker(true);
      SoundPlayer.playUrl(url);
      setIsTtsPlaying(true);
      isTtsPlayingRef.current = true;
    } catch (err) {
      console.log('SoundPlayer play error:', err);
      const nextIdx = currentChunkIndexRef.current + 1;
      if (nextIdx < audioChunksRef.current.length) {
        currentChunkIndexRef.current = nextIdx;
        playCurrentChunk(effectiveSpeed);
      } else {
        setIsTtsPlaying(false);
        setActiveTtsMsgId(null);
        isTtsPlayingRef.current = false;
      }
    }
  };

  //Read Aloud Trigger for a Message (Native SoundPlayer)
  const handleReadAloud = (msg) => {
    if (!msg?.text) return;

    if (activeTtsMsgId === msg.id) {
      toggleTtsPlayPause();
      return;
    }

    try { SoundPlayer.stop(); } catch (e) { }

    const clean = cleanTextForSpeech(msg.text);
    const lang = detectLanguageForTTS(clean);
    currentSpeakingTextRef.current = clean;
    currentSpeakingLangRef.current = lang;
    setActiveTtsMsgId(msg.id);
    setTtsSeconds(0);

    audioChunksRef.current = chunkTextForAudio(clean, 160);
    currentChunkIndexRef.current = 0;
    playCurrentChunk(ttsSpeed);
  };

  // Play / Pause toggle on floating player
  const toggleTtsPlayPause = () => {
    if (isTtsPlaying) {
      try { SoundPlayer.pause(); } catch (e) { }
      setIsTtsPlaying(false);
      isTtsPlayingRef.current = false;
    } else {
      try { SoundPlayer.resume(); } catch (e) { }
      setIsTtsPlaying(true);
      isTtsPlayingRef.current = true;
    }
  };

  //Cycle Speed (1x -> 1.25x -> 1.5x -> 2x)
  const cycleTtsSpeed = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(ttsSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setTtsSpeed(newSpeed);

    if (activeTtsMsgId && currentSpeakingTextRef.current) {
      try { SoundPlayer.stop(); } catch (e) { }
      playCurrentChunk(newSpeed);
    }
  };

  //Seek 15 seconds backward
  const seekBackward15 = () => {
    const newSec = Math.max(0, ttsSeconds - 15);
    setTtsSeconds(newSec);
    if (activeTtsMsgId && currentSpeakingTextRef.current) {
      const targetChunk = Math.max(0, Math.floor(newSec / 12));
      currentChunkIndexRef.current = targetChunk;
      try { SoundPlayer.stop(); } catch (e) { }
      playCurrentChunk(ttsSpeed);
    }
  };

  //Seek 15 seconds forward
  const seekForward15 = () => {
    const newSec = ttsSeconds + 15;
    setTtsSeconds(newSec);
    if (activeTtsMsgId && currentSpeakingTextRef.current) {
      const maxChunks = audioChunksRef.current.length;
      const targetChunk = Math.min(maxChunks - 1, Math.floor(newSec / 12));
      currentChunkIndexRef.current = targetChunk;
      try { SoundPlayer.stop(); } catch (e) { }
      playCurrentChunk(ttsSpeed);
    }
  };

  // Stop and Dismiss Read Aloud
  const stopTts = () => {
    try { SoundPlayer.stop(); } catch (e) { }
    setActiveTtsMsgId(null);
    setIsTtsPlaying(false);
    setTtsSeconds(0);
    isTtsPlayingRef.current = false;
    currentSpeakingTextRef.current = '';
    audioChunksRef.current = [];
    currentChunkIndexRef.current = 0;
  };



  // WhatsApp-like Double Tap Zoom Handler (Double Tap to Zoom In 2.5x & Out to 1.0x)
  const handleImageDoubleTap = (event) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (lastTapRef.current && (now - lastTapRef.current) < DOUBLE_TAP_DELAY) {
      if (isImageZoomed) {
        // Zoom out to 1.0x
        imageScrollRef.current?.scrollResponderZoomTo({
          x: 0,
          y: 0,
          width: SCREEN_WIDTH,
          height: SCREEN_HEIGHT,
          animated: true,
        });
        setIsImageZoomed(false);
      } else {
        // Zoom in to 2.5x centered on tapped point
        const { locationX, locationY } = event.nativeEvent;
        const zoomWidth = SCREEN_WIDTH / 2.5;
        const zoomHeight = (SCREEN_HEIGHT * 0.78) / 2.5;
        imageScrollRef.current?.scrollResponderZoomTo({
          x: Math.max(0, locationX - zoomWidth / 2),
          y: Math.max(0, locationY - zoomHeight / 2),
          width: zoomWidth,
          height: zoomHeight,
          animated: true,
        });
        setIsImageZoomed(true);
      }
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    setMsgModalVisible({ msg: 'Text copied!', status: true, type: 'success' });

    setTimeout(() => {
      setMsgModalVisible({ msg: "", status: false, type: 'success' });
    }, 1500);

  };

  // Share text functionality
  const shareMessage = async (text) => {
    try {
      await Share.share({
        message: text,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  // Share Image functionality
  const shareFullscreenImage = async (imgObj) => {
    if (!imgObj?.uri) return;
    try {
      await Share.share({
        title: imgObj.title || 'Image',
        message: imgObj.title ? `${imgObj.title}\n${imgObj.uri}` : imgObj.uri,
        url: imgObj.uri,
      });
    } catch (error) {
      console.error('Share image error:', error);
    }
  };

  // Inline Bold Parser for **text**
  const renderInlineFormatting = (textStr) => {
    if (!textStr) return null;
    const parts = textStr.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={i} style={{ fontWeight: 'bold', color: '#111827' }}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return part;
    });
  };


  // Custom Formatted Text Component with Clean Bullet Hanging Indent Alignment & Tight Action Row Spacing
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const cleanedText = rawText.replace(/\n{3,}/g, '\n\n').trim();
    const lines = cleanedText.split('\n');
    const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}📌🧪🌿👉💡🔍✨⭐📝📘🎯❓✅❌]\s*/u;

    return (
      <View style={{ width: '100%' }}>
        {lines.map((line, index) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <View key={`spacer-${index}`} style={{ height: 6 }} />;
          }

          // Header Line starting with Emojis (📌, 🧪, 🌿, 👉, 💡, 🔍, ✨, etc.)
          if (emojiRegex.test(trimmed)) {
            const headerTitle = trimmed.replace(emojiRegex, '').replace(/\*\*/g, '').trim();
            return (
              <Text key={index} selectable={true} selectionColor="#007AFF" style={styles.boldHeader}>
                {headerTitle}
              </Text>
            );
          }
          // Header Line starting and ending with ** (e.g. **प्रकाश संश्लेषण**)
          else if (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length > 4) {
            const headerTitle = trimmed.slice(2, -2).trim();
            return (
              <Text key={index} selectable={true} selectionColor="#007AFF" style={styles.boldHeader}>
                {headerTitle}
              </Text>
            );
          }
          // Bullet Point Line (• or - or *) with Hanging Indent Alignment
          else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
            const bulletText = trimmed.replace(/^[•\-\*\s]+/, '');
            return (
              <View key={index} style={styles.bulletRow}>
                <Text selectable={true} selectionColor="#007AFF" style={styles.bulletSymbol}>•</Text>
                <Text selectable={true} selectionColor="#007AFF" style={styles.bulletTextContent}>
                  {renderInlineFormatting(bulletText)}
                </Text>
              </View>
            );
          } else {
            return (
              <Text key={index} selectable={true} selectionColor="#007AFF" style={styles.regularText}>
                {renderInlineFormatting(trimmed)}
              </Text>
            );
          }
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}>

        {/* Top Header Bar */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => {
              stopTts();
              navigation?.goBack?.();
            }}>
            {/* <Feather name="menu" size={22} color="#333" /> */}
            <Feather name="arrow-left" size={22} color="#333" />
          </TouchableOpacity>

          <Pressable
            style={({ pressed }) => [
              styles.upgradePill,
              { backgroundColor: pressed ? '#ddd' : '#007AFF' },
            ]}
            onPress={() => {
              stopTts();
              navigation?.goBack?.();
            }}
          >
            <Image style={styles.logo} source={require("../assets/SW_Ai_.png")} />
            <Text style={styles.upgradeText}>Swa-AI</Text>
          </Pressable>

          <View style={styles.headerRightActions}>
            <TouchableOpacity
              style={[styles.headerIconBtn, { marginRight: 8 }]}
              onPress={() => setShowHistoryModal(true)}>
              <Ionicons name="time-outline" size={22} color="#333" />
              {chatHistory.length > 0 && (
                <View style={styles.historyBadge}>
                  <Text style={styles.historyBadgeText}>{chatHistory.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.headerIconBtn} onPress={startNewChat}>
              <Ionicons name="create-outline" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/*ChatGPT-Style Floating Audio Player Bar (Read Aloud) */}
        {activeTtsMsgId && (
          <View style={styles.chatGptAudioPlayerBar}>
            {/* Play/Pause Button */}
            <TouchableOpacity style={styles.audioPlayPauseBtn} onPress={toggleTtsPlayPause}>
              <Ionicons name={isTtsPlaying ? "pause" : "play"} size={16} color="#1C1C1E" />
            </TouchableOpacity>

            {/* Timer Counter */}
            <Text style={styles.audioTimerText}>{formatTtsTime(ttsSeconds)}</Text>

            {/* 15s Backward Button */}
            <TouchableOpacity style={styles.audioSeekBtn} onPress={seekBackward15}>
              <MaterialCommunityIcons name="rewind-15" size={20} color="#333" />
            </TouchableOpacity>

            {/* 15s Forward Button */}
            <TouchableOpacity style={styles.audioSeekBtn} onPress={seekForward15}>
              <MaterialCommunityIcons name="fast-forward-15" size={20} color="#333" />
            </TouchableOpacity>

            {/* Speed Toggle (1x -> 1.25x -> 1.5x -> 2x) */}
            <TouchableOpacity style={styles.audioSpeedBtn} onPress={cycleTtsSpeed}>
              <Text style={styles.audioSpeedText}>{ttsSpeed}x</Text>
            </TouchableOpacity>

            {/* Close / Stop Button */}
            <TouchableOpacity style={styles.audioCloseBtn} onPress={stopTts}>
              <Ionicons name="close" size={18} color="#555" />
            </TouchableOpacity>
          </View>
        )}

        {/* Voice Listening Banner */}
        {isListening && (
          <View style={styles.listeningBanner}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="mic" size={24} color="#fff" />
            </Animated.View>
            <Text style={styles.listeningText}>Listening... (Speak up, your question is being recorded)</Text>
            <TouchableOpacity onPress={() => setIsListening(false)}>
              <Ionicons name="close-circle-outline" size={22} color="#888" />
            </TouchableOpacity>
          </View>
        )}

        {/* Chat Body */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>

          {messages.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/AiLogo_1.png')} style={styles.logoAI} />
                {/* <MaterialCommunityIcons name="robot" size={40} color="#007AFF" /> */}
              </View>
              <Text style={styles.welcomeTitle}>Swa-AI Assistant</Text>
              <Text style={styles.welcomeSub}>Feel free to ask a question or upload a photo.</Text>

              <View style={styles.suggestionList}>
                <TouchableOpacity
                  style={styles.suggestionCard}
                  onPress={() => handleSend('Explain the process of photosynthesis in Hindi.')}>
                  <Ionicons name="bulb-outline" size={20} color="#555" style={styles.sugIcon} />
                  <Text style={styles.sugText}>Photosynthesis in Hindi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.suggestionCard}
                  onPress={() => handleSend('Make a Lesson Plan for Class 5 Maths')}>
                  <Ionicons name="create-outline" size={20} color="#555" style={styles.sugIcon} />
                  <Text style={styles.sugText}>Write a Lesson Plan for Math</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.suggestionCard}
                  onPress={() => handleImagePick('gallery')}>
                  <Ionicons name="image-outline" size={20} color="#555" style={styles.sugIcon} />
                  <Text style={styles.sugText}>Analyze an Image / Worksheet</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            messages.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.msgRow,
                  item.role === 'user' ? styles.userRow : styles.assistantRow,
                ]}>
                {item.role === 'assistant' && (
                  <View style={styles.aiAvatar}>
                    <Image source={require('../assets/SW_Ai_.png')} style={styles.aiAvatarImage} />
                    {/* <MaterialCommunityIcons name="sparkles" size={16} color="#fff" /> */}
                  </View>
                )}

                <View
                  style={[
                    styles.msgBubble,
                    item.role === 'user' ? styles.userBubble : styles.assistantBubble,
                  ]}>
                  {/* Image Attachment from User (Tappable for Fullscreen & Share) */}
                  {item.imageUri && (
                    <TouchableOpacity
                      activeOpacity={0.85}
                      onPress={() => setFullscreenImage({ uri: item.imageUri, title: 'Uploaded Image' })}>
                      <Image source={{ uri: item.imageUri }} style={styles.bubbleImage} />
                      {/* <View style={styles.imageTapBadge}>
                        <Ionicons name="expand-outline" size={12} color="#FFFFFF" />
                        <Text style={styles.imageTapBadgeText}>Tap to preview</Text>
                      </View> */}
                    </TouchableOpacity>
                  )}

                  {/* Educational Diagram or AI Generated Image Card (Tappable for Fullscreen & Share) */}
                  {item.role === 'assistant' && item.diagram && (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => setFullscreenImage({ uri: item.diagram.url, title: item.diagram.title })}>
                      <View style={styles.diagramContainer}>
                        <View style={styles.diagramHeaderRow}>
                          <Text style={styles.diagramTitle}>{item.diagram.title}</Text>
                          <View style={styles.expandIconBadge}>
                            <Ionicons name="expand-outline" size={14} color="#007AFF" />
                          </View>
                        </View>
                        <Image source={{ uri: item.diagram.url }} style={styles.diagramImage} />
                        {/* <Text style={styles.diagramTapHint}>Tap to view fullscreen & share</Text> */}
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Rendered Text Body */}
                  {item.text ? (
                    item.role === 'user' ? (
                      <Text selectable style={[styles.msgText, styles.userText]}>{item.text}</Text>
                    ) : (
                      <View style={{ width: '100%' }}>{renderFormattedText(item.text)}</View>
                    )
                  ) : null}

                  {/* Actions Row */}
                  {item.role === 'assistant' && (
                    <View style={styles.actionRow}>
                      <TouchableOpacity
                        style={[styles.actionBtn, activeTtsMsgId === item.id && styles.actionBtnActive]}
                        onPress={() => handleReadAloud(item)}>
                        <Ionicons
                          name={activeTtsMsgId === item.id && isTtsPlaying ? "volume-high" : "volume-medium-outline"}
                          size={15}
                          color={activeTtsMsgId === item.id ? "#007AFF" : "#666"}
                        />
                        <Text style={[styles.actionBtnText, activeTtsMsgId === item.id && { color: "#007AFF", fontWeight: "bold" }]}>
                          {activeTtsMsgId === item.id && isTtsPlaying ? "Reading..." : "Read"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, { marginLeft: 14 }]}
                        onPress={() => copyToClipboard(item.text)}>
                        {msgModalVisible.status ?
                          <AntDesign name="check" size={18} color="#34C759" /> :
                          <Ionicons name="copy-outline" size={14} color="#666" />
                        }
                        <Text style={styles.actionBtnText}>Copy</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionBtn, { marginLeft: 14 }]}
                        onPress={() => shareMessage(item.text)}>
                        <Ionicons name="share-outline" size={14} color="#666" />
                        <Text style={styles.actionBtnText}>Share</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}

          {loading && (
            <View style={[styles.msgRow, styles.assistantRow]}>
              <View style={styles.aiAvatar}>
                <Ionicons name="sparkles-sharp" size={16} color="#fff" />
              </View>
              <View style={[styles.msgBubble, styles.assistantBubble, styles.loadingBubble]}>
                <ActivityIndicator color="#007AFF" size="small" />
                <Text style={styles.loadingText}>Swa-AI is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Attached Image Thumbnail */}
        {selectedImage && (
          <View style={styles.attachedImageBadge}>
            <Image source={{ uri: selectedImage.uri }} style={styles.attachedThumb} />
            <Text style={styles.attachedText} numberOfLines={1}>
              Image Attached
            </Text>
            <TouchableOpacity onPress={() => setSelectedImage(null)}>
              <Ionicons name="close-circle-outline" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* ChatGPT Style Bottom Input Bar / Inline Voice Bar */}
        <View style={styles.inputContainer}>
          {isVoiceRecording ? (
            <View>
              {/* Live Spoken Transcript Preview Pill */}
              {voiceTranscript.trim() ? (
                <View style={styles.liveVoicePreviewBubble}>
                  <Ionicons name="chatbubble-ellipses-outline" size={13} color="#007AFF" style={{ marginRight: 6 }} />
                  <Text style={styles.liveVoicePreviewText} numberOfLines={2}>
                    {voiceTranscript}
                  </Text>
                </View>
              ) : (
                <View style={styles.liveVoiceHintBubble}>
                  <Text style={styles.liveVoiceHintText}>
                    Listening... ({voiceLang === 'hi-IN' ? 'हिन्दी में बोलें' : 'Speak in English'})
                  </Text>
                </View>
              )}

              {/* ChatGPT Waveform Recording Capsule */}
              <View style={styles.chatGptInlineVoiceBar}>
                {/* Cancel [✕] Button */}
                <TouchableOpacity style={styles.voiceInlineCancelBtn} onPress={cancelVoiceRecording}>
                  <Ionicons name="close" size={18} color="#555" />
                </TouchableOpacity>

                {/* Quick Language Toggle Pill (HI / EN) */}
                <TouchableOpacity
                  style={styles.inlineLangPill}
                  onPress={() => handleChangeVoiceLang(voiceLang === 'hi-IN' ? 'en-IN' : 'hi-IN')}>
                  <Text style={styles.inlineLangPillText}>
                    {voiceLang === 'hi-IN' ? '🇮🇳 HI' : '🌐 EN'}
                  </Text>
                </TouchableOpacity>

                {/* Animated Waveform Bars */}
                <View style={styles.inlineWaveformRow}>
                  {waveBars.map((bar, idx) => (
                    <Animated.View
                      key={idx}
                      style={[
                        styles.inlineWaveBar,
                        {
                          height: bar,
                          backgroundColor: idx % 3 === 0 ? '#1C1C1E' : '#555555',
                        },
                      ]}
                    />
                  ))}
                </View>

                {/* Stop [■] Button */}
                <TouchableOpacity style={styles.voiceInlineStopBtn} onPress={stopVoiceRecording}>
                  <View style={styles.stopSquare} />
                </TouchableOpacity>

                {/* Send [↑] Button */}
                <TouchableOpacity
                  style={[
                    styles.voiceInlineSendBtn,
                    !voiceTranscript.trim() && styles.voiceInlineSendBtnDisabled,
                  ]}
                  disabled={!voiceTranscript.trim()}
                  onPress={submitVoiceRecording}>
                  <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.capsuleBar}>
              <TouchableOpacity
                style={styles.plusBtn}
                onPress={() => setShowPlusMenu(!showPlusMenu)}>
                <Ionicons name="add" size={24} color="#333" />
              </TouchableOpacity>

              <TextInput
                style={styles.textInput}
                placeholder="Ask Swa-AI..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                multiline
              />

              {inputText.trim() || selectedImage ? (
                <TouchableOpacity style={styles.sendBtnActive} onPress={() => handleSend()}>
                  <Ionicons name="arrow-up" size={18} color="#fff" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.micBtn} onPress={startVoiceRecording}>
                  <Ionicons name="mic-outline" size={20} color="#333" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* ChatGPT Floating Attachment Popup Modal */}
        <Modal
          visible={showPlusMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowPlusMenu(false)}>
          <TouchableWithoutFeedback onPress={() => setShowPlusMenu(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.floatingMenu}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleImagePick('camera')}>
                  <View style={styles.menuIconBg}>
                    <Ionicons name="camera-outline" size={20} color="#333" />
                  </View>
                  <Text style={styles.menuText}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleImagePick('gallery')}>
                  <View style={styles.menuIconBg}>
                    <Ionicons name="images-outline" size={20} color="#333" />
                  </View>
                  <Text style={styles.menuText}>Photos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowPlusMenu(false);
                    setInputText('Draw an educational image of ');
                  }}>
                  <View style={[styles.menuIconBg, { backgroundColor: '#EDF5FF' }]}>
                    <Ionicons name="color-palette-outline" size={20} color="#007AFF" />
                  </View>
                  <Text style={styles.menuText}>Generate Image</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => setShowPlusMenu(false)}>
                  <View style={styles.menuIconBg}>
                    <Ionicons name="attach-outline" size={20} color="#333" />
                  </View>
                  <Text style={styles.menuText}>Files</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    setShowPlusMenu(false);
                    handleSend('Explain this in detail and deeply');
                  }}>
                  <View style={styles.menuIconBg}>
                    <MaterialCommunityIcons name="brain" size={20} color="#333" />
                  </View>
                  <Text style={styles.menuText}>Think harder</Text>
                </TouchableOpacity> */}

              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

      </KeyboardAvoidingView>

      {/* Fullscreen Image Preview & Zoom Modal */}
      <Modal
        visible={!!fullscreenImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setIsImageZoomed(false);
          setFullscreenImage(null);
        }}>
        <SafeAreaView style={styles.whatsAppModalOverlay}>
          {/* Header with Back, Title & Share */}
          <View style={styles.whatsAppHeader}>
            <TouchableOpacity
              style={styles.whatsAppHeaderBtn}
              onPress={() => {
                setIsImageZoomed(false);
                setFullscreenImage(null);
              }}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.whatsAppHeaderCenter}>
              <Text style={styles.whatsAppTitle} numberOfLines={1}>
                {fullscreenImage?.title || 'Photo'}
              </Text>
              {/* <Text style={styles.whatsAppSubtitle}>Double-tap or pinch to zoom</Text> */}
            </View>

            <TouchableOpacity
              style={styles.whatsAppHeaderBtn}
              onPress={() => shareFullscreenImage(fullscreenImage)}>
              <Ionicons name="share-outline" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Fullscreen Image Canvas with WhatsApp-like Pinch & Double-Tap Zoom */}
          <View style={styles.whatsAppBody}>
            {fullscreenImage?.uri ? (
              <ScrollView
                ref={imageScrollRef}
                style={styles.whatsAppScrollView}
                contentContainerStyle={styles.whatsAppScrollContent}
                minimumZoomScale={1}
                maximumZoomScale={4}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                centerContent={true}
                bouncesZoom={true}
                onScroll={(e) => {
                  const scale = e?.nativeEvent?.zoomScale;
                  if (scale && scale <= 1.05 && isImageZoomed) {
                    setIsImageZoomed(false);
                  } else if (scale && scale > 1.2 && !isImageZoomed) {
                    setIsImageZoomed(true);
                  }
                }}
                scrollEventThrottle={16}
              >
                <TouchableWithoutFeedback onPress={handleImageDoubleTap}>
                  <Image
                    source={{ uri: fullscreenImage.uri }}
                    style={styles.whatsAppImage}
                    resizeMode="contain"
                  />
                </TouchableWithoutFeedback>
              </ScrollView>
            ) : null}
          </View>

          {/* Bottom Bar with Zoom Hint and Share Button */}
          {/* <View style={styles.whatsAppBottomBar}>
            <View style={styles.whatsAppHintPill}>
              <Ionicons name="scan-outline" size={15} color="#A0A0A0" style={{ marginRight: 6 }} />
              <Text style={styles.whatsAppHintText}>
                {isImageZoomed ? 'Double-tap to zoom out' : 'Double-tap to zoom • Pinch 2-finger'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.whatsAppSharePill}
              onPress={() => shareFullscreenImage(fullscreenImage)}>
              <Ionicons name="share-social-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.whatsAppSharePillText}>Share</Text>
            </TouchableOpacity>
          </View> */}
        </SafeAreaView>
      </Modal>

      {/* Recent Chat History Modal (Last 5 Chats) */}
      <Modal
        visible={showHistoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHistoryModal(false)}>
        <SafeAreaView style={styles.historyModalOverlay}>
          <View style={styles.historyContainer}>
            {/* History Header */}
            <View style={styles.historyHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="time-outline" size={22} color="#007AFF" style={{ marginRight: 8 }} />
                <Text style={styles.historyTitle}>Recent Chats</Text>
              </View>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#888" />
              </TouchableOpacity>
            </View>

            <Text style={styles.historySubTitle}>
              Saved last 5 conversations
            </Text>

            {/* History List */}
            <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
              {chatHistory.length === 0 ? (
                <View style={styles.emptyHistoryBox}>
                  <Ionicons name="chatbubbles-outline" size={48} color="#CCC" />
                  <Text style={styles.emptyHistoryText}>No chat history yet</Text>
                  <Text style={styles.emptyHistorySub}>Ask any question to save conversations here.</Text>
                </View>
              ) : (
                chatHistory.map((item, idx) => (
                  <TouchableOpacity
                    key={item.id || idx}
                    style={[
                      styles.historyItemCard,
                      currentSessionId === item.id && styles.activeHistoryCard,
                    ]}
                    onPress={() => loadChatSession(item)}>
                    <View style={styles.historyItemIconBg}>
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={20}
                        color={currentSessionId === item.id ? '#007AFF' : '#666'}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyItemTitle} numberOfLines={1}>
                        {item.title || 'Conversation'}
                      </Text>
                      <View style={styles.historyMetaRow}>
                        <Text style={styles.historyItemTime}>{item.timestamp}</Text>
                        <Text style={styles.historyItemCount}>
                          • {item.messageCount || item.messages?.length || 0} messages
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteHistoryBtn}
                      onPress={(e) => deleteSession(item.id, e)}>
                      <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>

            {/* History Bottom Actions */}
            <View style={styles.historyBottomBar}>
              <TouchableOpacity style={styles.newChatBtn} onPress={startNewChat}>
                <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.newChatBtnText}>New Chat</Text>
              </TouchableOpacity>

              {chatHistory.length > 0 && (
                <TouchableOpacity style={styles.clearHistoryBtn} onPress={clearAllHistory}>
                  <Text style={styles.clearHistoryText}>Clear All</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      </Modal>


      <MsgModal msgModalVisible={msgModalVisible} />

    </SafeAreaView>
  );
};

export default SwaAiAssistant;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F0F8FF' },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#F0F8FF',
    borderBottomWidth: 1,
    borderBottomColor: '#C6DDFB',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCEEFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0099E6',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  upgradeText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  listeningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#9DCEEE',
  },
  pulseCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0099E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listeningText: { flex: 1, fontSize: 13, color: '#0066BB', fontWeight: '600' },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1 },
  emptyStateContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#D4EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#0099E6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  welcomeTitle: { fontSize: 22, fontWeight: 'bold', color: '#005FAD', marginBottom: 6 },
  welcomeSub: { fontSize: 13, color: '#4A7DAA', textAlign: 'center', paddingHorizontal: 30, marginBottom: 30 },
  suggestionList: { width: '100%' },
  suggestionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#B8DCFA',
    shadowColor: '#E8A0C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  sugIcon: { marginRight: 12 },
  sugText: { fontSize: 14, color: '#0A1A2E', fontWeight: '500' },
  msgRow: { marginVertical: 8, flexDirection: 'row', alignItems: 'flex-start' },
  userRow: { justifyContent: 'flex-end' },
  assistantRow: { justifyContent: 'flex-start' },
  aiAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#B8DCFA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
    shadowColor: '#0099E6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  msgBubble: { maxWidth: '85%', borderRadius: 20, padding: 14 },
  userBubble: {
    backgroundColor: '#DCF0FF',
    borderBottomRightRadius: 5,
    borderWidth: 1,
    borderColor: '#9DCEEE',
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#B8DCFA',
    borderBottomLeftRadius: 5,
    shadowColor: '#D08090',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
  },
  bubbleImage: { width: 220, height: 160, borderRadius: 14, marginBottom: 8, resizeMode: 'cover' },
  diagramContainer: {
    backgroundColor: '#F0F7FF',
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#9DCEEE',
  },
  diagramTitle: { fontSize: 13, fontWeight: 'bold', color: '#0066BB', marginBottom: 6 },
  diagramImage: { width: '100%', height: 180, borderRadius: 8, resizeMode: 'contain' },
  boldHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0A1A2E',
    marginTop: 10,
    marginBottom: 4,
    lineHeight: 24,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 3,
    paddingLeft: 2,
  },
  bulletSymbol: {
    width: 18,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0099E6',
    lineHeight: 24,
    textAlign: 'left',
  },
  bulletTextContent: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: '#0D1E30',
  },
  regularText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#0D1E30',
    marginVertical: 2,
  },
  chatGptTextInput: {
    padding: 0,
    paddingTop: 0,
    paddingBottom: 0,
    paddingVertical: 0,
    margin: 0,
    marginTop: 0,
    marginBottom: 0,
    fontSize: 15,
    lineHeight: 22,
    color: '#0D1E30',
    backgroundColor: 'transparent',
  },
  msgText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#0A1A2E' },
  actionRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8, alignSelf: 'flex-end' },
  actionBtn: { flexDirection: 'row', alignItems: 'center' },
  actionBtnText: { fontSize: 12, color: '#0066BB', marginLeft: 4, fontWeight: '500' },
  loadingBubble: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  loadingText: { fontSize: 13, color: '#0066BB', marginLeft: 10 },
  attachedImageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FF',
    marginHorizontal: 16,
    padding: 6,
    borderRadius: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#9DCEEE',
  },
  attachedThumb: { width: 36, height: 36, borderRadius: 8 },
  attachedText: { flex: 1, fontSize: 12, color: '#1A3A5A', marginLeft: 10, fontWeight: '500' },
  inputContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    borderTopColor: '#B8DCFA',
  },
  capsuleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SWATheam.SwaWhite,
    borderRadius: 28,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#A8D4F5',
    shadowColor: '#E8A0C0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  plusBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C8E8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  textInput: {
    flex: 1, fontSize: 15, color: '#0A1A2E', maxHeight: 100, paddingHorizontal: 8, paddingVertical: 6
  },
  micBtn: { padding: 8 },
  sendBtnActive: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0099E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    shadowColor: '#0099E6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.40,
    shadowRadius: 6,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 60, 120, 0.30)', justifyContent: 'flex-end' },
  floatingMenu: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 80,
    padding: 10,
    elevation: 8,
    shadowColor: '#0066BB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: '#C0DCFA',
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12 },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: { fontSize: 15, fontWeight: '500', color: '#0A1A2E' },
  logo: {
    width: 24,
    height: 21,
    resizeMode: 'contain',
    marginRight: 8,
  },
  aiAvatarImage: {
    width: 14,
    borderRadius: 12,
    resizeMode: 'contain',
  },
  logoAI: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  imageTapBadge: {
    position: 'absolute',
    bottom: 14,
    right: 8,
    backgroundColor: 'rgba(0, 30, 80, 0.70)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageTapBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginLeft: 4,
    fontWeight: '500',
  },
  diagramHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  expandIconBadge: {
    backgroundColor: '#DCF0FF',
    padding: 4,
    borderRadius: 6,
  },
  diagramTapHint: {
    fontSize: 11,
    color: '#0066BB',
    textAlign: 'center',
    marginTop: 6,
    fontWeight: '500',
  },
  fullModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.96)',
    justifyContent: 'space-between',
  },
  fullModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 10,
  },
  fullModalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullModalTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
    textAlign: 'center',
  },
  fullModalShareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullModalBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  fullModalBottom: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    alignItems: 'center',
  },
  fullModalShareAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0099E6',
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 25,
    shadowColor: '#0099E6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.40,
    shadowRadius: 8,
    elevation: 5,
  },
  fullModalShareText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#0099E6',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  historyBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  zoomScrollView: {
    width: '100%',
    height: '100%',
  },
  zoomScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinchZoomHintBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 8,
  },
  pinchZoomHintText: {
    color: '#FFFFFF',
    fontSize: 11,
    marginLeft: 6,
    fontWeight: '500',
  },
  historyModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 60, 120, 0.35)',
    justifyContent: 'flex-end',
  },
  historyContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    maxHeight: '55%',
    minHeight: '45%',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#B8DCFA',
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  historyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0A1A2E',
  },
  historySubTitle: {
    fontSize: 12,
    color: '#4A7DAA',
    marginBottom: 12,
  },
  historyList: {
    flexGrow: 0,
    marginBottom: 12,
  },
  emptyHistoryBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
  },
  emptyHistoryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D5F8A',
    marginTop: 10,
  },
  emptyHistorySub: {
    fontSize: 12,
    color: '#6A9FC0',
    marginTop: 4,
    textAlign: 'center',
  },
  historyItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F9FF',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#B8DCFA',
  },
  activeHistoryCard: {
    backgroundColor: '#DCF0FF',
    borderColor: '#0099E6',
  },
  historyItemIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D4EEFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  historyItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0A1A2E',
    marginBottom: 3,
  },
  historyMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyItemTime: {
    fontSize: 11,
    color: '#5A90B8',
  },
  historyItemCount: {
    fontSize: 11,
    color: '#0066BB',
    marginLeft: 4,
    fontWeight: '500',
  },
  deleteHistoryBtn: {
    padding: 8,
    marginLeft: 6,
  },
  historyBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#B8DCFA',
  },
  newChatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0099E6',
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 10,
    shadowColor: '#0099E6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  newChatBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  clearHistoryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#E8F4FF',
    borderWidth: 1,
    borderColor: '#9DCEEE',
  },
  clearHistoryText: {
    color: '#0066BB',
    fontSize: 13,
    fontWeight: '600',
  },
  //Zoom & Fullscreen Viewer Styles
  whatsAppModalOverlay: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  whatsAppHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  whatsAppHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsAppHeaderCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  whatsAppTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  whatsAppSubtitle: {
    color: '#A0A0A0',
    fontSize: 11,
    marginTop: 2,
  },
  whatsAppBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsAppScrollView: {
    width: '100%',
    height: '100%',
  },
  whatsAppScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  whatsAppImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.78,
  },
  whatsAppBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  whatsAppHintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  whatsAppHintText: {
    color: '#CCCCCC',
    fontSize: 12,
    fontWeight: '500',
  },
  whatsAppSharePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0099E6',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  whatsAppSharePillText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },

  //Inline Voice-to-Text Styles
  liveVoicePreviewBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#9DCEEE',
    shadowColor: '#0099E6',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  liveVoicePreviewText: {
    flex: 1,
    fontSize: 13,
    color: '#0066BB',
    fontWeight: '600',
    lineHeight: 18,
  },
  liveVoiceHintBubble: {
    backgroundColor: '#F2F9FF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 6,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#B8DCFA',
  },
  liveVoiceHintText: {
    fontSize: 12,
    color: '#4A7DAA',
    fontWeight: '500',
  },
  chatGptInlineVoiceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FDF0F5',
    borderRadius: 28,
    paddingHorizontal: 6,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#A8D4F5',
  },
  voiceInlineCancelBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C8E8FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineLangPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    marginLeft: 6,
    marginRight: 4,
    borderWidth: 1,
    borderColor: '#A8D4F5',
  },
  inlineLangPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0A1A2E',
  },
  inlineWaveformRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    paddingHorizontal: 4,
  },
  inlineWaveBar: {
    width: 2.5,
    borderRadius: 1.5,
    marginHorizontal: 1.2,
  },
  voiceInlineStopBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#C8E8FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  stopSquare: {
    width: 12,
    height: 12,
    backgroundColor: '#0066BB',
    borderRadius: 2,
  },
  voiceInlineSendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0099E6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0099E6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },
  voiceInlineSendBtnDisabled: {
    backgroundColor: '#90C8EE',
    opacity: 0.6,
  },

  //Floating Audio Player Styles (Read Aloud)
  chatGptAudioPlayerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#B8DCFA',
    shadowColor: '#0066BB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  audioPlayPauseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DCF0FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTimerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0A1A2E',
    fontVariant: ['tabular-nums'],
    marginHorizontal: 8,
  },
  audioSpeedBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#DCF0FF',
  },
  audioSpeedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0066BB',
  },
  audioSeekBtn: {
    padding: 6,
  },
  audioCloseBtn: {
    padding: 6,
  },
  actionBtnActive: {
    backgroundColor: '#EDF5FF',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});