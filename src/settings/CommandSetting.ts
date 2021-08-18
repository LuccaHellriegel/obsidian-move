import { Setting, Plugin } from "obsidian";
import { NoteOption } from "src/2_addText";
import { getCommand } from "src/commands";
import type { CommandOption } from "./CommandOption";

//TODO: command key settings

const commandDescription = (o: CommandOption) => {
	const a = o.modifyOption[0].toUpperCase() + o.modifyOption.substring(1);
	const b = o.noteHeading ? '"' + o.noteHeading + '"' + " in" : "to";
	const c = o.noteOption === NoteOption.NAMED ? 'note "' + o.noteBaseName + '"' : o.noteOption;
	const d = ", then " + o.transformOption;

	return a + " " + b + " " + c + d;
};

export class CommandSetting extends Setting {
	constructor(containerEl: HTMLElement, plugin: Plugin, o: CommandOption) {
		super(containerEl);

		//TODO: better name for finding in command bar
		const commandDesc = commandDescription(o);
		this.setDesc(commandDescription(o));

		const command = getCommand(o.noteOption, o.modifyOption, o.transformOption);

		//TODO: add delete button: 	(how to remove command?)	//icon: minus-with-circle

		plugin.addCommand({
			id: commandDesc,
			name: commandDesc,
			callback: () => command({ plugin, noteBaseName: o.noteBaseName, heading: o.noteHeading }),
		});
	}
}
