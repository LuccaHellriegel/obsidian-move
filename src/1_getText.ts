import { Editor } from "obsidian";

export const getSelectedText = (editor: Editor) => editor.getSelection().trim();

// noteRemainder(doc:Editor): string[] {
//   doc.setCursor(doc.getCursor().line, 0);
//   const currentLine = doc.getCursor();
//   const endPosition = doc.offsetToPos(doc.getValue().length);
//   const content = doc.getRange(currentLine, endPosition);
//   const trimmedContent = content.trim();
//   return trimmedContent.split('\n');
// }