<script lang="ts">
	import { NoteOption } from "src/pipeline/2_addText";
	import { getCommand } from "src/commands";
	import type MovePlugin from "src/MovePlugin";
	import type { CommandOption } from "src/settings/CommandOption";

	export let plugin: MovePlugin;
	export let option: CommandOption;

	//TODO: add delete button: 	(how to remove command?)	//icon: minus-with-circle

	//TODO: command key settings

	//TODO: better name for finding in command bar

	const commandDescription = () => {
		const a = option.modifyOption[0].toUpperCase() + option.modifyOption.substring(1);
		const b = option.noteHeading ? '"' + option.noteHeading + '"' + " in" : "to";
		const c = option.noteOption === NoteOption.NAMED ? 'note "' + option.noteBaseName + '"' : option.noteOption;
		const d = ", then " + option.transformOption;

		return a + " " + b + " " + c + d;
	};

	const description = commandDescription();
	const command = getCommand(option.noteOption, option.modifyOption, option.transformOption);

	plugin.addCommand({
		id: description,
		name: description,
		callback: () => command({ plugin, noteBaseName: option.noteBaseName, heading: option.noteHeading }),
	});
</script>

{description}
