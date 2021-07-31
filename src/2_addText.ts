import { Plugin, TFile } from "obsidian";

export const appendToDailyNote = async (plugin: Plugin, toBeAppended: string) => {
	const dailyNote = getDailyNoteFile(plugin);
	const oldContent = await getDailyNoteContent(plugin, dailyNote);
	const newContent = oldContent.trim() + "\n" + toBeAppended;
	await writeToDailyNote(plugin, dailyNote, newContent);
};

export const writeToDailyNote = async (plugin: Plugin, dailyNote: TFile, content: string) =>
	plugin.app.vault.modify(dailyNote, content);

export const getDailyNoteContent = async (plugin: Plugin, dailyNote: TFile) => plugin.app.vault.read(dailyNote);

export const getDailyNoteFile = (plugin: Plugin) => {
	const dailyNotesDirectory = getDailyNotesDirectory(plugin);
	return sortDailyNotes(getDailyNotesFromDir(plugin, dailyNotesDirectory))[0];
};

export const getDailyNotesDirectory = (plugin: Plugin) => {
	//@ts-ignore
	return plugin.app.internalPlugins.plugins["daily-notes"].instance.options.folder;
};

export const getDailyNotesFromDir = (plugin: Plugin, dailyNotesDirectory: string) =>
	plugin.app.vault.getMarkdownFiles().filter((file) => file.path.startsWith(dailyNotesDirectory));

// TODO: this only works for 2021-07-30 format
export const sortDailyNotes = (dailyNotes: TFile[]) =>
	dailyNotes.sort((a, b) => new Date(b.basename).getTime() - new Date(a.basename).getTime());
