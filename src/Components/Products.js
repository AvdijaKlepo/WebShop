import {Component} from "react";
import image from "../image.webp"
import Modal2 from"../Modal2.css"
import { Outlet, Link } from "react-router-dom";
class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: null,
        };
    }
    handelItemHover = (item)=>{
        this.setState({activeItem: item});
    };
    handleItemLeave = ()=>{
        this.setState({activeItem: null});
    }
    renderCart = (itemName)=> {
        const {activeItem} = this.state;
        const isActive = activeItem === itemName;
        return(
            <i id="Hover-Icon" className={`bi bi-cart2 h3 bg-success text-white
             ${isActive ? 'active' : ''}`}
               onMouseEnter={()=> this.handelItemHover(itemName)}
               style={{visibility:isActive ? 'visible' : 'hidden'}}
            >

            </i>
        );
    };

    render() {
        const productName = "Product1";
        return(

            <div className={Modal2.modalBackdrop}>
                <div className="ProductsComponents">
                    <h1 className="Products-Header">Women</h1>
                    <Link to="/ProductDetails" style={{textDecoration:'none'}}>
                        <div className="card mt-5" onMouseEnter={() => this.handelItemHover(productName)}
                             onMouseLeave={this.handleItemLeave}>
                            <div className="Product-Image">
                                <img src={image} className="card-img-top" alt="Logo"/>
                                {this.renderCart(productName)}
                            </div>
                            <div className="card-body">
                                <p className="card-text fw-light">Product name</p>
                                <p>Product price</p>
                            </div>

                        </div>
                    </Link>

                </div>
            </div>

        )
    }
}

export default Products;