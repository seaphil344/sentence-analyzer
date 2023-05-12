// pages/api/analyze-sentence.js

export default async function handler(req, res) {
    if (req.method === 'POST') {
      try {
        const { prompt } = req.body;
        const response = await fetchChatGPTResponse(prompt);
        res.status(200).json({ response });
      } catch (error) {
        console.error('Error handling ChatGPT request:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed.' });
    }
  }
  
  // Prepare the request payload
  function createPayload(prompt) {
    return {
      messages: [
        {
          role: 'user',
          content: `Review the sentences that are in quotations 
          and return a JavaScript object that contains each word 
          and what type of word it is as a key-value pair. "${prompt}"`,
        },
      ],
      max_tokens: 100,
      n: 1,
      stop: null,
      temperature: 0.5,
      model: 'gpt-3.5-turbo',
    };
  }
  
  async function fetchChatGPTResponse(prompt) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPEN_AI_KEY}`,
        },
        body: JSON.stringify(createPayload(prompt)),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      const generatedText = data.choices[0].message.content;
      return generatedText;
    } catch (error) {
      console.error('Error fetching ChatGPT response:', error);
      throw error;
    }
  }
  