/// <reference path="../linq.d.ts" />
var wast;
(function (wast_1) {
    wast_1.whitespace = "&nbsp;";
    wast_1.keywords = "return|module|func|data|global|local|import|param|result|mut|export|set_local|block|get_local|set_global|get_global|loop|br|br_if|if|then|start".split("|");
    wast_1.types = "i32|i64|f32|f64".split("|");
    function highlight(wast) {
        if (TypeScript.logging.outputEverything) {
            console.log(wast);
        }
        let code = new Pointer(Strings.ToCharArray(wast));
        let c;
        let escape = new Escapes();
        let buffer = [];
        let lines = [];
        let line = [];
        let token;
        let row;
        let L;
        let codeBlock;
        let addLine = function () {
            if (line.length > 0) {
                L = $ts("<td>", { id: `L${lines.length + 1}`, class: "line-number" }).display((lines.length + 1).toString());
                codeBlock = $ts("<td>");
                line.forEach(t => codeBlock.appendChild(t));
                line = [];
                row = $ts("<tr>");
                row.appendChild(L);
                row.appendChild(codeBlock);
                lines.push(row);
            }
        };
        let startWith = function (token) {
            for (var i = 0; i < token.length; i++) {
                if (buffer[i] != token.charAt(i)) {
                    return false;
                }
            }
            return true;
        };
        let addCodeToken = function () {
            if (buffer.length > 0) {
                // split a code token
                let text = buffer.join("");
                let type;
                if (buffer[0] == "$") {
                    type = "symbol";
                }
                else {
                    type = wast_1.keywords.indexOf(text) > -1 ? "keyword" : (wast_1.types.indexOf(text) > -1 ? "type" : "code");
                }
                token = $ts("<span>", { class: type }).display(text);
                buffer = [];
                line.push(token);
            }
        };
        while (!code.EndRead) {
            c = code.Next;
            if (escape.comment) {
                if (c == "\n") {
                    escape.comment = false;
                    token = $ts("<span>", { class: "comment" }).display(buffer.join(""));
                    buffer = [];
                    line.push(token);
                    addLine();
                }
                else {
                    buffer.push(c);
                }
            }
            else if (escape.string) {
                if (c == "\"") {
                    escape.string = false;
                    buffer.push(c);
                    token = $ts("<span>", { class: "string" }).display(buffer.join(""));
                    buffer = [];
                    line.push(token);
                }
                else {
                    buffer.push(c);
                }
            }
            else {
                if (startWith(";;")) {
                    escape.comment = true;
                }
                else if (c == "\"") {
                    escape.string = true;
                }
                else if (c == " ") {
                    addCodeToken();
                    // add current token delimiter whitespace 
                    line.push($ts("<span>").display(wast_1.whitespace));
                }
                else if (c == "(" || c == ")") {
                    // s-expression delimiter
                    // using strong text style
                    addCodeToken();
                    // add current S-expression token delimiter 
                    line.push($ts("<span>", { style: "font-style: strong;" }).display(c));
                }
                else if (c == "\n") {
                    addLine();
                }
                else {
                    buffer.push(c);
                }
            }
        }
        addCodeToken();
        let preview = $ts("<table>");
        lines.forEach(tr => preview.appendChild(tr));
        return preview;
    }
    wast_1.highlight = highlight;
    class Escapes {
        constructor(comment = false, string = false) {
            this.comment = comment;
            this.string = string;
        }
    }
    wast_1.Escapes = Escapes;
})(wast || (wast = {}));
//# sourceMappingURL=wast.code.js.map