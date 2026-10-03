import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
// Lower CRF than default: dark gradients and fine ledger rules band badly otherwise.
Config.setCrf(16);
Config.setOverwriteOutput(true);
// Machines that can't download Remotion's headless shell (remotion.media unreachable) can point at a
// local Chrome/Chromium instead: REMOTION_BROWSER_EXECUTABLE=/usr/bin/google-chrome-stable npm run final -- …
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
