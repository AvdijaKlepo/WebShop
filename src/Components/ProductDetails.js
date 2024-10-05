import {Component} from "react";
import {withRouter} from "../withRouter";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import { GET_PRODUCT_BY_ID} from "../GraphQL/Queries";
import {withCart} from "../useCart";
import parse from 'html-react-parser'
import {kebabCase} from "lodash";
import {client} from '../GraphQL/Client'

class ProductDetails extends Component{
    constructor(props) {
        super(props);
        this.state = {
            product:null,
            loading:false,
            error:null,
            activeIndex:0,
            selectedAttributes:{}
        }
    }

    componentDidMount() {
        this.fetchProduct();
    }

    fetchProduct() {


        const id = String(this.props.params.id);


        this.setState({loading: true, error: null});

        client.query({
            query: GET_PRODUCT_BY_ID,
            variables:{id:id}
        })
            .then((result)=>{
                const product = result.data.products[0];
                this.setState({product:product,loading: false,error:null});
            })
            .catch((err)=>{
                this.setState({error: err, loading: false});
            })


    }


    handleImageClicked = (index)=>{
        this.setState({activeIndex:index})
    }


    handleAttributeSelected = (attributeName, value) => {
        this.setState((prevState) => ({

            selectedAttributes: {
                ...prevState.selectedAttributes,
                [attributeName]: value,
            }
        }));
    };


    handleAddToCart = () => {
        const { product, selectedAttributes } = this.state;
        const { addItem } = this.props.cart;

        const uniqueId = `${product.id}-${JSON.stringify(selectedAttributes)}`

        const simplifiedAttributes = product.attributes ? product.attributes.reduce((acc, attribute) => {
            const existing = acc.find(a => a.attribute_name === attribute.attribute_name);
            if (existing) {
                existing.values.push(attribute.product_value);
            } else {
                acc.push({
                    attribute_name: attribute.attribute_name,
                    values: [attribute.product_value],
                });
            }
            return acc;
        }, []): [];

        if (selectedAttributes) {
            addItem({
                id:uniqueId,
                name:product.product,
                price: product.prices[0].amount,
                symbol:product.prices[0].symbol,
                image:product.images[0].image,
                attributes:simplifiedAttributes,
                attribute: selectedAttributes
            });
        } else {
            addItem({
                id: product.id,
                name:product.product,
                price: product.prices[0].amount,
                symbol:product.prices[0].symbol,
                image:product.images[0].image,
                attributes: simplifiedAttributes
            });

        }
    };

    render() {
        const {product,loading,error,selectedAttribute}=this.state;
        if(loading){
            return <p>Loading...</p>
        }
        if(error){
            return <p>Error:{error}</p>
        }
        if (!product){
            return <p>No Product found!</p>
        }
        const attributes = product.attributes
            ? product.attributes.reduce((acc, attribute) => {
                const existingAttribute = acc.find(
                    (a) => a.attribute_name === attribute.attribute_name
                );
                if (existingAttribute) {
                    existingAttribute.values.push(attribute.product_value);
                } else {
                    acc.push({
                        attribute_name: attribute.attribute_name,
                        values: [attribute.product_value],
                    });
                }
                return acc;
            }, [])
            : [];

        const uniqueAttributeNames = attributes.length;


        return (

            <div className="ProductDetails">
                <div className="ProductImages"
                     data-testid='product-gallery'>
                    <div className="Images">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                className={`ImageVariant ${this.state.activeIndex === index ? 'active' : ''}`}
                                src={image.image}
                                alt={`Product Image ${index}`}
                                onClick={() => this.handleImageClicked(index)}
                            />
                        ))}
                    </div>
                    <div id="carouselExample" className="carousel slide">
                        <div className="carousel-inner">
                            {product.images.map((images, index) => (
                                <div
                                    key={index}
                                    className={`carousel-item ${index === this.state.activeIndex ? "active" : ""}`}>
                                    <img
                                        src={images.image}
                                        className="Carousel-Image"
                                        alt="..."

                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#carouselExample"
                            data-bs-slide="prev"
                            style={{display: `${product.images.length > 1 ? 'block' : 'none'}`}}

                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden"></span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#carouselExample"
                            data-bs-slide="next"
                            style={{display: `${product.images.length > 1 ? 'block' : 'none'}`,}}
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                <div className="ProductInfo">
                    <h1 className="ProductName">{product.product}</h1>

                    {attributes.length > 0 ? (
                        attributes.map((groupedAttribute, index) => (
                                <div key={index}
                                     data-testid={`product-attribute-${kebabCase(groupedAttribute.attribute_name)}`}>
                                    <div className="Product-Attributes">
                                        <h3 className="ProductSize">{groupedAttribute.attribute_name}:</h3>
                                    </div>
                                    <div className="SizeButtons">
                                        {groupedAttribute.values.map((value, idx) => {

                                            const colorAttributeColor = groupedAttribute.attribute_name==="Color";
                                            const selectedAttribute = this.state.selectedAttributes[groupedAttribute.attribute_name]===value;

                                            return (
                                                <button
                                                    key={idx}
                                                    id="SizeButton"
                                                    type="button"
                                                    className={`btn ${
                                                        colorAttributeColor ? 
                                                            "btn-outline-success" : "btn-outline-dark"
                                                    } ${selectedAttribute ? "selected" : ""}`}
                                                    onClick={() => this.handleAttributeSelected(groupedAttribute.attribute_name, value)}
                                                    style={colorAttributeColor ? {backgroundColor:value}:{}}
                                                    data-bs-toggle="button"
                                                >
                                                    {!colorAttributeColor && value}

                                                </button>
                                            )

                                        })}
                                    </div>
                                </div>
                            ))
                    ) : (
                        <p>No attributes.</p>
                    )}


                <h5 className="ProductPriceText">PRICE:</h5>
                <div className="Wrap-Price">
                    <h2 className="ProductPrice">{product.prices[0].symbol}</h2>
                    <h2>{product.prices[0].amount}</h2>
                </div>

                <button
                    id="AddToCartButton"
                    type="button"
                    className="btn btn-success"
                    disabled={!product.inStock || Object.keys(this.state.selectedAttributes).length !==uniqueAttributeNames}
                    onClick={this.handleAddToCart}
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                    data-testid='add-to-cart'
                >
                    ADD TO CART
                </button>

                <div className="ProductDescription"
                     data-testid='product-description'>
                    {parse(product.product_description)}</div>
            </div>
    </div>

    )
    }
}

export default withRouter(withCart(ProductDetails));