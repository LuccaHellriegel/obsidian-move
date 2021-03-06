import { Plugin } from "obsidian";
import { MoveSettingTab } from "./settings/MoveSettingTab";
import { DEFAULT_SETTINGS, Settings } from "./settings/Settings";

enum Validation {
	TODO,
	LIST,
	NONE,
}

export default class MovePlugin extends Plugin {
	settings: Settings;

	async onload() {
		// if (!this.checkDailyNotesEnabled()) {
		// 	new Notice('Daily notes plugin is not enabled. Enable it and then reload Obsidian.', 2000)
		// }
		// export const checkDailyNotesEnabled = (plugin: Plugin) => {
		// 	return plugin.app.vault.config.pluginEnabledStatus["daily-notes"];
		// };
		//TODO
		console.log("loading Obsidian Move plugin");

		await this.loadSettings();
		this.addSettingTab(new MoveSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
