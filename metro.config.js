const { getDefaultConfig } = require("expo/metro-config");

// Treat .sql files as assets so Metro doesn't attempt to parse them as JS source.
// This prevents Babel/Metro from throwing syntax errors when encountering raw SQL files.
const config = getDefaultConfig(__dirname);

// Ensure .sql is an asset extension and not a source extension
config.resolver = {
  ...config.resolver,
  assetExts: Array.from(new Set([...(config.resolver.assetExts || []), "sql"])),
  sourceExts: (config.resolver.sourceExts || []).filter((ext) => ext !== "sql"),
};

module.exports = config;
