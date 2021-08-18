import type { TransformOption } from "src/3_transformSource";
import type { NoteOption, ModifyOption } from "src/pipeline/2_addText";

export type CommandOption = {
	noteBaseName: string;
	noteHeading: string;
	noteOption: NoteOption;
	modifyOption: ModifyOption;
	transformOption: TransformOption;
};
