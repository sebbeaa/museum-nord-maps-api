import express from 'express';
import * as dotenv from 'dotenv';
process.env.NODE_ENV !== 'production' && dotenv.config();
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import { previewClient, productionClient } from './lib/client';
import cors from 'cors';
import { mapPoint, mapPoints, mapPointsPre, mapPointsUpdate, regionQuery } from './lib/querys';
import { createAndAddPoint, fetch } from './tools/fetch';
import { MapPoint } from './types/IMap';

const PREVIEW_KEY = process.env.PREVIEW_KEY;
const ACCESS_KEY = process.env.ACCESS_KEY;

const corsOrgins = [
  'http://localhost:4173',
  'http://localhost:5173',
  'https://gaia-maps.vercel.app',
  'https://gaia-maps-sebbetastian.vercel.app',
];

const port = 3000;
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: corsOrgins,
    methods: ['GET', 'POST'],
  },
});

app.use(
  cors({
    origin: corsOrgins,
  }),
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//api v1
app.use('/preview', (req, res, next) => {
  const authheader = req.headers.authorization;
  authheader?.replace('token', ' ').trim() === PREVIEW_KEY ? next() : res.status(400).send('Access denied');
});

app.use('/one', (req, res, next) => {
  const authheader = req.headers.authorization;
  authheader?.replace('token', ' ').trim() === ACCESS_KEY ? next() : res.status(400).send('Access denied');
});

app.get('/preview/:region/', async (req, res) => {
  fetch(previewClient, regionQuery(req.params.region, '!'), res);
});

app.get('/:region', async (req, res) => {
  fetch(productionClient, regionQuery(req.params.region, '!'), res);
});

app.get('/preview/one/:mapPoint/', async (req, res) => {
  fetch(previewClient, mapPoint(req.params.mapPoint), res);
});

app.get('/one/:mapPoint', async (req, res) => {
  fetch(productionClient, mapPoint(req.params.mapPoint), res);
});

//socket v1
io.on('connection', async (socket) => {
  //listens to every mapPoint
  socket.on('listenToAllMapPoints', (pts: string) => {
    socket.join(pts);
    productionClient.listen(mapPoints).subscribe((update) => {
      const result = [update.result].map((v: unknown) => {
        const up = v as MapPoint;
        if (up?.location?.enableMarker) {
          return createAndAddPoint(up);
        } else return update.result;
      }) as Array<MapPoint>;
      io.to(pts).emit('allMapPoints', result[0]);
    });
  });

  //listens to one mapPoint based on the slug value
  socket.on('listenToOneMapPoint', (pts: string) => {
    socket.join(pts);
    productionClient.listen(mapPoint(pts)).subscribe((update) => {
      const result = [update.result].map((v: unknown) => {
        const up = v as MapPoint;
        if (up?.location?.enableMarker) {
          return createAndAddPoint(up);
        } else return update.result;
      });

      io.to(pts).emit('oneMapPoint', result[0]);
    });
  });

  //listens to every mapPoint draft
  socket.on('listenToAllMapPointsDraft', async (pts: string) => {
    socket.join(`${pts}preview`);
    // console.log(pts);
    previewClient.listen(mapPointsPre).subscribe((update) => {
      const result = [update.result].map((v: unknown) => {
        const up = v as MapPoint;
        if (up?.location?.enableMarker) {
          return createAndAddPoint(up);
        } else return update.result;
      });

      io.to(`${pts}preview`).emit('AllPointsDraft', result[0]);
    });
    previewClient.listen(mapPoints).subscribe((update) => {
      const result = [update.result].map((v: unknown) => {
        const up = v as MapPoint;
        if (up?.location?.enableMarker) {
          return createAndAddPoint(up);
        } else return update.result;
      });

      io.to(`${pts}preview`).emit('AllPointsDraft', result[0]);
    });
  });

  //listens to one mapPoint draft based on the slug value
  socket.on('listenToOneMapPointDraft', async (pts: string) => {
    socket.join(`${pts}preview`);
    previewClient.listen(mapPoint(pts)).subscribe((update) => {
      const result = [update.result].map((v: unknown) => {
        const up = v as MapPoint;
        if (up?.location?.enableMarker) {
          return createAndAddPoint(up);
        } else return update.result;
      });

      io.to(`${pts}preview`).emit('oneMapPointDraft', result[0]);
    });
  });

  //listens to one region based on the slug value
  socket.on('listenToRegion', async (pts: string) => {
    // socket.join(pts);
    productionClient.listen(regionQuery(pts, '!')).subscribe(async (update) => {
      if (update.result?.mapPoints) {
        const mapPoints: MapPoint[] = update.result?.mapPoints;
        const data = mapPoints.map((r) => {
          return r._ref;
        });
        await productionClient.fetch(mapPointsUpdate, { ids: data }).then((r) => {
          io.to(pts).emit('RegionWithPoint', r);
        });
      } else {
        io.to(pts).emit('RegionWithPoint', []);
      }
    });
  });

  //listens to one region draft based on the slug value
  socket.on('listenToRegionDraft', async (pts) => {
    socket.join(`${pts}preview`);

    previewClient.listen(regionQuery(pts, '!')).subscribe(async (update) => {
      if (update.result?.mapPoints) {
        const mapPoints: MapPoint[] = update.result?.mapPoints;
        const data = mapPoints.forEach((r) => {
          return r._ref;
        });
        await previewClient.fetch(mapPointsUpdate, { ids: data }).then((r) => {
          io.to(`${pts}preview`).emit('regionDraft', r);
        });
      } else {
        io.to(`${pts}preview`).emit('regionDraft', []);
      }
    });
  });
});

server.listen(port, async () => {
  console.log(`Server is running at http://localhost:${port}`);
});
