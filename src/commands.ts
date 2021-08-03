import { MarkdownView, Plugin } from "obsidian";
import { getSelectedText, GetText } from "./1_getText";
import {
	appendToDailyNote,
	appendToDailyNoteHeading,
	AddText,
	prependToDailyNote,
	prependToDailyNoteHeading,
	appendToNote,
	prependToNote,
	appendToNoteHeading,
	prependToNoteHeading,
	NoteOption,
	ModifyOption,
} from "./2_addText";
import { removeSourceText } from "./3_transformSource";
import { InputOptions, PluginOptions } from "./types";

const editModeGuard = (plugin: Plugin, command: () => any): void => {
	const mdView = plugin.app.workspace.activeLeaf.view as MarkdownView;
	if (!mdView || mdView.getMode() !== "source") {
		new Notification("Please use the plugin in edit mode");
		return;
	} else {
		command();
	}
};

type ToAddTextOptions<BaseOptions> = (options: BaseOptions, input: string) => BaseOptions & InputOptions;

type Command<ModifyOptions, GetOptions> = (options: PluginOptions & GetOptions & ModifyOptions) => void;

function makeCommand<ModifyOptions, GetOptions>(
	getText: GetText,
	toAddTextOptions: ToAddTextOptions<PluginOptions & GetOptions & ModifyOptions>,
	addText: AddText<ModifyOptions & InputOptions, GetOptions>
) {
	return (options: PluginOptions & GetOptions & ModifyOptions) =>
		editModeGuard(options.plugin, async () => {
			const mdView = options.plugin.app.workspace.activeLeaf.view as MarkdownView;
			const editor = mdView.editor;
			const input = getText(editor);
			await addText(toAddTextOptions(options, input));
			//TODO: make transformSource configurable
			await removeSourceText(editor);
		});
}

const mergeWithInput: ToAddTextOptions<NonNullable<any>> = (options, input) => {
	return { ...options, input };
};

const noteAppendCommand = makeCommand(getSelectedText, mergeWithInput, appendToNote);
const notePrependCommand = makeCommand(getSelectedText, mergeWithInput, prependToNote);
const noteAppendToHeadingCommand = makeCommand(getSelectedText, mergeWithInput, appendToNoteHeading);
const notePrependToHeadingCommand = makeCommand(getSelectedText, mergeWithInput, prependToNoteHeading);

const dailyAppendCommand = makeCommand(getSelectedText, mergeWithInput, appendToDailyNote);
const dailyPrependCommand = makeCommand(getSelectedText, mergeWithInput, prependToDailyNote);
const dailyAppendToHeadingCommand = makeCommand(getSelectedText, mergeWithInput, appendToDailyNoteHeading);
const dailyPrependToHeadingCommand = makeCommand(getSelectedText, mergeWithInput, prependToDailyNoteHeading);

const commandMap: {
	[key: string]: Command<
		| {
				heading: string;
		  }
		| {},
		| {
				noteBaseName: string;
		  }
		| {}
	>;
} = {
	[NoteOption.DAILY + ModifyOption.APPEND]: dailyAppendCommand,
	[NoteOption.DAILY + ModifyOption.APPEND_TO_HEADING]: dailyAppendToHeadingCommand,
	[NoteOption.DAILY + ModifyOption.PREPEND]: dailyPrependCommand,
	[NoteOption.DAILY + ModifyOption.PREPEND_TO_HEADING]: dailyPrependToHeadingCommand,
	[NoteOption.NAMED + ModifyOption.APPEND]: noteAppendCommand,
	[NoteOption.NAMED + ModifyOption.APPEND_TO_HEADING]: noteAppendToHeadingCommand,
	[NoteOption.NAMED + ModifyOption.PREPEND]: notePrependCommand,
	[NoteOption.NAMED + ModifyOption.PREPEND_TO_HEADING]: notePrependToHeadingCommand,
};

export const getCommand = (noteOption: NoteOption, modifyOption: ModifyOption) => commandMap[noteOption + modifyOption];
