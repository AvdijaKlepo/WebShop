import React from "react";
import { useCart } from "react-use-cart";

// This HOC wraps your class components and injects cart data as props
export function withCart(Component) {
    return function WrapperComponent(props) {
        const cart = useCart();
        return <Component {...props} cart={cart} />;
    };
}