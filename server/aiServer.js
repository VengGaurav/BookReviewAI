import express from 'express';
import OpenAI from 'openai';

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());

app.post('/api/ai', async (req, res) => {
  try {
    const { mode, book, userInput, extra } = req.body || {};

    if (!mode || !book) {
      return res.status(400).json({ error: 'mode and book are required' });
    }

    const safeTitle = book.title || 'the book';
    const safeAuthor = book.author || 'the author';

    const systemBase =
      'You are an AI assistant for a personal reading app. ' +
      'Respond clearly in plain text, without markdown, and keep answers concise and helpful.';

    let systemInstruction = '';
    let userMessage = '';

    if (mode === 'review') {
      const tone = extra?.tone || 'balanced';
      systemInstruction =
        `${systemBase} Write a short, reader-friendly review for "${safeTitle}" by ${safeAuthor}. ` +
        `Tone should be ${tone}, practical, and suitable for a reading dashboard.`;
      userMessage =
        `Book info:\n` +
        `Title: ${safeTitle}\nAuthor: ${safeAuthor}\nGenre: ${(book.genre || []).join(', ')}\n` +
        `Summary: ${book.aiSummary || ''}\nKeywords: ${(book.keywords || []).join(', ')}`;
    } else if (mode === 'summary') {
      const summaryMode = extra?.summaryMode || '30second';
      systemInstruction =
        `${systemBase} Generate a summary of "${safeTitle}" by ${safeAuthor}. ` +
        `Style: ${summaryMode} (e.g. 30-second, chapter-wise, bullet, explain like I'm 10).`;
      userMessage =
        `Book info:\nTitle: ${safeTitle}\nAuthor: ${safeAuthor}\n` +
        `Existing AI summary (if any): ${book.aiSummary || 'none'}\n` +
        `User prefers mode: ${summaryMode}`;
    } else if (mode === 'chat') {
      const persona = extra?.persona || 'assistant';
      systemInstruction =
        `${systemBase} Answer as a helpful assistant talking about the book. ` +
        `Persona: ${persona} (e.g. author, character, critic). Avoid roleplay theatrics; focus on clarity.`;
      userMessage =
        `Book: "${safeTitle}" by ${safeAuthor}\n` +
        `Short description: ${book.aiSummary || book.description || ''}\n\n` +
        `User question: ${userInput || ''}`;
    } else {
      systemInstruction = systemBase;
      userMessage = userInput || '';
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.7,
    });

    const text = completion.choices?.[0]?.message?.content?.trim() ?? '';
    return res.json({ text });
  } catch (err) {
    console.error('AI endpoint error', err);
    return res.status(500).json({ error: 'AI request failed' });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`AI server listening on port ${PORT}`);
});

