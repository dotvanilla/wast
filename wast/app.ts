/// <reference path="../linq.d.ts" />

namespace wast {

    export function highlight(wast: string) {
        if (TypeScript.logging.outputEverything) {
            console.log(wast);
        }

        let code = new Pointer<string>(<string[]>Strings.ToCharArray(wast));
        let c: string;
        let escape = new Escapes();
        let buffer: string[] = [];
        let lines: HTMLTableRowElement[] = [];
        let line: HTMLSpanElement[] = [];
        let token: HTMLElement;
        let row: HTMLTableRowElement;
        let L: HTMLTableColElement;
        let codeBlock: HTMLTableColElement;

        let addLine = function () {
            L = <any>$ts("<td>", { id: `L${lines.length + 1}` }).display((lines.length + 1).toString());
            codeBlock = <any>$ts("<td>");
            line.forEach(t => codeBlock.appendChild(t));
            line = [];
            row = <any>$ts("<tr>");
            row.appendChild(L);
            row.appendChild(codeBlock);
        }

        while (!code.EndRead) {
            c = code.Next;

            if (escape.comment) {
                if (c = "\n") {
                    escape.comment = false;
                    token = $ts("<span>", { class: "comment" }).display(buffer.join(""));
                    line.push(token);

                    addLine();
                } else {
                    buffer.push(c);
                }
            }
        }
    }

    export class Escapes {

        public constructor(
            public comment: boolean = false,
            public string: boolean = false) {
        }
    }
}