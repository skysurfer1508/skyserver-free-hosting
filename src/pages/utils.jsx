// Utility function for creating page URLs
export function createPageUrl(pageName, params = {}) {
  const baseUrl = `/${pageName}`;
  const queryString = Object.keys(params).length > 0 
    ? '?' + new URLSearchParams(params).toString()
    : '';
  return baseUrl + queryString;
}