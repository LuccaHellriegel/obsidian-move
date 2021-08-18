import type { TFile } from "obsidian";
import type { GetFile } from "src/types/GetFile";
import type { PluginOptions } from "src/types/Options";

export const getNoteContent = async ({ plugin }: PluginOptions, note: TFile) => plugin.app.vault.read(note);

export const overwriteNoteFile = async ({ plugin }: PluginOptions, note: TFile, content: string) =>
	plugin.app.vault.modify(note, content);

export const getNoteFile: GetFile<PluginOptions & { noteBaseName: string }> = (options) => {
	return options.plugin.app.vault.getMarkdownFiles().find((file) => file.basename === options.noteBaseName);
};
