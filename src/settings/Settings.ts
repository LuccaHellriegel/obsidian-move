import { NoteOption, ModifyOption } from "src/2_addText";
import { CommandOption } from "./CommandOption";

export type Settings = { moveCommands: CommandOption[] };

export const DEFAULT_SETTINGS: Settings = {
	moveCommands: [
		{
			noteBaseName: null,
			noteHeading: "TODO",
			noteOption: NoteOption.DAILY,
			modifyOption: ModifyOption.APPEND_TO_HEADING,
		},
		{
			noteBaseName: null,
			noteHeading: null,
			noteOption: NoteOption.DAILY,
			modifyOption: ModifyOption.APPEND,
		},
	],
};