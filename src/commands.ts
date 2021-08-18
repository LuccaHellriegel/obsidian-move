import type { MarkdownView, Plugin } from "obsidian";
import { getSelectedText, GetText } from "./1_getText";
import { AddText, NoteOption, ModifyOption, NoteOptionStringMap, ModifyOptionStringMap, addTextMap } from "./2_addText";
import { transformMap, TransformOption, TransformOptionStringMap, TransformSource } from "./3_transformSource";
import type { InputOptions, PluginOptions } from "./types/Options";

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
	addText: AddText<ModifyOptions & InputOptions, GetOptions>,
	transformSource: TransformSource
) {
	return (options: PluginOptions & GetOptions & ModifyOptions) =>
		editModeGuard(options.plugin, async () => {
			const mdView = options.plugin.app.workspace.activeLeaf.view as MarkdownView;
			const editor = mdView.editor;
			const input = getText(editor);
			if (!input || input === "") return;
			const wasAdded = await addText(toAddTextOptions(options, input));
			if (!wasAdded) return;
			//TODO: make transformSource react to getText
			await transformSource(editor);
		});
}

const mergeWithInput: ToAddTextOptions<NonNullable<any>> = (options, input) => {
	return { ...options, input };
};

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
} = {};

for (let noteOption of Object.values(NoteOptionStringMap)) {
	for (let modifyOption of Object.values(ModifyOptionStringMap)) {
		for (let transformOption of Object.values(TransformOptionStringMap)) {
			//TODO: make getAddText/getTransformSource function
			commandMap[noteOption + modifyOption + transformOption] = makeCommand(
				getSelectedText,
				mergeWithInput,
				addTextMap[noteOption + modifyOption],
				transformMap[transformOption]
			);
		}
	}
}

//TODO: make function for creating accessor
export const getCommand = (noteOption: NoteOption, modifyOption: ModifyOption, transformOption: TransformOption) =>
	commandMap[noteOption + modifyOption + transformOption];
