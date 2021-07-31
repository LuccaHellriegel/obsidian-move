import { App, PluginSettingTab, Setting } from "obsidian";
import MovePlugin from "./0_main";
import { ModifyOptions, NoteOption, optionsForAddText } from "./2_addText";

//TODO: toggle to turn on or off the daily page commands + key combinations
//TODO: + list where you can add and delete note commands + key combinations

const listHead = (containerEl: HTMLElement) =>
	new Setting(containerEl)
		.setHeading()
		.setDesc("Add Move Commands")
		.addButton((b) => b.setIcon("plus-with-circle"))
		.addDropdown((dropdown) => dropdown.addOptions(NoteOption))
		.addDropdown((dropdown) => dropdown.addOptions(ModifyOptions))
		.addText((text) =>
			text
				.setPlaceholder("Enter your secret")
				.setValue("")
				.onChange(async (value) => {
					console.log("Secret: " + value);
					// this.plugin.settings.validation = value as Validation;
				})
		);

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

		//minus-with-circle

		//TODO: reset default

		listHead(containerEl);

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addButton((b) => b.setIcon("plus-with-circle"))
			// .addButton((button) => button.setIcon("cross"))
			.addDropdown((dropdown) => dropdown.addOption("bla", "bla"))
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
