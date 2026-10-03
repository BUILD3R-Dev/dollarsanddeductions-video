// Audio-only renders (sync checks, mix review): same setup minus the video quality
// settings, which audio codecs reject.
//   npx remotion render Episode out/preview/<slug>.wav --codec=wav --config=remotion.audio.config.ts --props=videos/<slug>.json
import {Config} from '@remotion/cli/config';

Config.setOverwriteOutput(true);
