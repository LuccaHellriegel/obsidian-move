import { Setting, DropdownComponent, TextComponent } from "obsidian";
import { NoteOption, ModifyOption, NoteOptionStringMap, ModifyOptionStringMap } from "src/2_addText";
import { TransformOption, TransformOptionStringMap } from "src/3_transformSource";
import MovePlugin from "src/MovePlugin";
import { CommandSetting } from "./CommandSetting";
import { DEFAULT_SETTINGS } from "./Settings";

//sadly to make these defaults work, the ordering in the StringMap objects has to match
const defaultNoteOption = NoteOption.NAMED;
const defaultModifyOption = ModifyOption.APPEND_TO_HEADING;
const defaultTransformOption = TransformOption.REMOVE;

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
			noteBaseName: "",
			noteHeadingComponent: null as TextComponent,
			noteHeading: "",
			transformOption: defaultTransformOption,
			transformOptionComponent: null as DropdownComponent,
		};
		this.setHeading()
			.addButton((button) =>
				button
					.setIcon("switch")
					.setTooltip("Reset commands.")
					.onClick(async () => {
						plugin.settings = DEFAULT_SETTINGS;
						await plugin.saveSettings();
						//TODO: better way to reset?
						plugin.unload();
						plugin.load();
						new Notification("Plugin successfully reset. Please open the settings tab again.");
					})
			)
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
						.setPlaceholder("Enter Note-Name")
						.setDisabled(false)
						.onChange((value) => (headingObj.noteBaseName = value.trim())))
			)
			//TODO: extract make dropdown function
			.addDropdown(
				(dropdown) =>
					(headingObj.modifyOptionComponent = dropdown
						.setValue(defaultModifyOption)
						.addOptions(ModifyOptionStringMap)
						.onChange((value) => {
							const option = ModifyOptionStringMap[value as ModifyOption] as ModifyOption;
							headingObj.modifyOption = option;
							if (option === ModifyOption.APPEND_TO_HEADING || option === ModifyOption.PREPEND_TO_HEADING) {
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
						.setPlaceholder("Enter Heading")
						.setDisabled(false)
						.onChange((value) => (headingObj.noteHeading = value.trim())))
			)
			.addDropdown(
				(dropdown) =>
					(headingObj.transformOptionComponent = dropdown
						.setValue(defaultTransformOption)
						.addOptions(TransformOptionStringMap)
						.onChange((value) => {
							const option = TransformOptionStringMap[value as TransformOption] as TransformOption;
							headingObj.transformOption = option;
						}))
			)
			.addButton((b) =>
				b.setIcon("plus-with-circle").onClick(() => {
					if (
						(headingObj.modifyOption === ModifyOption.APPEND_TO_HEADING ||
							headingObj.modifyOption === ModifyOption.PREPEND_TO_HEADING) &&
						(!headingObj.noteHeading || headingObj.noteHeading === "")
					) {
						new Notification("Missing heading!");
						return;
					}

					if (
						headingObj.noteOption === NoteOption.NAMED &&
						(!headingObj.noteBaseName || headingObj.noteBaseName === "")
					) {
						new Notification("Missing note-name!");
						return;
					}

					new CommandSetting(containerEl, plugin, headingObj);
					const { noteBaseName, noteHeading, noteOption, modifyOption, transformOption } = headingObj;
					//TODO: make method
					plugin.settings.moveCommands.push({ noteBaseName, noteHeading, noteOption, modifyOption, transformOption });
					plugin.saveSettings();
				})
			);

		headingObj.noteHeadingComponent.inputEl.addClass("obsidian-move-fields");
		headingObj.noteNameComponent.inputEl.addClass("obsidian-move-fields");
		headingObj.noteOptionComponent.selectEl.addClass("obsidian-move-fields");
		headingObj.modifyOptionComponent.selectEl.addClass("obsidian-move-fields");
		headingObj.transformOptionComponent.selectEl.addClass("obsidian-move-fields");

		for (let moveCommand of plugin.settings.moveCommands) {
			new CommandSetting(containerEl, plugin, moveCommand);
		}
	}
}
