
const toRadians = (degrees) => degrees * (Math.PI / 180);

exports.distance = (latA, lngA, latB, lngB) => {
  const earthRadius = 3958.75;
  const latDiff = toRadians(latB - latA);
  const lngDiff = toRadians(lngB - lngA);
  const a = Math.sin(latDiff / 2) * Math.sin(latDiff / 2)
    + Math.cos(toRadians(latA)) * Math.cos(toRadians(latB))
    * Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;

  const meterConversion = 1609;

  return distance * meterConversion;
};
