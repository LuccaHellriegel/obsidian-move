import type { TransformOption } from "src/3_transformSource";
import type { ModifyOption, NoteOption } from "../2_addText";

export type CommandOption = {
	noteBaseName: string;
	noteHeading: string;
	noteOption: NoteOption;
	modifyOption: ModifyOption;
	transformOption: TransformOption;
};
