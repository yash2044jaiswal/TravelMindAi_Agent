import PDFDocument from 'pdfkit';

/**
 * Handles server-side dynamic PDF formatting and compilation.
 */
class PdfGeneratorService {
  /**
   * Builds and formats the PDF stream.
   * @param {Object} trip - The trip document populated from Mongoose
   * @param {res} responseStream - Express HTTP write stream response object
   */
  generateTripPdf(trip, responseStream) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Pipe outputs directly to express response stream
    doc.pipe(responseStream);

    // --- HEADER DESIGN ---
    doc
      .fillColor('#1e293b')
      .fontSize(26)
      .font('Helvetica-Bold')
      .text('TravelMind AI Agent', { align: 'center' });

    doc
      .fontSize(12)
      .fillColor('#64748b')
      .font('Helvetica')
      .text('Your Smart Autonomous Travel Partner', { align: 'center' })
      .moveDown(1.5);

    // Dynamic horizontal line separator
    doc
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .strokeColor('#cbd5e1')
      .lineWidth(1)
      .stroke()
      .moveDown(1);

    // --- TRIP OVERVIEW ---
    doc
      .fontSize(16)
      .fillColor('#0f172a')
      .font('Helvetica-Bold')
      .text(`Itinerary: ${trip.source} to ${trip.destination}`, { underline: false })
      .moveDown(0.5);

    doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#334155');

    const metaY = doc.y;
    doc.text(`Duration: ${trip.days} Days`, 50, metaY);
    doc.text(`Travelers: ${trip.travelers} Guest(s)`, 200, metaY);
    doc.text(`Limit Budget: ₹${trip.budget}`, 350, metaY);
    doc.moveDown(1.5);

    // --- ESTIMATED COST BREAKDOWN BOX ---
    doc
      .rect(50, doc.y, 495, 105)
      .fill('#f8fafc')
      .stroke('#e2e8f0');

    const boxY = doc.y + 10;
    doc
      .fillColor('#1e293b')
      .font('Helvetica-Bold')
      .fontSize(12)
      .text('Budget Optimization & Estimated Costs', 65, boxY);

    doc.font('Helvetica').fontSize(10).fillColor('#475569');
    doc.text(`• Ground/Air Transport: ₹${trip.totalCost?.transport || 0}`, 65, boxY + 22);
    doc.text(`• Accommodations: ₹${trip.totalCost?.hotel || 0}`, 65, boxY + 37);
    doc.text(`• Food & Dining: ₹${trip.totalCost?.food || 0}`, 65, boxY + 52);
    doc.text(`• Sightseeing & Extras: ₹${trip.totalCost?.activities || 0}`, 65, boxY + 67);

    doc
      .font('Helvetica-Bold')
      .fillColor('#0284c7')
      .text(`Estimated Total Outlay: ₹${trip.totalCost?.total || 0}`, 280, boxY + 67, { align: 'right', width: 250 });

    doc.moveDown(7.5);

    // --- SELECTED LODGING SECTIONS ---
    doc
      .fillColor('#0f172a')
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Selected Lodging Details')
      .moveDown(0.4);

    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor('#334155')
      .text(`Stay category: ${trip.logistics?.accommodationSuggestions?.[0] || `${trip.itinerary?.[0]?.accommodation || 'Accommodation as per itinerary'}`}`)
      .text(`Estimated Nightly Budget Rate: ₹${trip.totalCost?.hotel ? Math.round(trip.totalCost.hotel / trip.days) : 'Variable'}/night`)
      .moveDown(1.5);

    // --- DAY WISE PLANNER ---
    doc
      .fillColor('#0f172a')
      .font('Helvetica-Bold')
      .fontSize(14)
      .text('Detailed Day-by-Day Travel Plan')
      .moveDown(0.5);

    if (trip.itinerary && trip.itinerary.length > 0) {
      trip.itinerary.forEach((dayPlan) => {
        // Prevent layout spilling over margins
        if (doc.y > 650) {
          doc.addPage();
        }

        doc
          .fillColor('#0369a1')
          .font('Helvetica-Bold')
          .fontSize(12)
          .text(`Day ${dayPlan.day}: ${dayPlan.title}`)
          .moveDown(0.3);

        doc
          .fillColor('#334155')
          .font('Helvetica-Bold')
          .fontSize(10)
          .text(`Activities:`);

        dayPlan.activities.forEach((act) => {
          doc
            .font('Helvetica')
            .fontSize(9.5)
            .text(`  - ${act}`);
        });

        doc
          .font('Helvetica-Oblique')
          .fillColor('#64748b')
          .text(`Stay overnight: ${dayPlan.accommodation || 'Selected Accommodations'}`)
          .moveDown(1);
      });
    }

    // Add page if needed for recommendations and tips
    if (doc.y > 550) {
      doc.addPage();
    }

    // --- FINAL RECOMMENDATIONS & CONTACTS ---
    doc
      .fillColor('#0f172a')
      .font('Helvetica-Bold')
      .fontSize(13)
      .text('TravelMind Agent Safety Tips & Guidelines')
      .moveDown(0.4);

    if (trip.recommendations && trip.recommendations.length > 0) {
      trip.recommendations.forEach((rec) => {
        doc
          .font('Helvetica')
          .fontSize(9.5)
          .fillColor('#475569')
          .text(`• ${rec}`);
      });
    }

    doc.moveDown(1);

    // Footer signature stamp
    doc
      .moveTo(50, doc.y + 20)
      .lineTo(545, doc.y + 20)
      .strokeColor('#cbd5e1')
      .lineWidth(0.5)
      .stroke();

    const footerY = doc.y + 30;
    doc
      .fontSize(8)
      .fillColor('#94a3b8')
      .text('This autonomous plan was built using real-time insights from Google Gemini AI.', 50, footerY, { align: 'center' });

    // End stream build
    doc.end();
  }
}

export default new PdfGeneratorService();