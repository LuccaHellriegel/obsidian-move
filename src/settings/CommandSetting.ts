import { Setting, Plugin } from "obsidian";
import { getCommand } from "src/commands";
import { CommandOption } from "./CommandOption";

//TODO: command key settings

export class CommandSetting extends Setting {
	constructor(containerEl: HTMLElement, plugin: Plugin, o: CommandOption) {
		super(containerEl);

		//TODO: better name for finding in command bar
		const commandDesc = o.noteOption + o.noteBaseName + o.modifyOption + o.noteHeading;
		this.setClass("obsidian-move-fields").setDesc(commandDesc);

		const command = getCommand(o.noteOption, o.modifyOption);

		//TODO: add delete button: 		//icon: minus-with-circle

		plugin.addCommand({
			id: commandDesc,
			name: commandDesc,
			callback: () => command({ plugin, noteBaseName: o.noteBaseName, heading: o.noteHeading }),
		});
	}
}
