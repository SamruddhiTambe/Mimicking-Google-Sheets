function parseFormula(formula) {
    let match = formula.match(/(SUM|AVERAGE|MAX|MIN|COUNT|TRIM|UPPER|LOWER|REMOVE_DUPLICATES|FIND_AND_REPLACE)\((.*?)\)/i);
    if (!match) return "Error";

    let func = match[1].toUpperCase();
    let args = match[2].split(",").map(arg => arg.trim());

    let values = args.map(arg => {
        let cell = document.querySelector(`[data-cell='${arg}']`);
        return cell ? parseFloat(cell.innerText) || 0 : 0;
    });

    switch (func) {
        case "SUM": return values.reduce((a, b) => a + b, 0);
        case "AVERAGE": return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
        case "MAX": return Math.max(...values);
        case "MIN": return Math.min(...values);
        case "COUNT": return values.filter(val => !isNaN(val)).length;
        case "TRIM": return args.map(arg => arg.trim()).join(", ");
        case "UPPER": return args.map(arg => arg.toUpperCase()).join(", ");
        case "LOWER": return args.map(arg => arg.toLowerCase()).join(", ");
        case "REMOVE_DUPLICATES": return [...new Set(args)].join(", ");
        case "FIND_AND_REPLACE":
            return args[0].replace(new RegExp(args[1], "g"), args[2]);
        default: return "Error";
    }
}
