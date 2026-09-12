Placeholder files — swap these for real short SFX (quest-complete, level-up, purchase).
Anything under ~1s works well; the app calls them via src/utils/sound.js and fails silently
if a file is missing or empty, so the app runs fine before you add real audio.
