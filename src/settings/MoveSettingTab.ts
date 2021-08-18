import { App, PluginSettingTab, Setting } from "obsidian";
import type MovePlugin from "../MovePlugin";

//@ts-ignore
import CommandCreator from "../ui/CommandCreator.svelte";
class CommandCreatorSetting extends Setting {
	creator: CommandCreator;

	constructor(containerEl: HTMLElement, plugin: MovePlugin) {
		super(containerEl);
		this.creator = new CommandCreator({ target: containerEl, props: { plugin } });
	}

	async onClose() {
		this.creator.$destroy();
	}
}

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
