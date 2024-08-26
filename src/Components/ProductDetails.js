import {Component} from "react";
import image from "../image.webp"
class ProductDetails extends Component{
    render() {
        return(
            <div className="ProductDetails">
                <div className="ProductImages">
                    <img className="ImageVariant" src={`${image}`} alt="ProductImages"/>
                    <img className="ProductImageDetails" src={`${image}`} alt="productImageDetails"/>
                </div>

                <div className="ProductInfo">
                    <h1 className="ProductName">Product Name</h1>
                    <h3 className="ProductSize">SIZE:</h3>

                    <div className="SizeButtons">
                        <button id="SizeButton" type="button" className="btn btn-light">XS</button>
                        <button id="SizeButton" type="button" className="btn btn-light">S</button>
                        <button id="SizeButton" type="button" className="btn btn-light">M</button>
                        <button id="SizeButton" type="button" className="btn btn-light">L</button>
                    </div>

                    <h4 className="ProductColor">COLOR:</h4>
                    <div className="ColorButtons">
                        <button id="ColorButton" type="button" className="btn btn-light"></button>
                        <button id="ColorButton" type="button" className="btn btn-light"></button>
                        <button id="ColorButton" type="button" className="btn btn-light"></button>
                    </div>

                    <h5 className="ProductPriceText">PRICE:</h5>
                    <h2 className="ProductPrice">$50.00</h2>

                    <button id="AddToCartButton" type="button" className="btn btn-success">ADD TO CART</button>
                    <p className="ProductDescription">Find stunning women's cocktail dresses and party dresses. Stand out in lace and metallic cocktail
                        dresses and party dresses from all your favorite brands.
                    </p>
                </div>




            </div>
        )
    }
}

export default ProductDetails;