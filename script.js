// Generate a random ticket ID
const generateTicketId = () => {
  return 'P2K25-' + Math.random().toString(36).substring(2, 10).toUpperCase();
};

// Form Submission Event
document.getElementById('ticketForm').addEventListener('submit', (e) => {
  e.preventDefault();

  // Get Form Inputs
  const eventName = document.getElementById('eventName').value.trim();
  const teamMembers = document.getElementById('teamMembers').value.trim();

  // Validate Inputs
  if (!eventName || !teamMembers) {
    alert('Please fill out all fields!');
    return;
  }

  // Update Ticket Content
  document.getElementById('displayEventName').innerText = eventName;
  document.getElementById('displayTeamMembers').innerText = teamMembers;

  // Generate Ticket ID
  const ticketId = generateTicketId();
  document.getElementById('ticketId').innerText = ticketId;

  // Generate QR Code
  const qrCodeContainer = document.getElementById('qrcode');
  qrCodeContainer.innerHTML = ''; // Clear existing QR Code
  new QRCode(qrCodeContainer, {
    text: ticketId,
    width: 100,
    height: 100,
  });
});

// Download Ticket as PDF
document.getElementById('downloadTicket').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;

  // Create a new jsPDF instance for an A4 sheet
  const doc = new jsPDF('portrait', 'pt', 'a4');

  const a4Width = 595.28; // A4 width in points
  const a4Height = 841.89; // A4 height in points

  // Get the ticket element dimensions dynamically
  const ticketElement = document.querySelector('.ticket');
  const ticketRect = ticketElement.getBoundingClientRect();
  const ticketWidth = ticketRect.width; // Get ticket width in pixels
  const ticketHeight = ticketRect.height; // Get ticket height in pixels

  // Calculate scale factors for width and height
  const scaleWidth = a4Width / ticketWidth;
  const scaleHeight = a4Height / ticketHeight;

  // Use the smaller scale to ensure the ticket fits within A4
  const scale = Math.min(scaleWidth, scaleHeight);

  // New dimensions for the ticket
  const scaledWidth = ticketWidth * scale;
  const scaledHeight = ticketHeight * scale;

  // Center the ticket within the A4 sheet
  const xOffset = (a4Width - scaledWidth) / 2; // Horizontal centering
  const yOffset = (a4Height - scaledHeight) / 4; // Vertical centering

  // Capture the ticket content using html2canvas
  html2canvas(ticketElement, {
    scale: 2, // Higher resolution
  }).then((canvas) => {
    const imgData = canvas.toDataURL('image/png'); // Get the image data

    // Add the image to the PDF
    doc.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);
    doc.save(`${document.getElementById('ticketId').innerText}.pdf`); // Save as PDF
  }).catch((error) => {
    console.error('Error generating the ticket image:', error);
    alert('Could not download the ticket. Please try again.');
  });
});
