import {Component} from "react";
import {withRouter} from "../withRouter";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import { GET_PRODUCT_BY_ID} from "../GraphQL/Queries";
import {withCart} from "../useCart";

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
        const client = new ApolloClient({
            uri:'http://localhost/index.php/graphql',
            cache: new InMemoryCache(),
        });

        const id = String(this.props.params.id);
        console.log(id)

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
    //calculates the carousel height based on the total amount of images all displayed to its left unless it returns only one image.
    //Then it looks stupid
    calculateImageHeight() {
        const { product } = this.state;
        const baseHeight = 400;
        const extraHeightPerImage = 50;
        const numberOfImages = product.images ? product.images.length : 0;
        if(numberOfImages>1) {
            return baseHeight + numberOfImages * extraHeightPerImage;
        }
        else{
            return 500;
        }
    }
    calculateCarouselArrows(){
        const {product}=this.state;
        const basePadding = 150;
        const extraPaddingPerImage = 20;
        const numberOfImages = product.images ? product.images.length : 0;
        if (numberOfImages>1){
            return basePadding + numberOfImages * extraPaddingPerImage;
        }
        else{
            return 150;
        }
    }

    handleAttributeSelected = (attributeName, value) => {
        this.setState((prevState) => ({
            selectedAttributes: {
                ...prevState.selectedAttributes,
                [attributeName]: value, // dynamically update the selected attribute
            }
        }));
    };


    // Handle adding to cart
    handleAddToCart = () => {
        const { product, selectedAttributes } = this.state;
        const { addItem } = this.props.cart;
        const simplifiedAttributes = product.attributes.reduce((acc, attribute) => {
            const existing = acc.find(a => a.attribute_name === attribute.attribute_name);
            if (existing) {
                existing.values.push(attribute.display_value);
            } else {
                acc.push({
                    attribute_name: attribute.attribute_name,
                    values: [attribute.display_value],
                });
            }
            return acc;
        }, []);

        if (selectedAttributes) {
            addItem({
                id: product.id,
                name:product.product,
                price: product.prices[0].amount,
                symbol:product.prices[0].symbol,
                image:product.images[0].image,
                attributes:simplifiedAttributes,
                attribute: selectedAttributes
            });
        } else {
            alert("Please select an attribute before adding to cart!");
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

        const dynamicHeight = this.calculateImageHeight();
        const dynamicPadding = this.calculateCarouselArrows();
        return (

            <div className="ProductDetails">
                <div className="ProductImages">
                    <div className="Images">
                        {product.images.map((image, index) => (
                            <img
                                key={index}
                                className="ImageVariant"
                                src={image.image}
                                alt={`Product Image ${index}`}
                                onClick={() => this.handleImageClicked(index)}
                            />
                        ))}
                    </div>
                    <div id="carouselExample" className="carousel slide">
                        <div className="carousel-inner">
                            {product.images.map((images, index) => (
                                <div className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                    <img
                                        src={images.image}
                                        className="Carousel-Image"
                                        alt="..."
                                        style={{height: `${dynamicHeight}px`}}
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#carouselExample"
                            data-bs-slide="prev"
                            style={{paddingTop: `${dynamicPadding}px`}}
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#carouselExample"
                            data-bs-slide="next"
                            style={{paddingTop: `${dynamicPadding}px`}}
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                <div className="ProductInfo">
                    <h1 className="ProductName">{product.product}</h1>

                    {product.attributes && product.attributes.length > 0 ? (
                        product.attributes
                            .reduce((acc, attribute) => {
                                const existingAttribute = acc.find(
                                    (a) => a.attribute_name === attribute.attribute_name
                                );
                                if (existingAttribute) {
                                    existingAttribute.values.push(attribute.display_value);
                                } else {
                                    acc.push({
                                        attribute_name: attribute.attribute_name,
                                        values: [attribute.display_value],
                                    });
                                }
                                return acc;
                            }, [])
                            .map((groupedAttribute, index) => (
                                <div key={index}>
                                    <div className="Product-Attributes">
                                        <h3 className="ProductSize">{groupedAttribute.attribute_name}:</h3>
                                    </div>
                                    <div className="SizeButtons">
                                        {groupedAttribute.values.map((value, idx) => (
                                            <button
                                                key={idx}
                                                id="SizeButton"
                                                type="button"
                                                className={`btn btn-outline-dark ${
                                                    this.state.selectedAttributes[groupedAttribute.attribute_name] === value
                                                        ? "selected"
                                                        : ""
                                                }`}
                                                onClick={() => this.handleAttributeSelected(groupedAttribute.attribute_name, value)}
                                                data-bs-toggle="button"
                                            >
                                                {value}
                                            </button>
                                        ))}
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
                    onClick={this.handleAddToCart}
                >
                    ADD TO CART
                </button>

                <p className="ProductDescription">{product.product_description}</p>
            </div>
    </div>

    )
    }
}

export default withRouter(withCart(ProductDetails));