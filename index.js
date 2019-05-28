'use strict';

require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const routes = require('./webserver/routes');
const mysqlPool = require('./ddbb/mysql-pool');


process.on("uncaughtException", err => {
    console.error("unexpected exception", err.message, err);
  });  
  
  process.on("unhandledRejection", err => {  
    console.error("unexpected error", err.message, err);  
  });

const app = express();
app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error(err);
    res.status(400).send({
        error: `Body parser: ${err.message}`,
    });
});

/**

 * Enable CORS 

 */

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use('/api', routers.accountRouter);
app.use('/api', routers.postRouter);
app.use('/api', routers.userRouter);

app.use((err, req, res, next) => {
    const { name: errorName } = err;  
    if (errorName === "AccountNotActivatedError") {  
      return res.status(403).send({  
        message: err.message  
      });  
    }  
    return res.status(500).send({  
      error: err.message  
    });  
  });

async function init() {
    try {
        await mysqlPool.connect();
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}

    const port = proccess.env.PORT;
    app.listen(port, () => {
        console.log(`Server running and listening on port ${port}`);
        });

}

init();