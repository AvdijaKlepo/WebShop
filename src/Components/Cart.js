import {Component} from "react";
import { withCart } from "../useCart";
import {ADD_CART_ITEM} from "../GraphQL/Mutations";
import _ from "lodash";
import {client} from '../GraphQL/Client'

class Cart extends Component {
    handleAddToCart = () => {
        const { items,emptyCart } = this.props.cart;


        items.forEach(item => {
            const attributes = {};
            item.attributes.forEach(attr => {
                attributes[attr.attribute_name] = item.attribute[attr.attribute_name];
            });
            client.mutate({
                mutation: ADD_CART_ITEM,
                variables: {
                    product_id: item.id.indexOf('-{') !==-1 ? item.id.slice(0,item.id.indexOf('-{')): item.id, //need  unique id to differentiate attributes, so slice if from details and leave alone from quick shop
                    product: item.name,
                    amount: item.price,
                    quantity: item.quantity,
                    attributes,
                }

            })
                .then(response => {
                    if (response.data.addCartItem) {
                        alert("Items added to cart successfully!");

                    }
                    emptyCart();

                })
                .catch(err => {
                    console.error("Error adding items to cart", err);
                    alert("Failed to add items to cart: " + err.message);
                });

        });
    };


    render() {
        const {
            items,
            totalItems,
            cartTotal,
            updateItemQuantity,
        } = this.props.cart;



        return (
            <div className="Cart">
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" style={{ position: "fixed", top: "50", right: "10px", transform: "translateX(-20px)", width: "500px" }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <p>
                                    <mark style={{ backgroundColor: "white", fontWeight: "bold" }}>My bag</mark>, {totalItems === 1 ? "1 item" : `${totalItems} items`}
                                </p>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="Cart">
                                    {items.map((item) => (
                                        <div className="ProductItem" key={item.id}>
                                            <div className="ProductItems">
                                                <p>{item.name}</p>
                                                <p>${item.price}</p>
                                                <div className="SelectedAttributes">
                                                    {item.attributes.map((attribute, i) => {
                                                        const kebabCaseAttributeName = _.kebabCase(attribute.attribute_name);
                                                        return (
                                                            <div key={i} data-testid={`cart-item-attribute-${kebabCaseAttributeName}`}>
                                                                <div>
                                                                    <h3 className="ProductSize">{attribute.attribute_name}:</h3>
                                                                </div>
                                                                <div style={{ display: "none" }}>
                                                                    {item.attribute && Object.entries(item.attribute).map(([attributeName, value]) => (
                                                                        <p key={attributeName}>
                                                                            <strong>{attributeName}:</strong>
                                                                            <div>{value}</div>
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                                {attribute.values.map((value, idx) => {
                                                                    const isActive = item.attribute && item.attribute[attribute.attribute_name] === value;
                                                                    const firstButtonActive = idx === 0 && !Object.values(item.attribute || {}).some(v => v);
                                                                    const kebabCaseValue = _.kebabCase(value);
                                                                    return (
                                                                        <button
                                                                            key={idx}
                                                                            type="button"
                                                                            id="cartButton"
                                                                            className={`btn btn-outline-dark ${isActive || firstButtonActive ? 'active' : ''}`}
                                                                            data-bs-toggle="button"
                                                                            style={{
                                                                                pointerEvents: "none",
                                                                                backgroundColor: `${value}`,
                                                                                borderColor: `${isActive && attribute.attribute_name === "Color" || firstButtonActive ? 'green' : ''}`,
                                                                                boxShadow: `${isActive && attribute.attribute_name === "Color" || firstButtonActive ? "0 0 0 3px inset" : ""}`,
                                                                                boxSizing: "border-box"
                                                                            }}
                                                                            data-testid={`cart-item-attribute-${kebabCaseAttributeName}-${kebabCaseValue}${isActive || firstButtonActive ? '-selected' : ''}`}
                                                                        >
                                                                            {attribute.attribute_name === "Color" ? "" : value}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            <div className="QuantityAndImage">
                                                <div className="Quantity-Buttons">
                                                    <button
                                                        id="Remove"
                                                        className="btn btn-outline-dark"
                                                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                        data-testid="cart-item-amount-decrease"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="Quantity" data-testid="cart-item-amount">{item.quantity}</span>
                                                    <button
                                                        id="Add"
                                                        className="btn btn-outline-dark"
                                                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                        data-testid="cart-item-amount-increase"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <img className="Cart-Image" src={item.image} alt="Product" />
                                            </div>
                                        </div>
                                    ))}
                                    <p style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold" }}>
                                        <mark style={{ backgroundColor: "white" }}>Total:</mark>
                                        <span data-testid="cart-total">{Math.round(cartTotal * 100) / 100}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    id="AddToCartButton"
                                    type="button"
                                    className="btn btn-success"
                                    onClick={this.handleAddToCart}
                                    disabled={totalItems === 0}
                                >
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default withCart(Cart);