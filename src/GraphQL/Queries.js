import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
    query ProductQuery($category_id:Int) {
        products(category_id: $category_id) {
            id
            product
            images {
                image
            }
            prices {
                symbol
                amount
            }
            inStock
            category_id
            attributes {
                display_value
                attribute_name
                product_value

            }
        }
        
    }
`;

export const GET_CATEGORIES = gql`
    query GetCategory{
        categories{
            id
            category
        }

    }`


export const GET_PRODUCT_BY_ID = gql`
    query GetProductByID($id: String) {
        products(id: $id) {
            id
            product
            images {
                image
            }
            attributes {
                display_value
                attribute_name
                product_value
                
            }
            brand
            prices {
                amount
                symbol
            }
            product_description
            inStock
        }
    }`

