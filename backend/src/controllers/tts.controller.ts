import { Request, Response } from 'express';
import https from 'https';

export class TTSController {
  static async streamAudio(req: Request, res: Response): Promise<void> {
    const text = (req.query.text as string || '').trim();
    const lang = (req.query.lang as string || 'ja').trim();

    if (!text) {
      res.status(400).json({ error: 'Text query parameter is required' });
      return;
    }

    try {
      const targetLang = lang.toLowerCase().startsWith('th') ? 'th' : 'ja';
      const encodedText = encodeURIComponent(text);
      const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${targetLang}&client=tw-ob&q=${encodedText}`;

      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/',
        },
      };

      https.get(googleTtsUrl, options, (googleRes) => {
        if (googleRes.statusCode !== 200) {
          res.status(googleRes.statusCode || 500).json({ error: 'Failed to fetch TTS audio stream' });
          return;
        }

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        googleRes.pipe(res);
      }).on('error', (err) => {
        console.error('TTS streaming error:', err);
        res.status(500).json({ error: 'Internal TTS streaming error' });
      });
    } catch (error) {
      console.error('Error handling TTS request:', error);
      res.status(500).json({ error: 'Failed to process TTS request' });
    }
  }
}
