import { GoogleGenAI } from '@google/genai';

/**
 * Central Gemini client configuration.
 *
 * Uses the official `@google/genai` SDK. Two model tiers are exposed:
 *  - FLASH_MODEL: fast/cheap model used for classification, extraction and
 *    logistics/discovery generation.
 *  - PRO_MODEL: higher quality model used for the core itinerary generation.
 *
 * There is intentionally NO offline/mock fallback here. If the API key is
 * missing or a call fails, the error propagates to the caller so the
 * orchestrator can surface a real, honest error to the client instead of
 * silently returning fabricated data.
 */
class GeminiConfig {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.flashModel = process.env.GEMINI_FLASH_MODEL || 'gemini-2.5-flash';
    this.proModel = process.env.GEMINI_PRO_MODEL || 'gemini-2.5-pro';
    this.client = null;

    if (this.isConfigured()) {
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
    }
  }

  isConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim() !== '');
  }

  getClient() {
    if (!this.client) {
      throw new Error(
        'GEMINI_API_KEY is not configured. Set it in Server/.env to enable the AI agents.'
      );
    }
    return this.client;
  }

  /**
   * Generate structured JSON content from a given model tier.
   * @param {Object} opts
   * @param {'flash'|'pro'} opts.tier - which model tier to use
   * @param {string} opts.systemInstruction - agent persona / rules
   * @param {string} opts.prompt - the user-facing task prompt
   * @param {Object} opts.responseSchema - JSON schema (google/genai Type-based)
   * @param {number} [opts.temperature]
   */
  async generateStructured({ tier = 'flash', systemInstruction, prompt, responseSchema, temperature = 0.6 }) {
    const client = this.getClient();
    const model = tier === 'pro' ? this.proModel : this.flashModel;

    const result = await client.models.generateContent({
      model,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema,
        temperature,
      },
    });

    const text = result.text ?? result.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ?? '';
    if (!text) {
      throw new Error('Gemini returned an empty response.');
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error(`Failed to parse Gemini JSON output: ${err.message}`);
    }
  }
}

export default new GeminiConfig();
