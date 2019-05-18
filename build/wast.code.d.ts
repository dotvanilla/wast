/// <reference path="../linq.d.ts" />
declare namespace wast {
    function highlight(wast: string): HTMLTableElement;
    class Escapes {
        comment: boolean;
        string: boolean;
        constructor(comment?: boolean, string?: boolean);
    }
}
