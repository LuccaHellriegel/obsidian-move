//TODO: this matches lines that start with # but the rest is empty, e.g.:
//#
//how to make it ignore these but still match empty lines before that?
//TODO: this does not match if the end of the file is the heading
//-> making the \n optional just makes it match wrong headings
export const headingAndContentRegExp = (heading: string) => new RegExp(`# ${heading} *\n(?:(?!\n#+ )(.|\n))*`);

export const headingRegExp = (heading: string) => new RegExp(`# ${heading} *\n`);
