import html2pdf from 'html2pdf.js'

export const exportToPDF = async (element, filename = 'travel-plan.pdf') => {
  const opt = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, letterRendering: true },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }
  
  try {
    await html2pdf().set(opt).from(element).save()
    return true
  } catch (error) {
    console.error('PDF export failed:', error)
    return false
  }
}