import { Setting, DropdownComponent, TextComponent } from "obsidian";
import { NoteOption, ModifyOption, NoteOptionStringMap, ModifyOptionStringMap } from "src/2_addText";
import MovePlugin from "src/MovePlugin";
import { CommandSetting } from "./CommandSetting";

const defaultNoteOption = NoteOption.NAMED;
const defaultModifyOption = ModifyOption.APPEND;

export class CommandCreatorSetting extends Setting {
	constructor(containerEl: HTMLElement, plugin: MovePlugin) {
		super(containerEl);
		//TODO: text field for command name
		const headingObj = {
			setting: this,
			noteOption: defaultNoteOption,
			modifyOption: defaultModifyOption,
			noteOptionComponent: null as DropdownComponent,
			modifyOptionComponent: null as DropdownComponent,
			noteNameComponent: null as TextComponent,
			noteHeadingComponent: null as TextComponent,
			noteBaseName: "",
			noteHeading: "",
		};
		this.setHeading()
			.setDesc("Add Move Commands")
			.addDropdown(
				(dropdown) =>
					(headingObj.noteOptionComponent = dropdown
						.setValue(defaultNoteOption)
						.addOptions(NoteOptionStringMap)
						.onChange((value) => {
							headingObj.noteOption = NoteOptionStringMap[value] as NoteOption;
							if (NoteOptionStringMap[value] === NoteOption.NAMED) {
								headingObj.noteNameComponent.setDisabled(false).setPlaceholder("Enter Note-Name");
							} else {
								headingObj.noteNameComponent.setDisabled(true).setPlaceholder("").setValue("");
							}
						}))
			)
			.addText(
				(text) =>
					//TODO: needs notDisabled default if default is NAMED
					(headingObj.noteNameComponent = text
						.setValue("")
						.setDisabled(true)
						.onChange((value) => (headingObj.noteBaseName = value.trim())))
			)
			.addDropdown(
				(dropdown) =>
					(headingObj.modifyOptionComponent = dropdown
						.setValue(defaultModifyOption)
						.addOptions(ModifyOptionStringMap)
						.onChange((value) => {
							headingObj.modifyOption = ModifyOptionStringMap[value as ModifyOption] as ModifyOption;
							if (
								ModifyOptionStringMap[value as ModifyOption] === ModifyOption.APPEND_TO_HEADING ||
								ModifyOptionStringMap[value as ModifyOption] === ModifyOption.PREPEND_TO_HEADING
							) {
								headingObj.noteHeadingComponent.setDisabled(false).setPlaceholder("Enter Heading");
							} else {
								headingObj.noteHeadingComponent.setDisabled(true).setPlaceholder("").setValue("");
							}
						}))
			)
			.addText(
				(text) =>
					(headingObj.noteHeadingComponent = text
						.setValue("")
						.setDisabled(true)
						.onChange((value) => (headingObj.noteHeading = value.trim())))
			)
			//TODO: catch invalid input: e.g. missing note name or heading
			.addButton((b) =>
				b.setIcon("plus-with-circle").onClick(() => {
					new CommandSetting(containerEl, plugin, headingObj);
					const { noteBaseName, noteHeading, noteOption, modifyOption } = headingObj;
					//TODO: make method
					plugin.settings.moveCommands.push({ noteBaseName, noteHeading, noteOption, modifyOption });
					plugin.saveSettings();
				})
			);

		headingObj.noteHeadingComponent.inputEl.addClass("obsidian-move-fields");
		headingObj.noteNameComponent.inputEl.addClass("obsidian-move-fields");
		headingObj.noteOptionComponent.selectEl.addClass("obsidian-move-fields");
		headingObj.modifyOptionComponent.selectEl.addClass("obsidian-move-fields");

		for (let moveCommand of plugin.settings.moveCommands) {
			new CommandSetting(containerEl, plugin, moveCommand);
		}
	}
}
