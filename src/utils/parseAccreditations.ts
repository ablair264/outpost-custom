// Parse accreditations from pipe-separated strings
export function parseAccreditations(accreditationsData: { accreditations: string }[]): string[] {
  const uniqueAccreditations = new Set<string>();
  
  accreditationsData.forEach(item => {
    if (item.accreditations) {
      // Split by pipe and trim each value
      const accreds = item.accreditations.split('|').map(a => a.trim());
      accreds.forEach(accred => {
        if (accred) {
          uniqueAccreditations.add(accred);
        }
      });
    }
  });
  
  return Array.from(uniqueAccreditations).sort();
}