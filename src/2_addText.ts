import type { GetFile } from "./types/GetFile";
import type { Modify } from "./types/Modify";
import type { HeadingOptions, InputOptions, PluginOptions } from "./types/Options";
import { headingRegExp, headingAndContentRegExp } from "./utils/markdown";
import { getNoteContent, getNoteFile, overwriteNoteFile } from "./utils/obsidian";
import { getDailyNoteFile } from "./utils/obsidian_daily";
import { append, prepend } from "./utils/str";

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
	const result = original.replace(headingAndContentRegExp(options.heading), (match) => {
		wasModified = true;
		return match + "\n" + options.input;
	});
	if (wasModified) return result;
	new Notification("Heading " + options.heading + " was not found.");
	return null;
};

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

export enum NoteOption {
	NAMED = "named note",
	DAILY = "daily note",
}

const getFileMap: { [x: string]: GetFile<any> } = {
	[NoteOption.DAILY]: getDailyNoteFile,
	[NoteOption.NAMED]: getNoteFile,
};

//TODO: what happens if the heading is not found? -> make it at the end? configurable? currently:
//TODO: make sure it does not remove/transform the source on error!

export enum ModifyOption {
	APPEND = "append",
	APPEND_TO_HEADING = "append to heading",
	PREPEND = "prepend",
	PREPEND_TO_HEADING = "prepend to heading",
}

const modifyMap: { [x: string]: Modify<any> } = {
	[ModifyOption.APPEND]: append,
	[ModifyOption.APPEND_TO_HEADING]: appendToHeading,
	[ModifyOption.PREPEND]: prepend,
	[ModifyOption.PREPEND_TO_HEADING]: prependToHeading,
};

//we need these as input to addOptions because using the enums leads to not being able to use === with the actual enums...
export const NoteOptionStringMap: { [x: string]: string } = {
	NAMED: "named note",
	DAILY: "daily note",
};

export const ModifyOptionStringMap: { [x: string]: string } = {
	//keep this at the first position to enable default
	APPEND_TO_HEADING: "append to heading",
	APPEND: "append",
	PREPEND: "prepend",
	PREPEND_TO_HEADING: "prepend to heading",
};

export const addTextMap: { [x: string]: AddText<any, any> } = {};

//TODO: could also create the functions only on-demand and cache them, but seems like over-optimization right now
for (let noteOption of Object.values(NoteOptionStringMap)) {
	for (let modifyOption of Object.values(ModifyOptionStringMap)) {
		addTextMap[noteOption + modifyOption] = makeAddText(modifyMap[modifyOption], getFileMap[noteOption]);
	}
}
