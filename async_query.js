const mysql = require("mysql2");

class sqldb {
  constructor( param ) {
      this.connection = mysql.createConnection( param );
  }
  query( sql, args ) {
      return new Promise( ( resolve, reject ) => {
          this.connection.query( sql, args, ( err, rows ) => {
              if ( err ) {
                  console.log(err.sql);
                  console.log("");
                  return reject( err );
              }
              resolve( rows );
          } );
      } );
  }
  close() {
      return new Promise( ( resolve, reject ) => {
          this.connection.end( err => {
              if ( err )
                  return reject( err );
              resolve();
          } );
      } );
  }
}

module.exports = sqldb;