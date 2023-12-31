"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
process.env.NODE_ENV !== 'production' && dotenv.config();
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const client_1 = require("./lib/client");
const cors_1 = __importDefault(require("cors"));
const querys_1 = require("./lib/querys");
const fetch_1 = require("./tools/fetch");
const PREVIEW_KEY = process.env.PREVIEW_KEY;
const ACCESS_KEY = process.env.ACCESS_KEY;
const corsOrgins = [
    'http://localhost:4173',
    'http://localhost:5173',
    'https://gaia-maps.vercel.app',
    'https://gaia-maps-sebbetastian.vercel.app',
];
const port = 3000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: corsOrgins,
        methods: ['GET', 'POST'],
    },
});
app.use((0, cors_1.default)({
    origin: corsOrgins,
}));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
//api v1
app.use('/preview', (req, res, next) => {
    const authheader = req.headers.authorization;
    (authheader === null || authheader === void 0 ? void 0 : authheader.replace('token', ' ').trim()) === PREVIEW_KEY ? next() : res.status(400).send('Access denied');
});
app.use('/one', (req, res, next) => {
    const authheader = req.headers.authorization;
    (authheader === null || authheader === void 0 ? void 0 : authheader.replace('token', ' ').trim()) === ACCESS_KEY ? next() : res.status(400).send('Access denied');
});
app.get('/preview/:region/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, fetch_1.fetch)(client_1.previewClient, (0, querys_1.regionQuery)(req.params.region, '!'), res);
}));
app.get('/:region', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, fetch_1.fetch)(client_1.productionClient, (0, querys_1.regionQuery)(req.params.region, '!'), res);
}));
app.get('/preview/one/:mapPoint/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, fetch_1.fetch)(client_1.previewClient, (0, querys_1.mapPoint)(req.params.mapPoint), res);
}));
app.get('/one/:mapPoint', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, fetch_1.fetch)(client_1.productionClient, (0, querys_1.mapPoint)(req.params.mapPoint), res);
}));
//socket v1
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    //listens to every mapPoint
    socket.on('listenToAllMapPoints', (pts) => {
        socket.join(pts);
        client_1.productionClient.listen(querys_1.mapPoints).subscribe((update) => {
            const result = [update.result].map((v) => {
                var _a;
                const up = v;
                if ((_a = up === null || up === void 0 ? void 0 : up.location) === null || _a === void 0 ? void 0 : _a.enableMarker) {
                    return (0, fetch_1.createAndAddPoint)(up);
                }
                else
                    return update.result;
            });
            io.to(pts).emit('allMapPoints', result[0]);
        });
    });
    //listens to one mapPoint based on the slug value
    socket.on('listenToOneMapPoint', (pts) => {
        socket.join(pts);
        client_1.productionClient.listen((0, querys_1.mapPoint)(pts)).subscribe((update) => {
            const result = [update.result].map((v) => {
                var _a;
                const up = v;
                if ((_a = up === null || up === void 0 ? void 0 : up.location) === null || _a === void 0 ? void 0 : _a.enableMarker) {
                    return (0, fetch_1.createAndAddPoint)(up);
                }
                else
                    return update.result;
            });
            io.to(pts).emit('oneMapPoint', result[0]);
        });
    });
    //listens to every mapPoint draft
    socket.on('listenToAllMapPointsDraft', (pts) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(`${pts}preview`);
        // console.log(pts);
        client_1.previewClient.listen(querys_1.mapPointsPre).subscribe((update) => {
            const result = [update.result].map((v) => {
                var _a;
                const up = v;
                if ((_a = up === null || up === void 0 ? void 0 : up.location) === null || _a === void 0 ? void 0 : _a.enableMarker) {
                    return (0, fetch_1.createAndAddPoint)(up);
                }
                else
                    return update.result;
            });
            io.to(`${pts}preview`).emit('AllPointsDraft', result[0]);
        });
        client_1.previewClient.listen(querys_1.mapPoints).subscribe((update) => {
            const result = [update.result].map((v) => {
                var _a;
                const up = v;
                if ((_a = up === null || up === void 0 ? void 0 : up.location) === null || _a === void 0 ? void 0 : _a.enableMarker) {
                    return (0, fetch_1.createAndAddPoint)(up);
                }
                else
                    return update.result;
            });
            io.to(`${pts}preview`).emit('AllPointsDraft', result[0]);
        });
    }));
    //listens to one mapPoint draft based on the slug value
    socket.on('listenToOneMapPointDraft', (pts) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(`${pts}preview`);
        client_1.previewClient.listen((0, querys_1.mapPoint)(pts)).subscribe((update) => {
            const result = [update.result].map((v) => {
                var _a;
                const up = v;
                if ((_a = up === null || up === void 0 ? void 0 : up.location) === null || _a === void 0 ? void 0 : _a.enableMarker) {
                    return (0, fetch_1.createAndAddPoint)(up);
                }
                else
                    return update.result;
            });
            io.to(`${pts}preview`).emit('oneMapPointDraft', result[0]);
        });
    }));
    //listens to one region based on the slug value
    socket.on('listenToRegion', (pts) => __awaiter(void 0, void 0, void 0, function* () {
        // socket.join(pts);
        client_1.productionClient.listen((0, querys_1.regionQuery)(pts, '!')).subscribe((update) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if ((_a = update.result) === null || _a === void 0 ? void 0 : _a.mapPoints) {
                const mapPoints = (_b = update.result) === null || _b === void 0 ? void 0 : _b.mapPoints;
                const data = mapPoints.map((r) => {
                    return r._ref;
                });
                yield client_1.productionClient.fetch(querys_1.mapPointsUpdate, { ids: data }).then((r) => {
                    io.to(pts).emit('RegionWithPoint', r);
                });
            }
            else {
                io.to(pts).emit('RegionWithPoint', []);
            }
        }));
    }));
    //listens to one region draft based on the slug value
    socket.on('listenToRegionDraft', (pts) => __awaiter(void 0, void 0, void 0, function* () {
        socket.join(`${pts}preview`);
        client_1.previewClient.listen((0, querys_1.regionQuery)(pts, '!')).subscribe((update) => __awaiter(void 0, void 0, void 0, function* () {
            var _c, _d;
            if ((_c = update.result) === null || _c === void 0 ? void 0 : _c.mapPoints) {
                const mapPoints = (_d = update.result) === null || _d === void 0 ? void 0 : _d.mapPoints;
                const data = mapPoints.forEach((r) => {
                    return r._ref;
                });
                yield client_1.previewClient.fetch(querys_1.mapPointsUpdate, { ids: data }).then((r) => {
                    io.to(`${pts}preview`).emit('regionDraft', r);
                });
            }
            else {
                io.to(`${pts}preview`).emit('regionDraft', []);
            }
        }));
    }));
}));
server.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running at http://localhost:${port}`);
}));
