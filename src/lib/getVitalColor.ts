export const getVitalColor = (type: string, value: string | number | undefined | null) => {
  if (!value) return 'text-foreground';

  const strValue = String(value);
  
  // Blood Pressure logic (e.g., "140/90")
  if (type === 'bp' || type === 'bloodPressure') {
    const parts = strValue.split('/');
    if (parts.length === 2) {
      const systolic = parseInt(parts[0]);
      const diastolic = parseInt(parts[1]);
      
      if (systolic >= 140 || diastolic >= 90) return 'text-rose-600'; // High
      if (systolic >= 130 || diastolic >= 85) return 'text-amber-500'; // Elevated
      return 'text-emerald-600'; // Normal
    }
  }

  // Numerical logic for Glucose, Weight, etc.
  const numValue = parseFloat(strValue);
  if (isNaN(numValue)) return 'text-foreground';

  // Blood Glucose (mg/dL) logic
  if (type === 'glucose' || type === 'bloodGlucose') {
    if (numValue > 140) return 'text-rose-600'; // High
    if (numValue > 100) return 'text-amber-500'; // Elevated
    return 'text-emerald-600'; // Good
  }

  // Weight (KG) logic
  if (type === 'weight') {
    // If unit is lbs (approx 2.2 * kg), convert mentally or handle by threshold
    // Let's check for "lbs" in the string
    const isLbs = strValue.toLowerCase().includes('lbs');
    const kgValue = isLbs ? numValue / 2.2 : numValue;

    if (kgValue > 100) return 'text-rose-600'; // High
    if (kgValue > 85) return 'text-amber-500'; // Elevated
    return 'text-emerald-600'; // Good
  }

  // General Fallback
  return 'text-foreground';
};
