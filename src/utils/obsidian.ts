import type { TFile, Plugin, MarkdownView } from "obsidian";
import type { GetFile } from "src/types/GetFile";
import type { PluginOptions } from "src/types/Options";

export const getNoteContent = async ({ plugin }: PluginOptions, note: TFile) => plugin.app.vault.read(note);

export const overwriteNoteFile = async ({ plugin }: PluginOptions, note: TFile, content: string) =>
	plugin.app.vault.modify(note, content);

export const getNoteFile: GetFile<PluginOptions & { noteBaseName: string }> = (options) => {
	return options.plugin.app.vault.getMarkdownFiles().find((file) => file.basename === options.noteBaseName);
};

export const editModeGuard = (plugin: Plugin, command: () => any): void => {
	const mdView = plugin.app.workspace.activeLeaf.view as MarkdownView;
	if (!mdView || mdView.getMode() !== "source") {
		new Notification("Please use the plugin in edit mode");
		return;
	} else {
		command();
	}
};

export const getEditor = (options: PluginOptions) => {
	const mdView = options.plugin.app.workspace.activeLeaf.view as MarkdownView;
	return mdView.editor;
};

export const todosRegExp = /^(-|\*) \[ \]/gm;

export const removeTodoBoxes = (str: string) => {
	return str.replace(todosRegExp, (match) => match.slice(0, 2));
};
