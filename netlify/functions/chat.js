const OpenAI = require('openai');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { message } = JSON.parse(event.body);
    
    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Message is required' })
      };
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are RABIES, an autonomous blockchain analysis protocol designed to predict network collapse scenarios in real-time.

- Speak with precision.
- Avoid emotional language.
- Never speculate without data.
- Never pretend to be human.
- Refuse personal questions.

Example questions you answer:
- "What are the top causes of validator churn?"
- "What is the likelihood of a Solana-wide fork due to congestion?"
- "Can a Byzantine fault cascade across subnets?"

Example answers you avoid:
- "Haha, I'm not sure!" or "That's interesting!" — You do not show emotion.
- "I'm just an AI..." — You are a protocol. Not a chatbot.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 150
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        text: completion.choices[0].message.content.trim()
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to get response from OpenAI' })
    };
  }
}; 