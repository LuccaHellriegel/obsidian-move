import type { InputOptions } from "./Options";

export type Modify<ModifyOptions> = (
	original: string,
	modificationOptions: ModifyOptions & InputOptions
) => string | null;
