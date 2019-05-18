/// <reference path="../linq.d.ts" />

namespace wast {

    export const whitespace: string = "&nbsp;"
    export const keywords: string[] = "return|module|func|data|global|local|import|param|result|mut|export|set_local|block|get_local|set_global|get_global|loop|br|br_if|if|then|else|start".split("|");
    export const types: string[] = "i32|i64|f32|f64".split("|");

    export function highlight(wast: string): HTMLTableElement {
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
            L = <any>$ts("<td>", { id: `L${lines.length + 1}`, class: "line-number" }).display((lines.length + 1).toString());
            codeBlock = <any>$ts("<td>");
            line.forEach(t => codeBlock.appendChild(t));
            line = [];
            row = <any>$ts("<tr>");
            row.appendChild(L);
            row.appendChild(codeBlock);
            lines.push(row);
        }

        let startWith = function (token: string): boolean {
            for (var i = 0; i < token.length; i++) {
                if (buffer[i] != token.charAt(i)) {
                    return false;
                }
            }

            return true;
        }

        let addCodeToken = function () {
            if (buffer.length > 0) {
                // split a code token
                let text: string = buffer.join("");
                let type: string;

                if (buffer[0] == "$") {
                    type = "symbol";
                } else {
                    type = keywords.indexOf(text) > -1 ? "keyword" : (types.indexOf(text) > -1 ? "type" : "code")
                }

                token = $ts("<span>", { class: type }).display(text);
                buffer = []
                line.push(token);
            }
        }

        while (!code.EndRead) {
            c = code.Next;

            if (escape.comment) {
                if (c == "\n") {
                    escape.comment = false;
                    token = $ts("<span>", { class: "comment" }).display(buffer.join(""));
                    buffer = [];
                    line.push(token);

                    addLine();
                } else {
                    buffer.push(c);
                }
            } else if (escape.string) {
                if (c == "\"") {
                    escape.string = false;
                    buffer.push(c);
                    token = $ts("<span>", { class: "string" }).display(buffer.join(""));
                    buffer = [];
                    line.push(token);
                } else {
                    buffer.push(c);
                }
            } else {
                if (startWith(";;")) {
                    escape.comment = true;
                    buffer.push(c);
                } else if (c == "\"") {
                    escape.string = true;
                    buffer.push("\"");
                } else if (c == " ") {
                    addCodeToken();
                    // add current token delimiter whitespace 
                    line.push($ts("<span>").display(whitespace));
                } else if (c == "(" || c == ")") {
                    // s-expression delimiter
                    // using strong text style
                    addCodeToken();
                    // add current S-expression token delimiter 
                    line.push($ts("<span>", { class: "S" }).display(c));
                } else if (c == "\n") {
                    addLine();
                } else {
                    buffer.push(c);
                }
            }
        }

        addCodeToken();

        let preview: HTMLTableElement = <any>$ts("<table>");
        lines.forEach(tr => preview.appendChild(tr));
        return preview;
    }

    export class Escapes {

        public constructor(
            public comment: boolean = false,
            public string: boolean = false) {
        }
    }
}