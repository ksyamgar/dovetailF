import { Project } from '@/types/project';

export interface Office {
  id: string;
  name: string;
  type: string;
  isMain: boolean;
  address: string;
  location: string;
  lat: number;
  lng: number;
  alt: string;
}

export interface CityMarker {
  name: string;
  country: string;
  isCapital: boolean;
  isBold?: boolean;
  lng: number;
  lat: number;
}

export interface LegendCategory {
  key: string;
  label: string;
  color: string;
  count: number;
}

export const OFFICES: Office[] = [
  {
    id: 'palampur-main',
    name: 'Palampur',
    type: 'Main Studio & Headquarters',
    isMain: true,
    address: 'First Floor, Main Bazaar, Palampur, Himachal Pradesh 176061, India',
    location: 'Palampur, Himachal Pradesh',
    lat: 32.1196,
    lng: 76.5399,
    alt: '1,312 m'
  }
];

export const MAJOR_CITIES: CityMarker[] = [
  // India - Regional Capital & Mountain/Surrounding Hubs
  { name: 'New Delhi', country: 'India', isCapital: true, lng: 77.2090, lat: 28.6139 },
  { name: 'Chandigarh', country: 'India', isCapital: true, lng: 76.7794, lat: 30.7333 },
  { name: 'Shimla', country: 'India', isCapital: true, isBold: true, lng: 77.1734, lat: 31.1048 },
  { name: 'Kangra', country: 'India', isCapital: false, isBold: true, lng: 76.2691, lat: 32.0998 },
  { name: 'Dharamshala', country: 'India', isCapital: false, lng: 76.3234, lat: 32.2190 },
  { name: 'Manali', country: 'India', isCapital: false, lng: 77.1887, lat: 32.2396 },
  { name: 'Leh', country: 'India', isCapital: true, lng: 77.5771, lat: 34.1526 },
  { name: 'Srinagar', country: 'India', isCapital: true, lng: 74.7973, lat: 34.0837 },
  { name: 'Jammu', country: 'India', isCapital: false, lng: 74.8570, lat: 32.7266 },
  { name: 'Dehradun', country: 'India', isCapital: true, lng: 78.0322, lat: 30.3165 },
  { name: 'Rishikesh', country: 'India', isCapital: false, lng: 78.2676, lat: 30.0869 },
  { name: 'Haridwar', country: 'India', isCapital: false, lng: 78.1642, lat: 29.9457 },
  { name: 'Amritsar', country: 'India', isCapital: false, lng: 74.8723, lat: 31.6340 },
  { name: 'Ludhiana', country: 'India', isCapital: false, lng: 75.8573, lat: 30.9010 },
  { name: 'Jalandhar', country: 'India', isCapital: false, lng: 75.5762, lat: 31.3260 },
  { name: 'Jaipur', country: 'India', isCapital: true, lng: 75.7873, lat: 26.9124 },
  { name: 'Lucknow', country: 'India', isCapital: true, lng: 80.9462, lat: 26.8467 },

  // Nepal
  { name: 'Kathmandu', country: 'Nepal', isCapital: true, lng: 85.3240, lat: 27.7172 },
  { name: 'Pokhara', country: 'Nepal', isCapital: false, lng: 83.9856, lat: 28.2096 },
  { name: 'Bharatpur', country: 'Nepal', isCapital: false, lng: 84.4385, lat: 27.6766 },
  { name: 'Butwal', country: 'Nepal', isCapital: false, lng: 83.4485, lat: 27.7006 },
  { name: 'Nepalgunj', country: 'Nepal', isCapital: false, lng: 81.6167, lat: 28.0500 },
  { name: 'Biratnagar', country: 'Nepal', isCapital: false, lng: 87.2718, lat: 26.4525 },
  { name: 'Janakpur', country: 'Nepal', isCapital: false, lng: 85.9246, lat: 26.7288 },
  { name: 'Birgunj', country: 'Nepal', isCapital: false, lng: 84.8767, lat: 27.0167 },
  { name: 'Dhangadhi', country: 'Nepal', isCapital: false, lng: 80.5937, lat: 28.6852 }
];

export const LEGEND_CATEGORIES: LegendCategory[] = [
  { key: 'Hospitality', label: 'HOSPITALITY', color: '#E53935', count: 2 },
  { key: 'Residential', label: 'RESIDENTIAL', color: '#FBC02D', count: 2 },
  { key: 'Conservation', label: 'CONSERVATION', color: '#43A047', count: 3 },
  { key: 'Interiors', label: 'INTERIORS', color: '#8E24AA', count: 2 },
  { key: 'Public', label: 'PUBLIC / SCHOOL', color: '#1E88E5', count: 1 },
  { key: 'Planning', label: 'PLANNING / GHAT', color: '#FB8C00', count: 1 }
];
