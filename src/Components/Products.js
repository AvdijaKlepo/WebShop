
import {Component} from "react";
import {ApolloClient, InMemoryCache} from "@apollo/client";

import {withRouter} from "../withRouter";
import {GET_CATEGORIES, GET_PRODUCTS} from "../GraphQL/Queries";
import {Link} from "react-router-dom";
import {withCart} from "../useCart";



class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: null,
            products: [],
            loading: true,
            error: null,
            categories:[],
            selectedAttributes:{}
        };
    }



    handelItemHover = (item) => {
        this.setState({ activeItem: item });
    };

    handleItemLeave = () => {
        this.setState({ activeItem: null });
    };

    renderCart = (product) => {
        const { activeItem } = this.state;
        const isActive = activeItem === product.product;
        return (
            <i
                id="Hover-Icon"
                className={`bi bi-cart2 h3 bg-success text-white ${isActive ? 'active' : ''}`}
                onMouseEnter={() => this.handelItemHover(product.product)}
                style={{ visibility: isActive ? 'visible' : 'hidden',cursor: 'pointer' }}
                onClick={() => this.handleAddToCart(product)}
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
            ></i>
        );
    };


    componentDidMount() {
        this.fetchProducts();
        this.fetchCategories()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.category_id !== this.props.params.category_id) {
            this.fetchProducts();
        }
        if (this.props.location !== prevProps.location) {
            const activeCategory = this.props.location.state
                ? this.props.location.state.activeCategory
                : null;
            console.log('ProductParams after update:', activeCategory);
        }
    }

    fetchProducts = () => {
        const client = new ApolloClient({
            uri: 'http://localhost/index.php/graphql',
            cache: new InMemoryCache(),
        });


        const categoryId = Number(this.props.params.category_id);


        if (isNaN(categoryId)) {
            return;
        }


        this.setState({ loading: true, error: null });

        client.query({
            query: GET_PRODUCTS,
            variables: { category_id: categoryId } ,
            fetchPolicy: 'network-only'
        })
            .then((result) => {
                this.setState({
                    products: result.data.products,
                    loading: false,
                    error: null,
                }, () => {
                });
            })
            .catch((error) => {
                this.setState({
                    error: error.message,
                    loading: false,
                });
            });
    };
    fetchCategories = ()=>{
        const client = new ApolloClient({
            uri: 'http://localhost/index.php/graphql',
            cache: new InMemoryCache(),
        });
        client.query({
            query: GET_CATEGORIES,
            fetchPolicy: 'network-only'
        })
            .then((result)=>{
                this.setState({
                    categories: result.data.categories,
                    loading:false,
                    error:null,
                },()=>{

                });
            })
            .catch((error) => {
                this.setState({error: error.message});
            });
    }
    handleAddToCart = (product) => {
        const { selectedAttributes } = this.state;
        const { addItem } = this.props.cart;

        let finalSelectedAttributes = { ...selectedAttributes };


        if (product.attributes && Object.keys(finalSelectedAttributes).length === 0) {
            product.attributes.forEach(attribute => {
                if (!finalSelectedAttributes[attribute.attribute_name]) {
                    finalSelectedAttributes[attribute.attribute_name] = attribute.product_value;
                }
            });
        }

        const simplifiedAttributes = product.attributes
            ? product.attributes.reduce((acc, attribute) => {
                const existing = acc.find(a => a.attribute_name === attribute.attribute_name);
                if (existing) {
                    existing.values.push(attribute.display_value);
                } else {
                    acc.push({
                        attribute_name: attribute.attribute_name,
                        values: [attribute.product_value],
                    });
                }
                return acc;
            }, [])
            : [];

        // Add the selected product to the cart
        addItem({
            id: product.id,
            name: product.product,
            price: product.prices[0].amount, // Prices should be correctly accessed from the product
            symbol: product.prices[0].symbol,
            image: product.images[0].image,
            attributes: simplifiedAttributes,
            attribute: finalSelectedAttributes,
        });
    };

    render() {
        const { products, loading, error, categories } = this.state;

        const categoryId = this.props.params.category_id;
        if (loading) {
            return <p>Loading...</p>;
        }

        if (error) {
            return <p>Error: {error}</p>;
        }

        const displayCategory = categories.find((category) => category.id === categoryId);
        console.log("Correct Category", displayCategory);

        return (
            <div>
                {displayCategory ? (
                    <h1 className="DisplayCategory">{displayCategory.category.toUpperCase()}</h1>
                ) : null}
                <div className="row row-cols-3 row-cols-md-3 g-4">
                    {products.map((product, index) => (
                        <div className="col" key={index}>

                                <div
                                    className="card"
                                    onMouseEnter={() => this.handelItemHover(product.product)}
                                    onMouseLeave={this.handleItemLeave}
                                    data-testid={`product-${product.product}`}
                                >
                                    <div className="Product-Image">
                                        <Link to={`/productdetails/${product.id}`} style={{textDecoration:"none"}}>
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
                                                style={{ opacity: "0.4", position: "absolute", top: "250" }}
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
                    ))}
                </div>
            </div>
        );
    }
}

export default withRouter(withCart(Products));