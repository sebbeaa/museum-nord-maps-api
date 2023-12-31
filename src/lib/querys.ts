export const mapPointsPre = `*[_type == "mapPoint" && ((_id in path("drafts.**")))]{
    body,
    "imageUrl": mainImage.asset->url,
    title,
    _id,
    location,
    geoUrl,
    enable,
    geoData,
    _type,
    
}` as string;

export const mapPoint = (region: string) => {
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
    
}` as string;
};

export const mapPointPre = `*[_type == "mapPoint" && ((_id in path("drafts.**")))]{
    body,
    "imageUrl": mainImage.asset->url,
    title,
    _id,
    location,
    geoUrl,
    enable,
    geoData,
    _type,
    
}` as string;

export const mapPoints = `*[_type == "mapPoint" && (!(_id in path("drafts.**")))]{
    body,
    "imageUrl": mainImage.asset->url,
    title,
    _id,
    location,
    geoUrl,
    enable,
    geoData,
    _type,
    
}` as string;

export const mapPointsUpdate = `*[_id in $ids] {
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

export const regionQuery = (region: string, pre: string) => {
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
