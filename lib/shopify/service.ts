import { shopifyGraphQL } from './client';

export async function getProducts(limit = 5) {
    const query = \`
    query getProducts($limit: Int!) {
      products(first: $limit) {
        edges {
          node {
            id
            title
            handle
            status
            totalInventory
            priceRangeV2 {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  \`;

  const data = await shopifyGraphQL(query, { limit });
  
  return data.products.edges.map((edge: any) => ({
    id: edge.node.id,
    title: edge.node.title,
    status: edge.node.status,
    inventory: edge.node.totalInventory,
    price: edge.node.priceRangeV2.minVariantPrice.amount,
    currency: edge.node.priceRangeV2.minVariantPrice.currencyCode,
  }));
}

export async function getLatestOrders(limit = 5) {
  const query = \`
    query getOrders($limit: Int!) {
      orders(first: $limit, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            createdAt
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            displayFinancialStatus
            displayFulfillmentStatus
          }
        }
      }
    }
  \`;

  const data = await shopifyGraphQL(query, { limit });

  return data.orders.edges.map((edge: any) => ({
    id: edge.node.id,
    orderNumber: edge.node.name,
    date: edge.node.createdAt,
    total: edge.node.totalPriceSet.shopMoney.amount,
    currency: edge.node.totalPriceSet.shopMoney.currencyCode,
    paymentStatus: edge.node.displayFinancialStatus,
    fulfillmentStatus: edge.node.displayFulfillmentStatus,
  }));
}

export async function getShopStats() {
    // This aggregates some basic stats
    // Note: fetching all orders might be heavy, for real implementations use specific analytics queries or simplified counts if available
    // For now, we'll just check "connection" by getting shop name and currency
    const query = \`
      query getShopInfo {
        shop {
          name
          currencyCode
          myshopifyDomain
        }
      }
    \`;
  
    const data = await shopifyGraphQL(query);
    return data.shop;
}
