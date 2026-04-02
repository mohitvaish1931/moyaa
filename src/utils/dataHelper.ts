/**
 * Helper to parse comma-separated strings or JSON arrays into clean string arrays
 */
export const parseList = (raw: any): string[] => {
  if (!raw) return [];
  let items: any[] = [];
  
  if (Array.isArray(raw)) {
    items = raw;
  } else if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try { 
        items = JSON.parse(trimmed); 
      } catch (e) { 
        items = trimmed.split(','); 
      }
    } else { 
      items = trimmed.split(','); 
    }
  } else { 
    items = [raw]; 
  }
  
  const result: string[] = [];
  items.forEach(item => {
    if (!item) return;
    if (typeof item === 'string') {
      const trimmedItem = item.trim();
      // Nested array in string form - common in malformed MongoDB data
      if (trimmedItem.startsWith('[') && trimmedItem.endsWith(']')) {
        try { 
          const parsed = JSON.parse(trimmedItem);
          if (Array.isArray(parsed)) {
            parsed.forEach(p => {
              if (typeof p === 'string') {
                result.push(...p.split(',').map(s => s.trim()).filter(Boolean));
              } else {
                result.push(String(p));
              }
            });
          } else {
            result.push(String(parsed));
          }
        } catch (e) { 
          result.push(...trimmedItem.split(',').map(s => s.trim()).filter(Boolean));
        }
      } else {
        result.push(...trimmedItem.split(',').map(s => s.trim()).filter(Boolean));
      }
    } else if (Array.isArray(item)) {
       // Nested actual array
       item.forEach(subItem => {
          if (typeof subItem === 'string') {
            result.push(...subItem.split(',').map(s => s.trim()).filter(Boolean));
          } else {
            result.push(String(subItem));
          }
       });
    } else {
      result.push(String(item));
    }
  });
  
  // Final cleanup: unique values, non-empty, and no null/undefined as strings
  return [...new Set(result
    .map(s => s.trim())
    .filter(s => s && s !== 'null' && s !== 'undefined' && s !== ''))];
};
