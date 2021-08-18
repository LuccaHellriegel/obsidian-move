import { App, PluginSettingTab } from "obsidian";
import type MovePlugin from "../MovePlugin";
import { CommandCreatorSetting } from "./CommandCreatorSetting";

export class MoveSettingTab extends PluginSettingTab {
	plugin: MovePlugin;
	creator: CommandCreatorSetting;

	constructor(app: App, plugin: MovePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Obsidian Move Settings" });

		//TODO: load and save from settings
		//TODO: reset default button

		this.creator = new CommandCreatorSetting(containerEl, this.plugin);
	}

	hide() {
		super.hide();
		this.creator.onClose();
	}
}
