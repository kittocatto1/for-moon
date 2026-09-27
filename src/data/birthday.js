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
  name: "Moon",

  // How you sign the letter.
  from: "YOUR_NAME_HERE",

  message: `
YOUR_BIRTHDAY_MESSAGE_HERE
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
    { image: "photos/photo1.jpg", caption: "CAPTION_1", alt: "PHOTO_1" },
    { image: "photos/photo2.jpg", caption: "CAPTION_2", alt: "PHOTO_2" },
    { image: "photos/photo3.jpg", caption: "CAPTION_3", alt: "PHOTO_3" },
    { image: "photos/photo4.jpg", caption: "CAPTION_4", alt: "PHOTO_4" },
    { image: "photos/photo5.jpg", caption: "CAPTION_5", alt: "PHOTO_5" },
    { image: "photos/photo6.jpg", caption: "CAPTION_6", alt: "PHOTO_6" },
  ],

  // Revealed when she taps the full moon on the last screen 3 times.
  easterEgg: "EASTER_EGG_TEXT_HERE",

  candles: 5,

  // Small interface text. Optional to change.
  text: {
    opening: "i didnt forget hihi",
    openingButton: "okay click",

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
