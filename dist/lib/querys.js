"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.regionQuery = exports.mapPointsUpdate = exports.mapPoints = exports.mapPointPre = exports.mapPoint = exports.mapPointsPre = void 0;
exports.mapPointsPre = `*[_type == "mapPoint" && ((_id in path("drafts.**")))]{
    body,
    "imageUrl": mainImage.asset->url,
    title,
    _id,
    location,
    geoUrl,
    enable,
    geoData,
    _type,
    
}`;
const mapPoint = (region) => {
    return `*[_type == "mapPoint" && slug.current == "${region}"]{
    body,
    mainImage,
    title,
    _id,
    location,
    enable,
    slug,
    geoUrl,
    geoData,
    _type,
    
}`;
};
exports.mapPoint = mapPoint;
exports.mapPointPre = `*[_type == "mapPoint" && ((_id in path("drafts.**")))]{
    body,
    "imageUrl": mainImage.asset->url,
    title,
    _id,
    location,
    geoUrl,
    enable,
    geoData,
    _type,
    
}`;
exports.mapPoints = `*[_type == "mapPoint" && (!(_id in path("drafts.**")))]{
    body,
    "imageUrl": mainImage.asset->url,
    title,
    _id,
    location,
    geoUrl,
    enable,
    geoData,
    _type,
    
}`;
exports.mapPointsUpdate = `*[_id in $ids] {
    "imageUrl": mainImage.asset->url,
    body,
       title,
       location,
       geoUrl,
       geoData,
       enable,
       _id,
       _type,
}`;
const regionQuery = (region, pre) => {
    return `*[slug.current == "${region}" && (${pre}(_id in path("drafts.**")))] {
        "title": title,
        "slug": slug,
        'Points': mapPoints[] -> {
          _id,
          _rev,
        title,
        location,
        geoUrl,
        enable,
        geoData,
        body,
        mainImage,
        } 
    }`;
};
exports.regionQuery = regionQuery;
