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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetch = exports.createAndAddPoint = void 0;
const turf = __importStar(require("turf"));
const createAndAddPoint = (v) => {
    const point = turf.point([v.location.center.lng, v.location.center.lat]);
    const result = Object.assign(Object.assign({}, v), { marker: point });
    return result;
};
exports.createAndAddPoint = createAndAddPoint;
const fetch = (client, query, res) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client.fetch(query).then((p) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!((_a = p[0]) === null || _a === void 0 ? void 0 : _a.Points)) {
            const point = p.map((v) => {
                var _a;
                if ((_a = v === null || v === void 0 ? void 0 : v.location) === null || _a === void 0 ? void 0 : _a.enableMarker) {
                    return (0, exports.createAndAddPoint)(v);
                }
            });
            point[0] ? res.json(point) : res.json(p);
        }
        else {
            const mapPoints = [];
            const point = p[0].Points.map((v) => {
                var _a, _b;
                if ((_a = v === null || v === void 0 ? void 0 : v.location) === null || _a === void 0 ? void 0 : _a.enableMarker) {
                    return (0, exports.createAndAddPoint)(v);
                }
                else if (!((_b = v === null || v === void 0 ? void 0 : v.location) === null || _b === void 0 ? void 0 : _b.enableMarker) && v !== null) {
                    return v;
                }
            });
            p.map((pnt) => {
                mapPoints.push({
                    title: pnt.title,
                    slug: pnt.slug,
                    Points: point,
                });
            });
            res.json(mapPoints);
        }
    }));
});
exports.fetch = fetch;
