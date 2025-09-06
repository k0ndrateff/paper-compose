import {remark} from "remark";

export const parseMarkdown = (markdown: string) => remark().parse(markdown);
