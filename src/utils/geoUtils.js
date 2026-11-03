// Sunrise Junior College, Srikakulam GPS Coordinates
export const COLLEGE_LOCATION = {
  lat: 18.306922,
  lng: 83.893685,
  name: "Sunrise Junior College, Day & Night Junction, Srikakulam",
  allowedRadiusMeters: 50 // 50 meters geofence radius as requested
};

// Calculate distance between two coordinates in meters using Haversine formula
export function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const toRad = (angle) => (angle * Math.PI) / 180;
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance);
}

// Generate direct WhatsApp link
export function createWhatsAppLink(phoneNumber, message) {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const internationalPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${internationalPhone}?text=${encodedMsg}`;
}
