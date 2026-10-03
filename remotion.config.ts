import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
// Lower CRF than default: dark gradients + fine gold hairlines band badly otherwise.
Config.setCrf(16);
Config.setOverwriteOutput(true);
