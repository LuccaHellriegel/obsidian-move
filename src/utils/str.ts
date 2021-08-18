import type { Modify } from "src/types/Modify";
import type { InputOptions } from "src/types/Options";

export const prepend: Modify<InputOptions> = (original, { input }) => input + "\n" + original;

export const append: Modify<InputOptions> = (original, { input }) => original + "\n" + input;
