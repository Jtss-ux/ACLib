/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from '@remotion/tailwind-v4';

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(require('os').cpus().length || 4);
Config.setPixelFormat("yuv420p");
Config.setCodec("h264");
Config.setVideoBitrate("20M");

// GPU & Hardware Acceleration
Config.setHardwareAcceleration("if-possible");

Config.overrideWebpackConfig(enableTailwind);
