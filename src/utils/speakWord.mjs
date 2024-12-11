const speakWord = (word, lang = "ja-JP") => {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = lang;
  window.speechSynthesis.speak(utterance);
};

export default speakWord;
