import {Component} from "react";
import { withCart } from "../useCart";
import {ApolloClient, InMemoryCache, split} from "@apollo/client";
import {ADD_CART_ITEM} from "../GraphQL/Mutations";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.client = new ApolloClient({
            uri: 'http://localhost/index.php/graphql',
            cache: new InMemoryCache(),
        });
    }

    handleAddToCart = () => {
        const { items,emptyCart } = this.props.cart;


        items.forEach(item => {
            const attributes = {};
            item.attributes.forEach(attr => {
                attributes[attr.attribute_name] = item.attribute[attr.attribute_name];
            });
            console.log('Ids',item.id.split('-{',[0]))
            this.client.mutate({
                mutation: ADD_CART_ITEM,
                variables: {
                    product_id: item.id.indexOf('-{') !==-1 ? item.id.slice(0,item.id.indexOf('-{')): item.id, //need a uniqueid to differentiate attributes, so slice if from details and leave alone from quick shop
                    product: item.name,
                    amount: item.price,
                    quantity: item.quantity,
                    attributes,
                }

            })
                .then(response => {
                    console.log(response);

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
        const { items,
            totalItems,
            totalUniqueItems,
            cartTotal,
            updateItemQuantity,
            removeItem,
            emptyCart, } = this.props.cart;




        return(
            <div className="Cart">


                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <p><mark style={{backgroundColor:"white",fontWeight:"bold"}}>My bag</mark>, {totalItems===1 ? "1 item":`${totalItems} items`}</p>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="Cart">
                                    {console.log(totalUniqueItems)}
                                    {items.map((item, index) => (

                                        <div className="ProductItem" key={item.id}>
                                            <div className="ProductItems">
                                                <p>{item.name}</p>
                                                <p>${item.price}</p>
                                                <div className="SelectedAttributes">
                                                    {item.attributes.map((attribute, i) => (
                                                        <div key={i}>
                                                            <div>
                                                                <h3 className="ProductSize">{attribute.attribute_name}:</h3>
                                                            </div>
                                                            <div style={{display:"none"}}>
                                                                {item.attribute && Object.entries(item.attribute).map(([attributeName, value]) => (
                                                                <p key={attributeName}>
                                                                    <strong>{attributeName}:</strong>
                                                                    <div>{value}</div>

                                                                </p>
                                                            ))}
                                                            </div>

                                                            {attribute.values.map((value, idx) => {

                                                                const isActive = item.attribute && item.attribute[attribute.attribute_name] === value;
                                                                const firstButtonActive = idx === 0 && !Object.values(item.attribute || {}).some(v => v); // adds the first attributes from the quick shop
                                                                return (
                                                                    <button
                                                                        key={idx}
                                                                        type="button"
                                                                        id="cartButton"
                                                                        className={`btn btn-outline-dark ${isActive || firstButtonActive? 'active':''}`}
                                                                        data-bs-toggle="button"
                                                                        style={{pointerEvents:"none",backgroundColor:`${value}`,borderColor:`
                                                                        ${isActive && attribute.attribute_name==="Color" || firstButtonActive? 'green':''}`,
                                                                        boxShadow:`${isActive && attribute.attribute_name==="Color" || firstButtonActive ? "0 0 0 3px inset":""}`,boxSizing:"border-box"}}
                                                                        data-testid='cart-item-attribute-${value}'
                                                                    > {attribute.attribute_name==="Color" ? "":value}

                                                                    </button>
                                                                );
                                                            })}

                                                        </div>
                                                    ))}

                                                </div>


                                            </div>

                                            <div className="QuantityAndImage">
                                                <div className="Quantity-Buttons">
                                                    <button
                                                        id="Remove"
                                                        className="btn btn-outline-dark"
                                                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                                                    >
                                                    -
                                                    </button>
                                                    <span className="Quantity">{item.quantity}</span>
                                                    <button
                                                        id="Add"
                                                        className="btn btn-outline-dark"
                                                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <img className="Cart-Image" src={item.image} alt="Product"/>


                                            </div>


                                        </div>
                                    ))}
                                    <p style={{display: "flex", justifyContent: "space-between", fontWeight: "bold"}}>
                                        <mark style={{backgroundColor: "white"}}>Total:</mark>
                                        {Math.round(cartTotal*100)/100}
                                    </p>
                                </div>


                            </div>
                            <div className="modal-footer">
                                <button
                                    id="AddToCartButton"
                                    type="button"
                                    className="btn btn-success"
                                    onClick={this.handleAddToCart}

                                >
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default withCart(Cart);