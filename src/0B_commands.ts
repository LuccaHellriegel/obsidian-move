import { MarkdownView, Plugin } from "obsidian";
import { getSelectedText } from "./1_getText";
import { appendToDailyNote } from "./2_addText";

const editModeGuard = (plugin: Plugin, command: () => any): void => {
	const mdView = plugin.app.workspace.activeLeaf.view as MarkdownView;
	if (!mdView || mdView.getMode() !== "source") {
		new Notification("Please use the plugin in edit mode");
		return;
	} else {
		command();
	}
};

const command = (plugin: Plugin) => {
	const mdView = plugin.app.workspace.activeLeaf.view as MarkdownView;
	const editor = mdView.editor;
	const selection = getSelectedText(editor);
	appendToDailyNote(plugin, selection);
};

export const addMoveCommand = (plugin: Plugin) => {
	plugin.addCommand({
		id: "app:move-to-daily-page",
		name: "Extract selection to daily page - content only",
		//callback
		//TODO: check if editorcallback does what I think it does
		editorCheckCallback: (checking: boolean) => editModeGuard(plugin, () => command(plugin)),
		//TODO
		hotkeys: [
			{
				modifiers: ["Mod", "Shift"],
				key: "c",
			},
		],
	});
};
