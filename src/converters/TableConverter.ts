import {BaseConverter} from "./BaseConverter";
import {Paragraph, Table, TableCell, TableRow, TextRun, WidthType} from "docx";
import {Table as MdTable} from "mdast";
import {childrenConverter} from "./ChildrenConverter";

class TableConverter extends BaseConverter<MdTable, (Paragraph | Table)[]> {
  private tableCount = 0;

  convert = (node: MdTable): (Table | Paragraph)[] => {
    this.tableCount++;

    const table = node as MdTable;
    const rows: TableRow[] = [];

    for (const row of table.children) {
      const cells: TableCell[] = [];

      for (const cell of row.children) {
        cells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun(childrenConverter.getPlainText(cell.children))],
                style: "TableCell"
              }),
            ],
            borders: {
              top: { color: "000000", size: 4, style: "single" },
              bottom: { color: "000000", size: 4, style: "single" },
              left: { color: "000000", size: 4, style: "single" },
              right: { color: "000000", size: 4, style: "single" },
            },
            margins: { top: 24, bottom: 24, left: 24, right: 24 },
          })
        );
      }

      rows.push(new TableRow({ children: cells }));
    }

    return [
      new Paragraph({
        children: [new TextRun(`Таблица ${this.tableCount}`)],
        style: "Prefix",
      }),

      new Table({
        rows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      })
    ];
  };
}

export const tableConverter = new TableConverter();
