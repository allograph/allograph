import pg from 'pg';
import fs from 'fs';
import path from 'path';

const Conn = new pg.Client("postgresql://username:userpassword@localhost:5432/blog");
const file_path = path.resolve(path.dirname(__dirname), "playing_with_graphql/db_schema.json");

Conn.connect();

function setSchema(tables) {
  fs.writeFileSync(file_path, JSON.stringify({ constrains: tables }), "utf8");
}

let constrains = `
SELECT
  fk.table_name AS FK_Table,
  cu.column_name AS FK_Column,
  pk.table_name AS PK_Table,
  pt.column_name AS PK_Column,
  c.constraint_name,
  c.update_rule,
  c.delete_rule
FROM
  information_schema.referential_constraints AS c
INNER JOIN
  information_schema.table_constraints AS fk
  ON c.constraint_name = fk.constraint_name
INNER JOIN
  information_schema.table_constraints AS pk
  ON c.unique_constraint_name = pk.constraint_name
INNER JOIN
  information_schema.key_column_usage AS cu
  ON c.constraint_name = cu.constraint_name
INNER JOIN
  (
    SELECT
      i1.table_name,
      i2.column_name
    FROM
      information_schema.table_constraints AS i1
    INNER JOIN
      information_schema.key_column_usage AS i2
    ON
      i1.constraint_name = i2.constraint_name
    WHERE i1.constraint_type = 'PRIMARY KEY'
  ) AS pt
  ON
    pt.table_name = pk.table_name
`;

Conn.query(constrains, function(err, result) {
  let constrain_info = result.rows.map(function(row) {
    return row
  });
  setSchema(constrain_info);
});

export default Conn;