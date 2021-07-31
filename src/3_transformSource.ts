import { Editor } from "obsidian";

//TODO: this also replaces duplications!
export const removeSourceText = (editor: Editor) => editor.replaceSelection("");
