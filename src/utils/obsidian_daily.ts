import type { TFile, Plugin } from "obsidian";
import type { GetFile } from "src/types/GetFile";
import type { PluginOptions } from "src/types/Options";

// TODO: this only works for 2021-07-30 format
const sortDailyNotes = (dailyNotes: TFile[]) =>
	dailyNotes.sort((a, b) => new Date(b.basename).getTime() - new Date(a.basename).getTime());

const getDailyNotesDirectory = (plugin: Plugin) => {
	//@ts-ignore
	return plugin.app.internalPlugins.plugins["daily-notes"].instance.options.folder;
};

const getDailyNotesFromDir = (plugin: Plugin, dailyNotesDirectory: string) =>
	plugin.app.vault.getMarkdownFiles().filter((file) => file.path.startsWith(dailyNotesDirectory));

export const getDailyNoteFile: GetFile<PluginOptions> = ({ plugin }) => {
	const dailyNotesDirectory = getDailyNotesDirectory(plugin);
	return sortDailyNotes(getDailyNotesFromDir(plugin, dailyNotesDirectory))[0];
};
