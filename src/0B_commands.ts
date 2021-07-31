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
} from "./2_addText";
import { removeSourceText } from "./3_transformSource";
import { InputOptions, PluginOptions } from "./0_types";

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

export const addMoveCommand = (plugin: Plugin) => {
	plugin.addCommand({
		id: "app:move-to-daily-page",
		name: "Extract selection to page - content only",
		//callback
		//TODO: find out what editorcallback does and if it can replace the guard
		//TODO: make guard if invalid note-name has been configured!
		callback: () => noteAppendCommand({ plugin, noteBaseName: "WritingToThink" }),
		//TODO
		hotkeys: [
			{
				modifiers: ["Mod", "Shift"],
				key: "c",
			},
		],
	});
};
