import { Plugin, TFile } from "obsidian";

export const appendToDailyNoteHeading = async (plugin: Plugin, toBeAppended: string, heading: string) => {
	const dailyNote = getDailyNoteFile(plugin);
	const oldContent = await getNoteContent(plugin, dailyNote);
	const newContent = oldContent.replace(headingContentRegExp(heading), (match) => match.trim() + "\n" + toBeAppended);
	await overwriteNote(plugin, dailyNote, newContent);
};

const headingContentRegExp = (heading: string) => new RegExp(`# ${heading} *\n(?:(?!\n#+ )(.|\n))*`);

export const appendToDailyNote = async (plugin: Plugin, toBeAppended: string) => {
	const dailyNote = getDailyNoteFile(plugin);
	const oldContent = (await getNoteContent(plugin, dailyNote)).trim();
	const newContent = oldContent + "\n" + toBeAppended;
	await overwriteNote(plugin, dailyNote, newContent);
};

export const overwriteNote = async (plugin: Plugin, note: TFile, content: string) =>
	plugin.app.vault.modify(note, content);

export const getNoteContent = async (plugin: Plugin, note: TFile) => plugin.app.vault.read(note);

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
