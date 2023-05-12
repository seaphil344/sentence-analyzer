import { useState } from 'react';

export default function SentenceWordAnalyzer() {
  const [sentence, setSentence] = useState('');
  const [words, setWords] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInput, setShowInput] = useState(true);

  const handleChange = (e) => {
    setSentence(e.target.value);
  };

  const handleSubmit = async () => {
    const isEmptyString = (str) => str.trim() === '';
    if (isEmptyString(sentence)) {
      console.log("You cannot send empty prompts");
      return;
    }
    setIsSubmitting(true);
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

      const { response: newGeneratedResponses } = await response.json();
      setWords(newGeneratedResponses);
      setShowInput(false);
      console.log(newGeneratedResponses);
    } catch (error) {
      console.error('Error processing prompts:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewSentence = () => {
    setSentence('');
    setWords({});
    setShowInput(true);
  };

  return (
    <div>
      {showInput && (
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <textarea
            className="text-black bg-white border rounded p-2 w-full"
            placeholder="Enter a sentence"
            value={sentence}
            onChange={handleChange}
          ></textarea>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}
      {!showInput && Object.keys(words).length > 0 && (
        <div className="mt-4">
          <p>Sentence: {sentence}</p>
          <p>Generated Response: {words}</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleNewSentence}
          >
            Submit New Sentence
          </button>
        </div>
      )}
    </div>
  );
}
