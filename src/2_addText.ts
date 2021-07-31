import { Plugin, TFile } from "obsidian";
import { InputOptions, PluginOptions } from "./0_types";

const prepend: Modify<InputOptions> = (original, { input }) => input + "\n" + original;

const append: Modify<InputOptions> = (original, { input }) => original + "\n" + input;

const headingContentRegExp = (heading: string) => new RegExp(`# ${heading} *\n(?:(?!\n#+ )(.|\n))*`);

type HeadingOptions = InputOptions & { heading: string };

//TODO
const prependToHeading: Modify<HeadingOptions> = (original: string, options: HeadingOptions) =>
	original.replace(headingContentRegExp(options.heading), (match) => match + "\n" + options.input);

const appendToHeading: Modify<HeadingOptions> = (original: string, options: HeadingOptions) =>
	original.replace(headingContentRegExp(options.heading), (match) => match + "\n" + options.input);

const getNoteContent = async ({ plugin }: PluginOptions, note: TFile) => plugin.app.vault.read(note);

const overwriteNoteFile = async ({ plugin }: PluginOptions, note: TFile, content: string) =>
	plugin.app.vault.modify(note, content);

type Modify<ModifyOptions> = (original: string, modificationOptions: ModifyOptions & InputOptions) => string;

type GetFile<GetOptions> = (getOptions: GetOptions) => TFile;

export type AddText<ModifyOptions, GetOptions> = (
	options: PluginOptions & ModifyOptions & GetOptions & InputOptions
) => Promise<void>;

function makeAddText<ModifyOptions, GetOptions>(
	modify: Modify<ModifyOptions>,
	getFile: GetFile<GetOptions>
): AddText<ModifyOptions, GetOptions> {
	return async (options) => {
		const note = getFile(options);
		const oldContent = await getNoteContent(options, note);
		await overwriteNoteFile(options, note, modify(oldContent, options));
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

enum ModifyType {
	SIMPLE = "simple",
	HEADING = "heading",
}

type SimpleModifyType = AddText<InputOptions, PluginOptions>;

enum SimpleModifyOption {
	APPEND = "append",
	PREPEND = "prepend",
}

type HeadingModifyType = AddText<HeadingOptions, PluginOptions>;

enum HeadingModifyOption {
	APPEND_TO_HEADING = "append to heading",
	PREPEND_TO_HEADING = "prepend to heading",
}

export const ModifyOptions = Object.fromEntries(
	[...Object.entries(SimpleModifyOption), ...Object.entries(HeadingModifyOption)].sort()
);

// reverse mapping here because the user does not need to know that these are separate
// but we still need to map them to different functions!
const modifyOptionToTypeMap = {
	...Object.keys(SimpleModifyOption).reduce((p, c) => {
		p[c] = ModifyType.SIMPLE;
		return p;
	}, {} as any),
	...Object.keys(HeadingModifyOption).reduce((p, c) => {
		p[c] = ModifyType.HEADING;
		return p;
	}, {} as any),
};

type SimplyModifyOptionMap = { [key in SimpleModifyOption]: SimpleModifyType };

const dailySimpleModifyOptions: SimplyModifyOptionMap = {
	[SimpleModifyOption.APPEND]: appendToDailyNote,
	[SimpleModifyOption.PREPEND]: prependToDailyNote,
};

const noteSimpleModifyOptions: SimplyModifyOptionMap = {
	[SimpleModifyOption.APPEND]: appendToNote,
	[SimpleModifyOption.PREPEND]: prependToNote,
};

type HeadingModifyOptionMap = { [key in HeadingModifyOption]: HeadingModifyType };

const dailyHeadingModifyOptions: HeadingModifyOptionMap = {
	[HeadingModifyOption.APPEND_TO_HEADING]: appendToDailyNoteHeading,
	[HeadingModifyOption.PREPEND_TO_HEADING]: prependToDailyNoteHeading,
};

const noteHeadingModifyOptions: HeadingModifyOptionMap = {
	[HeadingModifyOption.APPEND_TO_HEADING]: appendToNoteHeading,
	[HeadingModifyOption.PREPEND_TO_HEADING]: prependToNoteHeading,
};

export const optionsForAddText: {
	noteOptions: (keyof typeof NoteOption)[];
	modifyOptions: (keyof typeof SimpleModifyOption | keyof typeof HeadingModifyOption)[];
	modifyOptionToTypeMap: { [key in SimpleModifyOption | HeadingModifyOption]: ModifyType };
	functionMap: {
		[ModifyType.SIMPLE]: { [key in NoteOption]: SimplyModifyOptionMap };
		[ModifyType.HEADING]: { [key in NoteOption]: HeadingModifyOptionMap };
	};
} = {
	noteOptions: [...Object.keys(NoteOption)] as Array<keyof typeof NoteOption>,
	modifyOptions: [...Object.keys(SimpleModifyOption), ...Object.keys(HeadingModifyOption)] as Array<
		keyof typeof SimpleModifyOption | keyof typeof HeadingModifyOption
	>,
	modifyOptionToTypeMap,
	functionMap: {
		[ModifyType.SIMPLE]: {
			[NoteOption.DAILY]: dailySimpleModifyOptions,
			[NoteOption.NAMED]: noteSimpleModifyOptions,
		},

		[ModifyType.HEADING]: {
			[NoteOption.DAILY]: dailyHeadingModifyOptions,
			[NoteOption.NAMED]: noteHeadingModifyOptions,
		},
	},
};
