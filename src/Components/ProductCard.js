import {Component} from "react";
import {kebabCase} from "lodash";
import {Link} from "react-router-dom";

class ProductCard extends Component {

    render() {

        return (
                    <div className="col" key={index}>
                        <div
                            className="card"
                            onMouseEnter={() => this.handelItemHover(product.product)}
                            onMouseLeave={this.handleItemLeave}
                            data-testid={`product-${kebabCase(product.product)}`}
                        >
                            <div className="Product-Image">
                                <Link to={`/productdetails/${product.id}`} style={{textDecoration: "none"}}>
                                    <img
                                        src={product.images.length > 0 ? product.images[0].image : ""}
                                        className="card-img-top"
                                        alt="Product"
                                        style={{
                                            filter: product.inStock ? "false" : "opacity(0.4)",
                                        }}
                                    />
                                </Link>
                                {product.inStock ? "" : (
                                    <h1
                                        className="inStockCheck"
                                        style={{opacity: "0.4", position: "absolute", top: "250"}}
                                    >
                                        OUT OF STOCK
                                    </h1>
                                )}
                                {product.inStock ? this.renderCart(product) : ""}
                            </div>
                            <div className="card-body">
                                <p>{product.product}</p>
                                <p>{product.prices[0].symbol}{product.prices[0].amount}</p>
                            </div>
                        </div>
            </div>

        )
    }
}

export default ProductCard;
