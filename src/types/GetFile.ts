import type { TFile } from "obsidian";

export type GetFile<GetOptions> = (getOptions: GetOptions) => TFile;
