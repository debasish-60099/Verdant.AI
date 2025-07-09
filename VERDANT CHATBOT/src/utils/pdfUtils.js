import jsPDF from 'jspdf';

// Generate PDF report from conversation
export const generateConversationPDF = (conversation, language = 'en') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Set font for better Unicode support
  doc.setFont('helvetica');

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  const title = getLocalizedText('chatReport', language);
  doc.text(title, margin, yPosition);
  yPosition += 15;

  // Date
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const dateText = `${getLocalizedText('generatedOn', language)}: ${new Date().toLocaleString()}`;
  doc.text(dateText, margin, yPosition);
  yPosition += 20;

  // Messages
  conversation.messages.forEach((message, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    // Message header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const roleText = message.role === 'user' 
      ? getLocalizedText('user', language) 
      : getLocalizedText('assistant', language);
    doc.text(`${roleText}:`, margin, yPosition);
    yPosition += 10;

    // Message content
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    // Split text to fit page width
    const lines = doc.splitTextToSize(message.content, maxWidth);
    
    // Check if content fits on current page
    if (yPosition + (lines.length * 6) > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
    
    lines.forEach(line => {
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });
    
    yPosition += 10; // Space between messages
  });

  return doc;
};

// Download conversation as PDF
export const downloadConversationPDF = (conversation, language = 'en') => {
  try {
    const doc = generateConversationPDF(conversation, language);
    const filename = `${getLocalizedText('chatReport', language)}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

// Download single message as PDF
export const downloadMessagePDF = (message, language = 'en') => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Set font
    doc.setFont('helvetica');

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    const title = getLocalizedText('messageReport', language);
    doc.text(title, margin, yPosition);
    yPosition += 15;

    // Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const dateText = `${getLocalizedText('generatedOn', language)}: ${new Date().toLocaleString()}`;
    doc.text(dateText, margin, yPosition);
    yPosition += 20;

    // Message content
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(message.content, maxWidth);
    
    lines.forEach(line => {
      if (yPosition > doc.internal.pageSize.height - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 7;
    });

    const filename = `${getLocalizedText('messageReport', language)}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating message PDF:', error);
    return false;
  }
};

// Localized text helper
const getLocalizedText = (key, language) => {
  const translations = {
    en: {
      chatReport: 'Chat Report',
      messageReport: 'Message Report',
      generatedOn: 'Generated on',
      user: 'User',
      assistant: 'Assistant'
    },
    hi: {
      chatReport: 'चैट रिपोर्ट',
      messageReport: 'संदेश रिपोर्ट',
      generatedOn: 'उत्पन्न किया गया',
      user: 'उपयोगकर्ता',
      assistant: 'सहायक'
    },
    bn: {
      chatReport: 'চ্যাট রিপোর্ট',
      messageReport: 'বার্তা রিপোর্ট',
      generatedOn: 'তৈরি হয়েছে',
      user: 'ব্যবহারকারী',
      assistant: 'সহায়ক'
    }
  };

  return translations[language]?.[key] || translations.en[key];
};

