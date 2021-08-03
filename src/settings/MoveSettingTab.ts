import { App, PluginSettingTab, Setting } from "obsidian";
import MovePlugin from "../MovePlugin";
import { CommandCreatorSetting } from "./CommandCreatorSetting";
import { Settings } from "./Settings";

export class MoveSettingTab extends PluginSettingTab {
	plugin: MovePlugin;

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

		new CommandCreatorSetting(containerEl, this.plugin);
	}
}
