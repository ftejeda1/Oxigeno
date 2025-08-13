import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { ClassroomData, Alert } from './mockData';

export const exportToPDF = (classrooms: ClassroomData[], alerts: Alert[]) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Reporte de Calidad del Aire', 20, 20);
  
  // Date
  doc.setFontSize(12);
  doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 20, 35);
  
  // Summary
  doc.setFontSize(14);
  doc.text('Resumen de Aulas', 20, 50);
  
  let yPosition = 65;
  doc.setFontSize(10);
  
  classrooms.forEach((classroom) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.text(`${classroom.name} (${classroom.building})`, 20, yPosition);
    doc.text(`CO₂: ${classroom.co2} ppm`, 20, yPosition + 10);
    doc.text(`PM2.5: ${classroom.pm25} μg/m³`, 80, yPosition + 10);
    doc.text(`Temp: ${classroom.temperature}°C`, 20, yPosition + 20);
    doc.text(`Humedad: ${classroom.humidity}%`, 80, yPosition + 20);
    
    yPosition += 35;
  });
  
  // Alerts section
  if (alerts.length > 0) {
    doc.addPage();
    doc.setFontSize(14);
    doc.text('Alertas Activas', 20, 20);
    
    yPosition = 35;
    doc.setFontSize(10);
    
    alerts.filter(alert => !alert.resolved).forEach((alert) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${alert.classroomName}: ${alert.message}`, 20, yPosition);
      doc.text(`Nivel: ${alert.level} - ${alert.timestamp.toLocaleString('es-ES')}`, 20, yPosition + 10);
      
      yPosition += 25;
    });
  }
  
  doc.save('reporte-calidad-aire.pdf');
};

export const exportToExcel = (classrooms: ClassroomData[], alerts: Alert[]) => {
  const wb = XLSX.utils.book_new();
  
  // Classroom data sheet
  const classroomData = classrooms.map(classroom => ({
    'Aula': classroom.name,
    'Edificio': classroom.building,
    'CO₂ (ppm)': classroom.co2,
    'PM2.5 (μg/m³)': classroom.pm25,
    'Temperatura (°C)': classroom.temperature,
    'Humedad (%)': classroom.humidity,
    'Última Actualización': classroom.lastUpdated.toLocaleString('es-ES')
  }));
  
  const ws1 = XLSX.utils.json_to_sheet(classroomData);
  XLSX.utils.book_append_sheet(wb, ws1, 'Datos de Aulas');
  
  // Alerts data sheet
  const alertsData = alerts.map(alert => ({
    'Aula': alert.classroomName,
    'Tipo': alert.type,
    'Nivel': alert.level,
    'Mensaje': alert.message,
    'Fecha': alert.timestamp.toLocaleString('es-ES'),
    'Resuelto': alert.resolved ? 'Sí' : 'No'
  }));
  
  const ws2 = XLSX.utils.json_to_sheet(alertsData);
  XLSX.utils.book_append_sheet(wb, ws2, 'Alertas');
  
  XLSX.writeFile(wb, 'reporte-calidad-aire.xlsx');
};