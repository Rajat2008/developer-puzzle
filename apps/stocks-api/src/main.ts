/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
const NodeCache = require('node-cache');
const Request = require('request');
import { environment } from './environments/environment';

const appCache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost',
    routes:{
      cors: true
    }
  });

  function fetchQuote(url: string) {
    return new Promise((resolve, reject) => {
      Request(url, (error, res, body) => {
        if (error) reject(error);
        if (res) {
          if (res['statusCode'] !== 200)
            return res;
        }
        resolve(body);
      });
    });
  }

  server.route({
    method: 'GET',
    path: '/beta/stock/{symbol}/chart/{period}',
    handler: (request, h) => {
      const { symbol, period } = request.params;
      const apiKey = request.query.token;
      const urlString = environment.apiUrl + '/beta/stock/' + symbol + '/chart/' + period + '?token=' + apiKey;

      const cachedResponse = appCache.get( urlString );
      if(cachedResponse) return cachedResponse;

      return fetchQuote(urlString).then(response => {
        appCache.set(urlString, response, 10000);
        return response;
      });
    }    
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
