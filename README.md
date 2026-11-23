# Little Letters 🦉

A playful Next.js app for a Grade 1 learner to practise **Hindi**, **Arabic** and **Malayalam** letters and simple words.

## Activities (per language)
- **Letters** – tap a letter to see it big, hear it, and see a picture word.
- **Words** – picture cards with easy words; tap to hear.
- **Play** – "Which letter does this start with?" (picture mode) or "Listen and find" (sound mode). Stars are saved on the device.
- **Write** – trace the letter with a finger or mouse.

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Sound
Uses the browser's built-in text-to-speech (no audio files). If a device has no voice for a language the app shows a
small note; add the voice in the device's text-to-speech settings (Android Chrome usually has Hindi, Arabic and Malayalam).

## Editing letters / words
All content lives in `src/data/languages.ts`.
