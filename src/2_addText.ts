import { Plugin, TFile } from "obsidian";
import { InputOptions, PluginOptions } from "./types";

const prepend: Modify<InputOptions> = (original, { input }) => input + "\n" + original;

const append: Modify<InputOptions> = (original, { input }) => original + "\n" + input;

//TODO: this matches lines that start with # but the rest is empty, e.g.:
//#
//how to make it ignore these but still match empty lines before that?
//TODO: this does not match if the end of the file is the heading
//-> making the \n optional just makes it match wrong headings
const headingContentRegExp = (heading: string) => new RegExp(`# ${heading} *\n(?:(?!\n#+ )(.|\n))*`);
const headingRegExp = (heading: string) => new RegExp(`# ${heading} *\n`);

type HeadingOptions = InputOptions & { heading: string };

const prependToHeading: Modify<HeadingOptions> = (original: string, options: HeadingOptions) => {
	let wasModified = false;
	const result = original.replace(headingRegExp(options.heading), (match) => {
		wasModified = true;
		return match + options.input + "\n";
	});
	if (wasModified) return result;
	new Notification("Heading " + options.heading + " was not found.");
	return null;
};

const appendToHeading: Modify<HeadingOptions> = (original: string, options: HeadingOptions) => {
	let wasModified = false;
	const result = original.replace(headingContentRegExp(options.heading), (match) => {
		wasModified = true;
		return match + "\n" + options.input;
	});
	if (wasModified) return result;
	new Notification("Heading " + options.heading + " was not found.");
	return null;
};

const getNoteContent = async ({ plugin }: PluginOptions, note: TFile) => plugin.app.vault.read(note);

const overwriteNoteFile = async ({ plugin }: PluginOptions, note: TFile, content: string) =>
	plugin.app.vault.modify(note, content);

type Modify<ModifyOptions> = (original: string, modificationOptions: ModifyOptions & InputOptions) => string;

type GetFile<GetOptions> = (getOptions: GetOptions) => TFile;

export type AddText<ModifyOptions, GetOptions> = (
	options: PluginOptions & ModifyOptions & GetOptions & InputOptions
) => Promise<boolean>;

function makeAddText<ModifyOptions, GetOptions>(
	modify: Modify<ModifyOptions>,
	getFile: GetFile<GetOptions>
): AddText<ModifyOptions, GetOptions> {
	return async (options) => {
		const note = getFile(options);
		const oldContent = await getNoteContent(options, note);
		//TODO: better way to return "false" from modify if it was not modified
		const newContent = modify(oldContent, options);
		if (!newContent) return false;
		await overwriteNoteFile(options, note, modify(oldContent, options));
		return true;
	};
}

const getNoteFile: GetFile<PluginOptions & { noteBaseName: string }> = (options) => {
	return options.plugin.app.vault.getMarkdownFiles().find((file) => file.basename === options.noteBaseName);
};

// TODO: this only works for 2021-07-30 format
const sortDailyNotes = (dailyNotes: TFile[]) =>
	dailyNotes.sort((a, b) => new Date(b.basename).getTime() - new Date(a.basename).getTime());

const getDailyNotesDirectory = (plugin: Plugin) => {
	//@ts-ignore
	return plugin.app.internalPlugins.plugins["daily-notes"].instance.options.folder;
};

const getDailyNotesFromDir = (plugin: Plugin, dailyNotesDirectory: string) =>
	plugin.app.vault.getMarkdownFiles().filter((file) => file.path.startsWith(dailyNotesDirectory));

const getDailyNoteFile: GetFile<PluginOptions> = ({ plugin }) => {
	const dailyNotesDirectory = getDailyNotesDirectory(plugin);
	return sortDailyNotes(getDailyNotesFromDir(plugin, dailyNotesDirectory))[0];
};

export const appendToNote = makeAddText(append, getNoteFile);
export const prependToNote = makeAddText(prepend, getNoteFile);
export const appendToNoteHeading = makeAddText(appendToHeading, getNoteFile);
export const prependToNoteHeading = makeAddText(prependToHeading, getNoteFile);

export const appendToDailyNote = makeAddText(append, getDailyNoteFile);
export const prependToDailyNote = makeAddText(prepend, getDailyNoteFile);
export const appendToDailyNoteHeading = makeAddText(appendToHeading, getDailyNoteFile);
export const prependToDailyNoteHeading = makeAddText(prependToHeading, getDailyNoteFile);

export enum NoteOption {
	NAMED = "named note",
	DAILY = "daily note",
}

//TODO: what happens if the heading is not found? -> make it at the end? configurable? currently:
//TODO: make sure it does not remove/transform the source on error!

export enum ModifyOption {
	APPEND = "append",
	APPEND_TO_HEADING = "append to heading",
	PREPEND = "prepend",
	PREPEND_TO_HEADING = "prepend to heading",
}

//we need these as input to addOptions because using the enums leads to not being able to use === with the actual enums...
export const NoteOptionStringMap: { [x: string]: string } = {
	NAMED: "named note",
	DAILY: "daily note",
};

export const ModifyOptionStringMap: { [x: string]: string } = {
	APPEND: "append",
	APPEND_TO_HEADING: "append to heading",
	PREPEND: "prepend",
	PREPEND_TO_HEADING: "prepend to heading",
};
