document.addEventListener("DOMContentLoaded", () => {
    // Button event listeners
    document.getElementById("bold-btn").addEventListener("click", () => formatText("bold"));
    document.getElementById("italic-btn").addEventListener("click", () => formatText("italic"));
    document.getElementById("highlight-btn").addEventListener("click", highlightText);

    document.getElementById("add-row").addEventListener("click", addRow);
    document.getElementById("add-col").addEventListener("click", addColumn);
    document.getElementById("delete-row").addEventListener("click", deleteRow);
    document.getElementById("delete-col").addEventListener("click", deleteColumn);

    document.getElementById("apply-formula").addEventListener("click", applyFormula);
});

// Function to format selected text
function formatText(command) {
    document.execCommand(command, false, null);
}

// Function to highlight selected text
function highlightText() {
    document.execCommand("backColor", false, "yellow");
}

// Function to add a new row
function addRow() {
    let table = document.getElementById("spreadsheet").getElementsByTagName("tbody")[0];
    let rowCount = table.rows.length;
    let newRow = table.insertRow();

    let headerCell = newRow.insertCell(0);
    headerCell.textContent = rowCount + 1; // Numbering the row

    for (let i = 0; i < table.rows[0].cells.length - 1; i++) {
        let cell = newRow.insertCell(i + 1);
        cell.contentEditable = "true";
    }
}

// Function to add a new column
function addColumn() {
    let table = document.getElementById("spreadsheet");
    let columnCount = table.rows[0].cells.length;
    
    // Update headers
    let newHeader = document.createElement("th");
    newHeader.textContent = String.fromCharCode(64 + columnCount);
    table.getElementsByTagName("thead")[0].rows[0].appendChild(newHeader);

    // Add cells to each row
    let rows = table.getElementsByTagName("tbody")[0].rows;
    for (let i = 0; i < rows.length; i++) {
        let newCell = rows[i].insertCell(columnCount);
        newCell.contentEditable = "true";
    }
}

// Function to delete the last row
function deleteRow() {
    let table = document.getElementById("spreadsheet").getElementsByTagName("tbody")[0];
    if (table.rows.length > 1) {
        table.deleteRow(table.rows.length - 1);
    } else {
        alert("Cannot delete all rows.");
    }
}

// Function to delete the last column
function deleteColumn() {
    let table = document.getElementById("spreadsheet");
    let columnCount = table.rows[0].cells.length;
    
    if (columnCount > 2) {
        table.getElementsByTagName("thead")[0].rows[0].deleteCell(columnCount - 1);

        let rows = table.getElementsByTagName("tbody")[0].rows;
        for (let i = 0; i < rows.length; i++) {
            rows[i].deleteCell(columnCount - 1);
        }
    } else {
        alert("Cannot delete all columns.");
    }
}

// Function to apply formula
function applyFormula() {
    let formulaInput = document.getElementById("formula-input").value.trim();

    if (formulaInput === "") {
        alert("Please enter a formula before applying.");
        return;
    }

    let selectedCell = document.activeElement;
    if (selectedCell && selectedCell.tagName === "TD") {
        selectedCell.textContent = evaluateFormula(formulaInput);
        alert("Formula applied: " + formulaInput);
    } else {
        alert("Please select a cell to apply the formula.");
    }
}

// Function to evaluate formulas (basic example for SUM)
function evaluateFormula(formula) {
    if (formula.startsWith("=SUM(") && formula.endsWith(")")) {
        let range = formula.substring(5, formula.length - 1).split(":");
        if (range.length === 2) {
            let startCol = range[0].charAt(0).toUpperCase().charCodeAt(0) - 65;
            let endCol = range[1].charAt(0).toUpperCase().charCodeAt(0) - 65;
            let table = document.getElementById("spreadsheet");
            let sum = 0;

            for (let row of table.getElementsByTagName("tbody")[0].rows) {
                for (let col = startCol; col <= endCol; col++) {
                    let cellValue = row.cells[col + 1].textContent.trim();
                    sum += isNaN(cellValue) ? 0 : parseFloat(cellValue);
                }
            }
            return sum;
        }
    }
    return "Invalid formula";
}
