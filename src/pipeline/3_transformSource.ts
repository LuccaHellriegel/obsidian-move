import type { Editor } from "obsidian";
import { removeTodoBoxes } from "../utils/obsidian";

export type TransformSource = (editor: Editor) => void;

const removeSourceText = (editor: Editor) => editor.replaceSelection("");
//TODO: make pipeline so that this does not have to get the selection again
//TODO: catch somehow if cant transform (e.g. no todo-box present)? revert maybe?

const removeTodoBox = (editor: Editor) => editor.replaceSelection(removeTodoBoxes(editor.getSelection()));

export enum TransformOption {
	REMOVE = "remove source-text",
	REMOVE_TODO = "remove todo-box in source-text",
}

export const TransformOptionStringMap: { [x: string]: string } = {
	REMOVE: "remove source-text",
	REMOVE_TODO: "remove todo-box in source-text",
};

export const transformMap: { [x: string]: TransformSource } = {
	[TransformOption.REMOVE]: removeSourceText,
	[TransformOption.REMOVE_TODO]: removeTodoBox,
};
