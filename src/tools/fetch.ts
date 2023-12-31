import { SanityClient } from '@sanity/client';
import { Response } from 'express';
import * as turf from 'turf';
import { MapPoint, MapPointMarker } from '../types/IMap';

export const createAndAddPoint = (v: MapPoint) => {
  const point = turf.point([v.location.center.lng, v.location.center.lat]);
  const result = { ...v, marker: point };
  return result;
};

export const fetch = async (client: SanityClient, query: string, res: Response) => {
  return await client.fetch(query).then(async (p: MapPoint[]) => {
    if (!p[0]?.Points) {
      const point = p.map((v: MapPoint) => {
        if (v?.location?.enableMarker) {
          return createAndAddPoint(v);
        }
      });
      point[0] ? res.json(point) : res.json(p);
    } else {
      const mapPoints: MapPointMarker[] = [];

      const point = p[0].Points.map((v) => {
        if (v?.location?.enableMarker) {
          return createAndAddPoint(v);
        } else if (!v?.location?.enableMarker && v !== null) {
          return v;
        }
      }) as Array<MapPoint>;

      p.map((pnt: MapPoint) => {
        mapPoints.push({
          title: pnt.title,
          slug: pnt.slug,
          Points: point,
        });
      });

      res.json(mapPoints);
    }
  });
};
