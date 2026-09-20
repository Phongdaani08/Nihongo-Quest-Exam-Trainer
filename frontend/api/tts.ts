import * as googleTTS from 'google-tts-api';

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const text = (req.query?.text as string) || '';
    const lang = ((req.query?.lang as string) || 'ja').toLowerCase();

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text query parameter is required' });
    }

    const targetLang = lang === 'th' ? 'th' : 'ja';

    // Fetch MP3 Base64 from Google TTS via Server
    const base64Audio = await googleTTS.getAudioBase64(text.trim(), {
      lang: targetLang,
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000,
    });

    const audioBuffer = Buffer.from(base64Audio, 'base64');

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.status(200).send(audioBuffer);
  } catch (error: any) {
    console.error('TTS Serverless Function Error:', error);
    return res.status(500).json({
      error: 'Failed to synthesize speech',
      details: error?.message || String(error),
    });
  }
}
