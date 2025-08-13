export interface ClassroomData {
  id: string;
  name: string;
  building: string;
  co2: number;
  pm25: number;
  temperature: number;
  humidity: number;
  lastUpdated: Date;
  trend24h: Array<{ time: Date; co2: number; pm25: number; temperature: number; humidity: number }>;
}

export interface Sensor {
  id: string;
  type: 'CO₂' | 'PM2.5' | 'Temperatura' | 'Humedad';
  classroomId: string;
  status: 'active' | 'inactive' | 'maintenance';
  ipAddress: string;
  lastConnection: Date;
}

export interface Alert {
  id: string;
  classroomId: string;
  classroomName: string;
  type: 'co2' | 'pm25' | 'temperature' | 'humidity';
  level: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

// Generate mock trend data for the last 24 hours
const generateTrendData = () => {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time,
      co2: 400 + Math.random() * 800, // 400-1200 ppm
      pm25: Math.random() * 50, // 0-50 μg/m³
      temperature: 20 + Math.random() * 8, // 20-28°C
      humidity: 40 + Math.random() * 40, // 40-80%
    });
  }
  return data;
};

export const mockClassrooms: ClassroomData[] = [
  {
    id: '1',
    name: 'Aula 101',
    building: 'Edificio A',
    co2: 650,
    pm25: 15,
    temperature: 23.5,
    humidity: 55,
    lastUpdated: new Date(),
    trend24h: generateTrendData(),
  },
  {
    id: '2',
    name: 'Aula 102',
    building: 'Edificio A',
    co2: 890,
    pm25: 28,
    temperature: 24.8,
    humidity: 62,
    lastUpdated: new Date(),
    trend24h: generateTrendData(),
  },
  {
    id: '3',
    name: 'Laboratorio 201',
    building: 'Edificio B',
    co2: 1150,
    pm25: 35,
    temperature: 22.1,
    humidity: 48,
    lastUpdated: new Date(),
    trend24h: generateTrendData(),
  },
  {
    id: '4',
    name: 'Aula Magna',
    building: 'Edificio C',
    co2: 420,
    pm25: 8,
    temperature: 23.2,
    humidity: 58,
    lastUpdated: new Date(),
    trend24h: generateTrendData(),
  },
  {
    id: '5',
    name: 'Aula 301',
    building: 'Edificio B',
    co2: 780,
    pm25: 22,
    temperature: 25.1,
    humidity: 65,
    lastUpdated: new Date(),
    trend24h: generateTrendData(),
  },
  {
    id: '6',
    name: 'Sala de Conferencias',
    building: 'Edificio C',
    co2: 520,
    pm25: 12,
    temperature: 22.8,
    humidity: 51,
    lastUpdated: new Date(),
    trend24h: generateTrendData(),
  },
];

export const mockSensors: Sensor[] = [
  { id: '1', type: 'CO₂', classroomId: '1', status: 'active', ipAddress: '192.168.1.101', lastConnection: new Date() },
  { id: '2', type: 'PM2.5', classroomId: '1', status: 'active', ipAddress: '192.168.1.102', lastConnection: new Date() },
  { id: '3', type: 'Temperatura', classroomId: '1', status: 'active', ipAddress: '192.168.1.103', lastConnection: new Date() },
  { id: '4', type: 'Humedad', classroomId: '1', status: 'maintenance', ipAddress: '192.168.1.104', lastConnection: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: '5', type: 'CO₂', classroomId: '2', status: 'active', ipAddress: '192.168.1.201', lastConnection: new Date() },
  { id: '6', type: 'PM2.5', classroomId: '2', status: 'active', ipAddress: '192.168.1.202', lastConnection: new Date() },
  { id: '7', type: 'Temperatura', classroomId: '2', status: 'active', ipAddress: '192.168.1.203', lastConnection: new Date() },
  { id: '8', type: 'Humedad', classroomId: '2', status: 'active', ipAddress: '192.168.1.204', lastConnection: new Date() },
  { id: '9', type: 'CO₂', classroomId: '3', status: 'active', ipAddress: '192.168.1.301', lastConnection: new Date() },
  { id: '10', type: 'PM2.5', classroomId: '3', status: 'inactive', ipAddress: '192.168.1.302', lastConnection: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: '11', type: 'Temperatura', classroomId: '3', status: 'active', ipAddress: '192.168.1.303', lastConnection: new Date() },
  { id: '12', type: 'Humedad', classroomId: '3', status: 'active', ipAddress: '192.168.1.304', lastConnection: new Date() },
  { id: '13', type: 'CO₂', classroomId: '4', status: 'active', ipAddress: '192.168.1.401', lastConnection: new Date() },
  { id: '14', type: 'PM2.5', classroomId: '4', status: 'active', ipAddress: '192.168.1.402', lastConnection: new Date() },
  { id: '15', type: 'Temperatura', classroomId: '4', status: 'active', ipAddress: '192.168.1.403', lastConnection: new Date() },
  { id: '16', type: 'Humedad', classroomId: '4', status: 'active', ipAddress: '192.168.1.404', lastConnection: new Date() },
  { id: '17', type: 'CO₂', classroomId: '5', status: 'active', ipAddress: '192.168.1.501', lastConnection: new Date() },
  { id: '18', type: 'PM2.5', classroomId: '5', status: 'active', ipAddress: '192.168.1.502', lastConnection: new Date() },
  { id: '19', type: 'Temperatura', classroomId: '5', status: 'active', ipAddress: '192.168.1.503', lastConnection: new Date() },
  { id: '20', type: 'Humedad', classroomId: '5', status: 'active', ipAddress: '192.168.1.504', lastConnection: new Date() },
  { id: '21', type: 'CO₂', classroomId: '6', status: 'active', ipAddress: '192.168.1.601', lastConnection: new Date() },
  { id: '22', type: 'PM2.5', classroomId: '6', status: 'active', ipAddress: '192.168.1.602', lastConnection: new Date() },
  { id: '23', type: 'Temperatura', classroomId: '6', status: 'active', ipAddress: '192.168.1.603', lastConnection: new Date() },
  { id: '24', type: 'Humedad', classroomId: '6', status: 'active', ipAddress: '192.168.1.604', lastConnection: new Date() },
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    classroomId: '3',
    classroomName: 'Laboratorio 201',
    type: 'co2',
    level: 'critical',
    message: 'Nivel de CO₂ crítico: 1150 ppm',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    resolved: false,
  },
  {
    id: '2',
    classroomId: '2',
    classroomName: 'Aula 102',
    type: 'pm25',
    level: 'medium',
    message: 'PM2.5 elevado: 28 μg/m³',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    resolved: false,
  },
  {
    id: '3',
    classroomId: '5',
    classroomName: 'Aula 301',
    type: 'humidity',
    level: 'low',
    message: 'Humedad alta: 65%',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    resolved: false,
  },
  {
    id: '4',
    classroomId: '1',
    classroomName: 'Aula 101',
    type: 'temperature',
    level: 'low',
    message: 'Temperatura revisada',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    resolved: true,
  },
];

export const getQualityLevel = (type: string, value: number): 'good' | 'moderate' | 'poor' | 'critical' => {
  switch (type) {
    case 'co2':
      if (value < 600) return 'good';
      if (value < 800) return 'moderate';
      if (value < 1000) return 'poor';
      return 'critical';
    case 'pm25':
      if (value < 12) return 'good';
      if (value < 25) return 'moderate';
      if (value < 35) return 'poor';
      return 'critical';
    case 'temperature':
      if (value >= 20 && value <= 25) return 'good';
      if (value >= 18 && value <= 28) return 'moderate';
      if (value >= 15 && value <= 30) return 'poor';
      return 'critical';
    case 'humidity':
      if (value >= 40 && value <= 60) return 'good';
      if (value >= 30 && value <= 70) return 'moderate';
      if (value >= 20 && value <= 80) return 'poor';
      return 'critical';
    default:
      return 'good';
  }
};

export const getQualityColor = (level: string): string => {
  switch (level) {
    case 'good': return 'text-green-600 bg-green-50 border-green-200';
    case 'moderate': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'poor': return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};