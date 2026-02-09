// Map product names to their profile card HTML files
export function getProfileCardUrl(productName: string): string | null {
  const name = productName.toLowerCase()
  
  const cardMap: Record<string, string> = {
    'adipotide': 'adipotide-profile-card.html',
    'aod-9604': 'aod-9604-profile-card.html',
    'bpc-157': 'bpc-157-profile-card.html',
    'cagrilintide': 'cagrilintide-profile-card.html',
    'cjc-1295': 'cjc-1295-profile-card.html',
    'dsip': 'dsip-profile-card.html',
    'epithalon': 'epithalon-profile-card.html',
    'ghk-cu': 'ghk-cu-profile-card.html',
    'ghrp-2': 'ghrp-2-profile-card.html',
    'hcg': 'hcg-profile-card.html',
    'hexarelin': 'hexarelin-profile-card.html',
    'hgh': 'hgh-profile-card.html',
    'hmg': 'hmg-profile-card.html',
    'igf-1 lr3': 'igf-1-lr3-profile-card.html',
    'ipamorelin': 'ipamorelin-profile-card.html',
    'kisspeptin': 'kisspeptin-profile-card.html',
    'melanotan 2': 'melanotan-2-profile-card.html',
    'mots-c': 'mots-c-profile-card.html',
    'nad+': 'nad-plus-profile-card.html',
    'oxytocin acetate': 'oxytocin-acetate-profile-card.html',
    'peg-mgf': 'peg-mgf-profile-card.html',
    'pnc-27': 'pnc-27-profile-card.html',
    'pt-141': 'pt-141-profile-card.html',
    'retatrutide': 'retatrutide-profile-card.html',
    'selank': 'selank-profile-card.html',
    'semaglutide': 'semaglutide-profile-card.html',
    'semax': 'semax-profile-card.html',
    'sermorelin': 'sermorelin-profile-card.html',
    'slu-pp-32': 'slu-pp-32-profile-card.html',
    'snap-8': 'snap-8-profile-card.html',
    'ss-31': 'ss-31-profile-card.html',
    'tb-500': 'tb-500-profile-card.html',
    'tesamorelin': 'tesamorelin-profile-card.html',
    'thymosin alpha-1': 'thymosin-alpha-1-profile-card.html',
    'thymulin': 'thymulin-profile-card.html',
    'tirzepatide': 'tirzepatide-profile-card.html',
  }
  
  for (const [key, filename] of Object.entries(cardMap)) {
    if (name.includes(key)) {
      return `/profile-cards/${filename}`
    }
  }
  
  return null
}

// Extract base name from product name (remove dosage)
export function getBaseName(productName: string): string {
  return productName.replace(/\s+\d+(\.\d+)?\s*(mg|iu|mcg)/gi, '').trim()
}

// Get the header gradient color for each peptide
export function getHeaderColor(productName: string): string {
  const name = productName.toLowerCase()
  
  const colorMap: Record<string, string> = {
    'adipotide': '#47ff7b',
    'aod-9604': '#6609ff',
    'bpc-157': '#fff95e',
    'cagrilintide': '#1086ff',
    'cjc-1295': '#6609ff',
    'dsip': '#6609ff',
    'epithalon': '#ff4dfd',
    'ghk-cu': '#818181',
    'ghrp-2': '#6609ff',
    'hcg': '#6609ff',
    'hexarelin': '#6609ff',
    'hgh': '#6609ff',
    'hmg': '#ff4dfd',
    'igf-1 lr3': '#fff95e',
    'ipamorelin': '#6609ff',
    'kisspeptin': '#e60041',
    'melanotan 2': '#6609ff',
    'mots-c': '#ff9845',
    'nad+': '#fff95e',
    'oxytocin acetate': '#e60041',
    'peg-mgf': '#fff95e',
    'pnc-27': '#fff95e',
    'pt-141': '#e60041',
    'retatrutide': '#fff95e',
    'selank': '#6609ff',
    'semaglutide': '#fff95e',
    'semax': '#6609ff',
    'sermorelin': '#6609ff',
    'slu-pp-32': '#6609ff',
    'snap-8': '#818181',
    'ss-31': '#6609ff',
    'tb-500': '#47ff7b',
    'tesamorelin': '#6609ff',
    'thymosin alpha-1': '#47ff7b',
    'thymulin': '#1086ff',
    'tirzepatide': '#fff95e',
  }
  
  for (const [key, color] of Object.entries(colorMap)) {
    if (name.includes(key)) {
      return color
    }
  }
  
  return '#fff95e'
}
