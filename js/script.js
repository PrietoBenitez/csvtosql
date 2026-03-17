let csvData = [];



/* =========================
   GENERATE SQL
========================= */

function generateSQL(){

    const table = document.getElementById("tableName").value;
    const dbType = document.getElementById("dbType").value;

    if(csvData.length === 0){
        alert("Upload a CSV file first");
        return;
    }

    if(!table){
        alert("Enter table name");
        return;
    }

    let sql = "";

    let quote = "`";

    if(dbType === "postgres") quote = '"';
    if(dbType === "sqlite") quote = '"';
    if(dbType === "sqlserver") quote = '"';

    csvData.forEach(row => {

        const columns = Object.keys(row)
            .map(col => `${quote}${col}${quote}`)
            .join(",");

        const values = Object.values(row)
            .map(v => {

                if(v === null || v === "") return "NULL";

                const safe = String(v).replace(/'/g,"''");

                return `'${safe}'`;

            })
            .join(",");

        sql += `INSERT INTO ${quote}${table}${quote} (${columns}) VALUES (${values});\n`;

    });

    document.getElementById("output").value = sql;

}



/* =========================
   COPY SQL
========================= */

function copySQL(){

    const sql = document.getElementById("output");

    sql.select();
    sql.setSelectionRange(0,99999);

    navigator.clipboard.writeText(sql.value);

    alert("SQL copied to clipboard");

}



/* =========================
   DOWNLOAD SQL
========================= */

function downloadSQL(){

    const sql = document.getElementById("output").value;

    if(!sql){
        alert("No SQL to download");
        return;
    }

    const blob = new Blob([sql],{type:"text/sql"});

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "output.sql";

    link.click();

}

/* =========================
   GENERATE SQL
========================= */

function generateCreateTable(){

    const table = document.getElementById("tableName").value;
    const dbType = document.getElementById("dbType").value;

    if(csvData.length === 0){
        alert("Upload a CSV first");
        return;
    }

    if(!table){
        alert("Enter table name");
        return;
    }

    const columns = Object.keys(csvData[0]);

    let quote = "`";

    if(dbType === "postgres") quote = '"';
    if(dbType === "sqlite") quote = '"';
    if(dbType === "sqlserver") quote = '"';

    let sql = `CREATE TABLE ${quote}${table}${quote} (\n`;

    columns.forEach((col,index)=>{

        sql += `  ${quote}${col}${quote} VARCHAR(255)`;

        if(index < columns.length - 1)
            sql += ",\n";

    });

    sql += "\n);\n\n";

    document.getElementById("output").value = sql;

}



/* =========================
   CLEAR TOOL
========================= */

function clearAll(){

    csvData = [];

    document.getElementById("output").value = "";
    document.getElementById("previewTable").innerHTML = "";
    document.getElementById("columns").innerText = "";
    document.getElementById("fileName").innerText = "";

    document.getElementById("csvFile").value = "";

}



/* =========================
   DRAG AND DROP
========================= */

const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("csvFile");

dropZone.addEventListener("dragover",(e)=>{
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave",()=>{
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop",(e)=>{

    e.preventDefault();
    dropZone.classList.remove("dragover");

    const files = e.dataTransfer.files;

    if(files.length > 0){

        const file = files[0];

        fileInput.files = files;

        document.getElementById("fileName").innerText = file.name;

        previewFile(file);

    }

});



/* =========================
   FILE INPUT
========================= */

document.getElementById("csvFile").addEventListener("change",(e)=>{

    const file = e.target.files[0];

    if(!file) return;

    document.getElementById("fileName").innerText = file.name;

    previewFile(file);

});



/* =========================
   PARSE CSV
========================= */

function previewFile(file){

    Papa.parse(file,{

        header:true,
        skipEmptyLines:true,

        complete:function(results){

            csvData = results.data;

            showPreview(csvData);

        },

        error:function(){

            alert("Error reading CSV file");

        }

    });

}



/* =========================
   SHOW PREVIEW
========================= */

function showPreview(data){

    if(data.length === 0) return;

    const columns = Object.keys(data[0]);

    document.getElementById("columns").innerText = columns.join(" | ");

    let html = "<table><tr>";

    columns.forEach(col=>{
        html += `<th>${col}</th>`;
    });

    html += "</tr>";

    for(let i=0;i<Math.min(5,data.length);i++){

        html += "<tr>";

        columns.forEach(col=>{
            html += `<td>${data[i][col] ?? ""}</td>`;
        });

        html += "</tr>";

    }

    html += "</table>";

    document.getElementById("previewTable").innerHTML = html;

}