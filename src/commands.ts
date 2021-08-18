import type { InputOptions, PluginOptions } from "src/types/Options";
import { editModeGuard, getEditor } from "src/utils/obsidian";
import { GetText, getSelectedText } from "./pipeline/1_getText";
import {
	AddText,
	NoteOption,
	ModifyOption,
	NoteOptionStringMap,
	ModifyOptionStringMap,
	addTextMap,
} from "./pipeline/2_addText";
import { TransformSource, TransformOption, TransformOptionStringMap, transformMap } from "./pipeline/3_transformSource";

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
			const editor = getEditor(options);
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

const createCommandAccessor = (noteOption: NoteOption, modifyOption: ModifyOption, transformOption: TransformOption) =>
	noteOption + modifyOption + transformOption;

for (let noteOption of Object.values(NoteOptionStringMap)) {
	for (let modifyOption of Object.values(ModifyOptionStringMap)) {
		for (let transformOption of Object.values(TransformOptionStringMap)) {
			//TODO: make getAddText/getTransformSource function
			commandMap[
				createCommandAccessor(
					noteOption as NoteOption,
					modifyOption as ModifyOption,
					transformOption as TransformOption
				)
			] = makeCommand(
				getSelectedText,
				mergeWithInput,
				addTextMap[noteOption + modifyOption],
				transformMap[transformOption]
			);
		}
	}
}

export const getCommand = (noteOption: NoteOption, modifyOption: ModifyOption, transformOption: TransformOption) =>
	commandMap[createCommandAccessor(noteOption, modifyOption, transformOption)];
