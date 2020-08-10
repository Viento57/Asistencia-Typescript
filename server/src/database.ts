import mysql from 'promise-mysql';

import keys from './keys';

const poolDB = mysql.createPool(keys.database);

poolDB.getConnection()
    .then(connection =>{
        poolDB.releaseConnection(connection);
        console.log('DB is connected');
        
    });

    export default poolDB;