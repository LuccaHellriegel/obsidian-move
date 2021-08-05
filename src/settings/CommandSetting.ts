import { Setting, Plugin } from "obsidian";
import { NoteOption } from "src/2_addText";
import { getCommand } from "src/commands";
import { CommandOption } from "./CommandOption";

//TODO: command key settings

const commandDescription = (o: CommandOption) => {
	const start = o.modifyOption[0].toUpperCase() + o.modifyOption.substring(1);
	const middle = o.noteHeading ? '"' + o.noteHeading + '"' + " in" : "to";
	const end = o.noteOption === NoteOption.NAMED ? 'note "' + o.noteBaseName + '"' : o.noteOption;

	return start + " " + middle + " " + end;
};

export class CommandSetting extends Setting {
	constructor(containerEl: HTMLElement, plugin: Plugin, o: CommandOption) {
		super(containerEl);

		//TODO: better name for finding in command bar
		const commandDesc = commandDescription(o);
		this.setClass("obsidian-move-fields").setDesc(commandDescription(o));

		const command = getCommand(o.noteOption, o.modifyOption);

		//TODO: add delete button: 		//icon: minus-with-circle

		plugin.addCommand({
			id: commandDesc,
			name: commandDesc,
			callback: () => command({ plugin, noteBaseName: o.noteBaseName, heading: o.noteHeading }),
		});
	}
}
