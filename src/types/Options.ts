import type { Plugin } from "obsidian";

export type InputOptions = { input: string };

export type PluginOptions = { plugin: Plugin };

export type HeadingOptions = InputOptions & { heading: string };
