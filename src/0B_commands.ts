import { MarkdownView, Plugin } from "obsidian";
import { getSelectedText } from "./1_getText";
import { appendToDailyNote, appendToDailyNoteHeading } from "./2_addText";
import { removeSourceText } from "./3_transformSource";

export const editModeGuard = (plugin: Plugin, command: () => any): void => {
	const mdView = plugin.app.workspace.activeLeaf.view as MarkdownView;
	if (!mdView || mdView.getMode() !== "source") {
		new Notification("Please use the plugin in edit mode");
		return;
	} else {
		command();
	}
};

export const command = async (plugin: Plugin) => {
	const mdView = plugin.app.workspace.activeLeaf.view as MarkdownView;
	const editor = mdView.editor;
	const selection = getSelectedText(editor);
	await appendToDailyNoteHeading(plugin, selection, "TODO");
	await removeSourceText(editor);
};

export const addMoveCommand = (plugin: Plugin) => {
	plugin.addCommand({
		id: "app:move-to-daily-page",
		name: "Extract selection to daily page - content only",
		//callback
		//TODO: find out what editorcallback does and if it can replace the guard
		callback: () => editModeGuard(plugin, () => command(plugin)),
		//TODO
		hotkeys: [
			{
				modifiers: ["Mod", "Shift"],
				key: "c",
			},
		],
	});
};
