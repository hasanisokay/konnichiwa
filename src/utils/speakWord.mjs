const speakWord = (word, lang = "ja-JP") => {
  try {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.log(e);
  }
};

export default speakWord;
