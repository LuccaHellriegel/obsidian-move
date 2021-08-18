<script lang="ts">
	import { ModifyOption, NoteOption } from "src/pipeline/2_addText";
	import type MovePlugin from "src/MovePlugin";
	import { DEFAULT_SETTINGS } from "src/settings/Settings";
	import CommandSetting from "./CommandSetting.svelte";
	import { afterUpdate } from "svelte";
	import { TransformOption } from "src/pipeline/3_transformSource";

	export let plugin: MovePlugin;
	let moveCommands = plugin.settings.moveCommands;

	let noteOption = NoteOption.NAMED;
	let noteBaseName = "";

	let modifyOption = ModifyOption.APPEND_TO_HEADING;
	let noteHeading = "";

	let transformOption = TransformOption.REMOVE;

	afterUpdate(() => console.log("Re-renderd Creator"));

	const validateOptions = () => {
		if (
			(modifyOption === ModifyOption.APPEND_TO_HEADING || modifyOption === ModifyOption.PREPEND_TO_HEADING) &&
			(!noteHeading || noteHeading === "")
		) {
			new Notification("Missing heading!");
			return false;
		}

		if (noteOption === NoteOption.NAMED && (!noteBaseName || noteBaseName === "")) {
			new Notification("Missing note-name!");
			return false;
		}
		return true;
	};

	const add = () => {
		if (validateOptions()) {
			//TODO: make method
			const moveCommand = {
				noteBaseName: noteBaseName.trim(),
				noteHeading: noteHeading.trim(),
				noteOption,
				modifyOption,
				transformOption,
			};
			plugin.settings.moveCommands.push(moveCommand);
			plugin.saveSettings();
			moveCommands.push(moveCommand);
		}
	};

	const reset = async () => {
		plugin.settings = DEFAULT_SETTINGS;
		await plugin.saveSettings();
		//TODO: better way to reset?
		plugin.unload();
		plugin.load();
		new Notification("Plugin successfully reset. Please open the settings tab again.");
	};
</script>

<button on:click={reset}>Reset commands</button>

<select bind:value={noteOption}>
	{#each Object.values(NoteOption) as option}
		<option value={option}>
			{option}
		</option>
	{/each}
</select>

{#if noteOption === NoteOption.NAMED}
	<input type="text" placeholder="Enter Note-Name" bind:value={noteBaseName} />
{/if}

<select bind:value={modifyOption}>
	{#each Object.values(ModifyOption) as option}
		<option value={option}>
			{option}
		</option>
	{/each}
</select>

{#if modifyOption === ModifyOption.APPEND_TO_HEADING || modifyOption === ModifyOption.PREPEND_TO_HEADING}
	<input type="text" placeholder="Enter Heading" bind:value={noteHeading} />
{/if}

<select bind:value={transformOption}>
	{#each Object.values(TransformOption) as option}
		<option value={option}>
			{option}
		</option>
	{/each}
</select>

<button on:click={add}>Add Command</button>

<br />
{#each moveCommands as moveCommand}
	<CommandSetting {plugin} option={moveCommand} />
	<br />
{/each}
