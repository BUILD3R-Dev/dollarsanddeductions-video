import {loadFont as loadNewsreader} from '@remotion/google-fonts/Newsreader';
import {loadFont as loadPublicSans} from '@remotion/google-fonts/PublicSans';

// Same faces as the website. loadFont() registers a delayRender until the font
// is ready, so frames never render with fallback type.
const newsreader = loadNewsreader('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']});
loadNewsreader('italic', {weights: ['400', '500'], subsets: ['latin']});
const publicSans = loadPublicSans('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']});

export const fonts = {
  /** Newsreader: headlines, figures, wordmark. */
  serif: newsreader.fontFamily,
  /** Public Sans: body, labels, UI. */
  sans: publicSans.fontFamily,
};
