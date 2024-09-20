import {Component} from "react";
import { withCart } from "../useCart";

class Cart extends Component {
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
                                <p><mark style={{backgroundColor:"white",fontWeight:"bold"}}>My bag</mark>, {totalItems} items</p>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="Cart">
                                    {items.map((item, index) => (
                                        <div className="ProductItem" key={index}>
                                            <div className="ProductItems">
                                                <p>{item.name}</p>
                                                <p>${item.price}</p>
                                                <div className="SelectedAttributes">
                                                    {item.attribute && Object.entries(item.attribute).map(([attributeName, value]) => (
                                                        <p key={attributeName}>
                                                            <strong>{attributeName}:</strong> {value}
                                                        </p>
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
                                        {cartTotal}
                                    </p>
                                </div>


                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close
                                </button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


export default withCart(Cart);