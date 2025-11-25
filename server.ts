import { fetchGraphQL } from './util/graphql-client';

interface ProductInterface {
    name: string;
    sku: string;
    price_range: {
        minimum_price: {
            regular_price: {
                value: number;
                currency: string;
            };
        };
    };
}

interface ProductsResponse {
    products: {
        items: ProductInterface[];
    };
}

const MAGENTO_URL = 'https://aps.com/graphql';

const GET_PRODUCTS_QUERY = `
  query GetProducts {
    products(search: "", pageSize: 5) {
      items {
        name
        sku
        price_range {
          minimum_price {
            regular_price {
              value
              currency
            }
          }
        }
      }
    }
  }
`;

async function main() {
    try {
        console.log('Fetching products...');
        const data = await fetchGraphQL<ProductsResponse>(MAGENTO_URL, GET_PRODUCTS_QUERY);

        if (data.products && data.products.items) {
            console.log('Products found:');
            data.products.items.forEach((product) => {
                const price = product.price_range.minimum_price.regular_price;
                console.log(`- ${product.name} (${product.sku}): ${price.currency} ${price.value}`);
            });
        } else {
            console.log('No products found.');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

main();
