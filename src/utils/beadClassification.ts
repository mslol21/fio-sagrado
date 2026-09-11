export type BeadSizeClass = '6mm' | '8mm';

export const getBeadSizeClassification = (component?: { size?: string; name?: string; description?: string }): BeadSizeClass => {
  if (!component) return '8mm';
  const combined = `${component.size || ''} ${component.name || ''} ${component.description || ''}`.toLowerCase();
  
  if (
    combined.includes('6mm') || 
    combined.includes('6 mm') || 
    combined.includes('6 milímetros') || 
    combined.includes('6 milimetros') ||
    combined.includes('delicada') ||
    combined.includes('slim')
  ) {
    return '6mm';
  }
  
  return '8mm';
};
