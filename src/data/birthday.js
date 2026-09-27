/* ──────────────────────────────────────────────────────────────────────
   EVERYTHING YOU NEED TO EDIT LIVES IN THIS FILE.

   • message       → your birthday letter
   • finalMessage  → the text on the very last screen
   • memories      → photos + captions
   • easterEgg     → the hidden line (tap the full moon at the end 3 times)
   • text          → small labels/buttons, if you want to reword any

   Writing tips:
   • Leave an empty line between paragraphs → they become separate paragraphs.
   • A single line break stays a line break.
   • Backticks (`) wrap the long texts, so you can type freely across lines,
     including apostrophes and quotes. Just don't type a backtick yourself.
   ────────────────────────────────────────────────────────────────────── */

export const birthdayData = {
  name: "Moonaou",

  // How you sign the letter.
  from: "Alisha",

  message: `
Happy birthday chandu 
`,

  finalMessage: `
FINAL_MESSAGE_HERE
`,

  /* PHOTOS
     1. Put your image files in:  public/photos/
     2. Point `image` at them:    "photos/<file name>"
     Add or remove entries freely; the layout adapts to any number.
     A missing photo shows a soft placeholder instead of breaking.
     `alt` is optional (it describes the photo for screen readers). */
  memories: [
    { image: "photos/1.jpg", caption: "CAPTION_1", alt: "PHOTO_1" },
    { image: "photos/2.jpg", caption: "CAPTION_2", alt: "PHOTO_2" },
    { image: "photos/3.jpg", caption: "CAPTION_3", alt: "PHOTO_3" },
    { image: "photos/4.jpg", caption: "CAPTION_4", alt: "PHOTO_4" },
    { image: "photos/5.jpg", caption: "CAPTION_5", alt: "PHOTO_5" },
    { image: "photos/6.jpg", caption: "CAPTION_6", alt: "PHOTO_6" },
    { image: "photos/7.jpg", caption: "CAPTION_6", alt: "PHOTO_6" },
    { image: "photos/8.jpg", caption: "CAPTION_6", alt: "PHOTO_6" },
    { image: "photos/9.jpg", caption: "CAPTION_6", alt: "PHOTO_6" },

  ],

  // Revealed when she taps the full moon on the last screen 3 times.
  easterEgg: "Love you mwah",

  candles: 5,

  // Small interface text. Optional to change.
  text: {
    opening: "i didnt forget hihi",
    openingButton: "click here now",

    revealLine: "Happy Birthday,",
    revealNext: "there's more",

    letterNext: "next",

    memoriesTitle: "a few moments",
    memoriesHint: "tap one to look closer",
    memoriesNext: "next",

    cakeTitle: "make a wish",
    cakeHint: "tap the candles, or swipe across them",
    cakeMic: "or actually blow (uses mic)",
    cakeDone: "wish sent.",
    cakeRelight: "light them again",
    cakeNext: "next",

    flowersEyebrow: "since i can't hand them to you",
    flowersTitle: "some flowers",
    flowersHint: "tap the buds",
    flowersDone: "all yours.",
    flowersNext: "one more thing",

    finalRestart: "start over",
  },
};
