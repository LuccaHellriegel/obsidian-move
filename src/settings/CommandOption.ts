import { ModifyOption, NoteOption } from "../2_addText";

//TODO: toggle to turn on or off the daily page commands + key combinations
//TODO: + list where you can add and delete note commands + key combinations
//TODO: default options (daily note + daily note TODO heading)

export type CommandOption = {
	noteBaseName: string;
	noteHeading: string;
	noteOption: NoteOption;
	modifyOption: ModifyOption;
};
