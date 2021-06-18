const { Pool } = require('pg');
const PG_URI = 'postgres://ugkfnyme:bNJrg812ELPmMtI5ItOP2SMHWtUCqCjl@kashin.db.elephantsql.com:5432/ugkfnyme';

const pool = new Pool({
  connectionString: PG_URI
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  }
};