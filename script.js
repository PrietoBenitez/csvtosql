function generateSQL(){

    const file = document.getElementById("csvFile").files[0];
    const table = document.getElementById("tableName").value;

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

            results.data.forEach(row => {

                const columns = Object.keys(row).join(",");
                const values = Object.values(row)
                    .map(v => `'${v}'`)
                    .join(",");

                sql += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;

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

dropZone.addEventListener("dragover", (e)=>{
    e.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", ()=>{
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", (e)=>{
    e.preventDefault();
    dropZone.classList.remove("dragover");

    const files = e.dataTransfer.files;

    if(files.length > 0){
        fileInput.files = files;
    }
});