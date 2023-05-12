import { useState, useEffect } from 'react';

export default function WordGuesser() {
  const [sentence, setSentence] = useState('');
  const [words, setWords] = useState({});
  const [isFirstCallSuccessful, setIsFirstCallSuccessful] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState('');

  useEffect(() => {
    const generateSentence = async () => {
      try {
        const response = await fetch('/api/generate-sentence', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { response: newGeneratedResponses } = await response.json();
        setSentence(newGeneratedResponses);
        setIsFirstCallSuccessful(true);
      } catch (error) {
        console.error('Error generating sentence:', error);
      }
    };

    generateSentence();
  }, []);

  useEffect(() => {
    if (isFirstCallSuccessful) {
      const makeAnotherCall = async () => {
        try {
          const response = await fetch('/api/analyze-sentence', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: sentence }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          let data = await response.json();

          // Remove new line characters from the data object
          data = removeNewLines(data);

          setWords(data);
        } catch (error) {
          console.error('Error making another call:', error);
        }
      };

      makeAnotherCall();
    }
  }, [isFirstCallSuccessful]);

  const handleWordClick = (word) => {
    setHighlightedWord(word);
  };

  const removeNewLines = (obj) => {
    const newObj = {};

    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        newObj[key] = obj[key].replace(/[\r\n]+/g, '');
      } else if (typeof obj[key] === 'object') {
        newObj[key] = removeNewLines(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }

    return newObj;
  };

  const checkWords = () => {
    console.log(words)
  }

  return (
    <div>
      {sentence && (
        <p>
          {sentence.match(/\b\w+\b|\s+/g).map((word, index) => (
            <span
              key={index}
              onClick={() => handleWordClick(word.trim())}
              style={{ backgroundColor: word.trim() === highlightedWord ? 'yellow' : 'transparent' }}
            >
              {word}
            </span>
          ))}
        </p>
      )}
      <p>Word Types: {words.response}</p>
      <button onClick={checkWords}>Check</button>
    </div>
  );
}
