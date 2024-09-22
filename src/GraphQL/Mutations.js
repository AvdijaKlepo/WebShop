import { gql } from '@apollo/client';

export const ADD_CART_ITEM = gql`
    mutation addCartItem($product_id: String!, $product: String!, $amount: Float!, $quantity: Int!, $attributes: [String!]!) {
        addCartItem(product_id: $product_id, product: $product, amount: $amount, quantity: $quantity, attributes: $attributes)
    }
`;
