const domain = process.env.SHOPIFY_STORE_DOMAIN;
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
const apiVersion = '2024-01'; // Use latest stable version

export async function shopifyGraphQL(query: string, variables?: any) {
  if (!domain || !accessToken) {
    throw new Error(
      'Missing Shopify credentials. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN.'
    );
  }

  // Ensure domain doesn't have protocol
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const endpoint = `https://${cleanDomain}/admin/api/${apiVersion}/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const json = await response.json();

    if (json.errors) {
      console.error('Shopify GraphQL Errors:', json.errors);
      throw new Error('Failed to fetch data from Shopify');
    }

    return json.data;
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw error;
  }
}
