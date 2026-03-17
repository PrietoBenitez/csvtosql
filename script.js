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