import { App, PluginSettingTab, Setting } from "obsidian";
import { Move } from "./0_main";

export class MoveSettingTab extends PluginSettingTab {
	plugin: Move;

	constructor(app: App, plugin: Move) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue("")
					.onChange(async (value) => {
						console.log("Secret: " + value);
						// this.plugin.settings.validation = value as Validation;
						await this.plugin.saveSettings();
					})
			);
	}
}
