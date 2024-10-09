import React from "react";
import { useCart } from "react-use-cart";


export function withCart(Component) {
    return function WrapperComponent(props) {
        const cart = useCart();
        return <Component {...props} cart={cart} />;
    };
}