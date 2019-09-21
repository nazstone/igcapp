
const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

exports.distance = (lat_a, lng_a, lat_b, lng_b ) => {
    const earthRadius = 3958.75;
    const latDiff = toRadians(lat_b-lat_a);
    const lngDiff = toRadians(lng_b-lng_a);
    const a = Math.sin(latDiff /2) * Math.sin(latDiff /2) +
    Math.cos(toRadians(lat_a)) * Math.cos(toRadians(lat_b)) *
    Math.sin(lngDiff /2) * Math.sin(lngDiff /2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = earthRadius * c;

    const meterConversion = 1609;

    return distance * meterConversion;
};
