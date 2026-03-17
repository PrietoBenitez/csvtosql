function generateSQL(){

    const file = document.getElementById("csvFile").files[0];
    const table = document.getElementById("tableName").value;
    const dbType = document.getElementById("dbType").value;

    if(!file){
        alert("Upload CSV file");
        return;
    }

    if(!table){
        alert("Enter table name");
        return;
    }

    Papa.parse(file,{
        header:true,
        skipEmptyLines:true,

        complete:function(results){

            let sql = "";

            // definir tipo de comillas según DB
            let quote = "`";

            if(dbType === "postgres") quote = '"';
            if(dbType === "sqlite") quote = '"';
            if(dbType === "sqlserver") quote = '"';

            results.data.forEach(row => {

                const columns = Object.keys(row)
                    .map(col => `${quote}${col}${quote}`)
                    .join(",");

                const values = Object.values(row)
                    .map(v => {

                        if(v === null || v === "") return "NULL";

                        // escapar comillas
                        const safe = String(v).replace(/'/g,"''");

                        return `'${safe}'`;

                    })
                    .join(",");

                sql += `INSERT INTO ${quote}${table}${quote} (${columns}) VALUES (${values});\n`;

            });

            document.getElementById("output").value = sql;

        }
    });

}



function copySQL(){

    const sql = document.getElementById("output");

    sql.select();
    sql.setSelectionRange(0,99999);

    navigator.clipboard.writeText(sql.value);

    alert("SQL copied to clipboard");

}



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
        fileInput.files = files;

        // mostrar preview automáticamente
        previewFile(files[0]);
    }

});



document.getElementById("csvFile").addEventListener("change",(e)=>{

    const file = e.target.files[0];

    previewFile(file);

});



function previewFile(file){

    Papa.parse(file,{

        header:true,
        skipEmptyLines:true,

        complete:function(results){

            showPreview(results.data);

        }

    });

}



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