import { shopifyGraphQL } from './client';

export async function getProducts(limit = 5) {
  const query = `
    query getProducts($limit: Int!) {
      products(first: $limit) {
// ...
// ...
export async function getLatestOrders(limit = 5) {
  const query = `
    query getOrders($limit: Int!) {
    orders(first: $limit, sortKey: CREATED_AT, reverse: true) {
      // ...
      // ...
      export async function getShopStats() {
        // This aggregates some basic stats
        // Note: fetching all orders might be heavy, for real implementations use specific analytics queries or simplified counts if available
        // For now, we'll just check "connection" by getting shop name and currency
        const query = `
      query getShopInfo {
        shop {
          name
          currencyCode
          myshopifyDomain
        }
      }
    `;

        const data = await shopifyGraphQL(query);
        return data.shop;
      }
