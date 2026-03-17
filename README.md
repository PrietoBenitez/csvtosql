# CSV → SQL Generator

A simple web tool that converts CSV files into SQL INSERT statements.

## Features

- Upload CSV files
- Drag & Drop support
- Automatic column detection
- SQL preview
- Generate INSERT statements
- Support for multiple databases:
  - MySQL
  - PostgreSQL
  - SQLite
  - SQL Server
- Copy SQL to clipboard
- Download SQL file

## Live Demo

https://csvtosql-three.vercel.app

## Technologies

- HTML
- CSS
- JavaScript
- PapaParse
- Vercel

## Example

CSV

id,name,email  
1,John,john@mail.com  

Generated SQL

```sql
INSERT INTO users (id,name,email)
VALUES ('1','John','john@mail.com');