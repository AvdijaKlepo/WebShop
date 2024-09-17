import {Component} from "react";
import {withRouter} from "../withRouter";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import { GET_PRODUCT_BY_ID} from "../GraphQL/Queries";
class ProductDetails extends Component{
    constructor(props) {
        super(props);
        this.state = {
            product:null,
            loading:false,
            error:null,
            activeIndex:0
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
    // this is pure AI code, but I don't care as it's very cool
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

    render() {
        const {product,loading,error}=this.state;
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
        return(

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
                            {product.images.map((images,index)=>(


                            <div className={`carousel-item ${index===0 ? 'active': ''}`}>
                                <img src={images.image} className="Carousel-Image" alt="..."
                                style={{height:`${dynamicHeight}px`}}/>
                            </div>
                            ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample"
                                data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample"
                                data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>

                <div className="ProductInfo">
                    <h1 className="ProductName">{product.product}</h1>
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
                    <h2 className="ProductPrice">{product.prices[0].symbol} {product.prices[0].amount}</h2>

                    <button id="AddToCartButton" type="button" className="btn btn-success">ADD TO CART</button>
                    <p className="ProductDescription">{product.product_description}
                    </p>

                </div>




            </div>

        )
    }
}

export default withRouter(ProductDetails);