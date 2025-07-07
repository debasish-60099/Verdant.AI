import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const pdfService = {
  // Generate weather report PDF
  async generateWeatherReport(weatherData, location) {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Set up fonts and colors
    pdf.setFont('helvetica');
    
    // Header
    pdf.setFillColor(34, 197, 94); // Verdant green
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Logo area (placeholder)
    pdf.setFillColor(255, 255, 255, 0.2);
    pdf.rect(15, 10, 20, 20, 'F');
    
    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Verdant AI Weather Report', 45, 20);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}`, 45, 28);
    
    // Location
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Location: ${location}`, 15, 55);
    
    // Current Weather Section
    let yPosition = 70;
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Current Weather', 15, yPosition);
    
    yPosition += 15;
    
    // Current weather details
    const currentWeather = weatherData.current || {};
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    const currentDetails = [
      `Temperature: ${currentWeather.temp || 'N/A'}°C`,
      `Condition: ${currentWeather.condition || 'N/A'}`,
      `Feels Like: ${currentWeather.feelsLike || 'N/A'}°C`,
      `Humidity: ${currentWeather.humidity || 'N/A'}%`,
      `Wind Speed: ${currentWeather.windSpeed || 'N/A'} km/h`,
      `Visibility: ${currentWeather.visibility || 'N/A'} km`,
      `Pressure: ${currentWeather.pressure || 'N/A'} hPa`,
      `UV Index: ${currentWeather.uvIndex || 'N/A'}`
    ];
    
    currentDetails.forEach(detail => {
      pdf.text(detail, 20, yPosition);
      yPosition += 8;
    });
    
    // Hourly Forecast Section
    yPosition += 10;
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Hourly Forecast', 15, yPosition);
    
    yPosition += 15;
    
    if (weatherData.hourly && weatherData.hourly.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      
      // Table headers
      const headers = ['Time', 'Temperature', 'Condition', 'Rain Chance'];
      const colWidths = [30, 30, 60, 30];
      let xPosition = 15;
      
      headers.forEach((header, index) => {
        pdf.text(header, xPosition, yPosition);
        xPosition += colWidths[index];
      });
      
      yPosition += 8;
      
      // Draw line under headers
      pdf.setLineWidth(0.5);
      pdf.line(15, yPosition - 2, pageWidth - 15, yPosition - 2);
      
      pdf.setFont('helvetica', 'normal');
      
      weatherData.hourly.slice(0, 6).forEach(hour => {
        xPosition = 15;
        const rowData = [
          hour.time || 'N/A',
          `${hour.temp || 'N/A'}°C`,
          hour.condition || 'N/A',
          `${hour.chanceOfRain || 0}%`
        ];
        
        rowData.forEach((data, index) => {
          pdf.text(data, xPosition, yPosition);
          xPosition += colWidths[index];
        });
        
        yPosition += 8;
      });
    }
    
    // 5-Day Forecast Section
    yPosition += 15;
    
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('5-Day Forecast', 15, yPosition);
    
    yPosition += 15;
    
    if (weatherData.forecast && weatherData.forecast.length > 0) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      
      // Table headers
      const forecastHeaders = ['Day', 'High', 'Low', 'Condition'];
      const forecastColWidths = [40, 25, 25, 70];
      let xPos = 15;
      
      forecastHeaders.forEach((header, index) => {
        pdf.text(header, xPos, yPosition);
        xPos += forecastColWidths[index];
      });
      
      yPosition += 8;
      
      // Draw line under headers
      pdf.line(15, yPosition - 2, pageWidth - 15, yPosition - 2);
      
      pdf.setFont('helvetica', 'normal');
      
      weatherData.forecast.forEach(day => {
        xPos = 15;
        const forecastData = [
          day.day || 'N/A',
          `${day.high || 'N/A'}°C`,
          `${day.low || 'N/A'}°C`,
          day.condition || 'N/A'
        ];
        
        forecastData.forEach((data, index) => {
          pdf.text(data, xPos, yPosition);
          xPos += forecastColWidths[index];
        });
        
        yPosition += 8;
      });
    }
    
    // Alerts Section (if any)
    if (weatherData.alerts && weatherData.alerts.length > 0) {
      yPosition += 15;
      
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(220, 38, 38); // Red color for alerts
      pdf.text('Weather Alerts', 15, yPosition);
      
      yPosition += 15;
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(0, 0, 0);
      
      weatherData.alerts.forEach(alert => {
        pdf.text(`• ${alert.headline || alert.event || 'Weather Alert'}`, 20, yPosition);
        yPosition += 8;
        
        if (alert.desc) {
          const splitDesc = pdf.splitTextToSize(alert.desc, pageWidth - 40);
          pdf.text(splitDesc, 25, yPosition);
          yPosition += splitDesc.length * 6;
        }
        
        yPosition += 5;
      });
    }
    
    // Footer
    const footerY = pageHeight - 20;
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text('Generated by Verdant AI Weather Forecasting System', 15, footerY);
    pdf.text(`Report generated at ${new Date().toLocaleTimeString()}`, pageWidth - 60, footerY);
    
    // Save the PDF
    const fileName = `weather-report-${location.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    return fileName;
  },

  // Generate PDF from HTML element (alternative method)
  async generateFromElement(elementId, filename = 'weather-report.pdf') {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
      return filename;
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw error;
    }
  }
};

