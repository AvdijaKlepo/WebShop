
import {Component} from "react";
import {ApolloClient, InMemoryCache} from "@apollo/client";

import {withRouter} from "../withRouter";
import {GET_PRODUCTS} from "../GraphQL/Queries";



class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: null,
            products: [],
            loading: true,
            error: null,
        };
    }



    handelItemHover = (item) => {
        this.setState({ activeItem: item });
    };

    handleItemLeave = () => {
        this.setState({ activeItem: null });
    };

    renderCart = (itemName) => {
        const { activeItem } = this.state;
        const isActive = activeItem === itemName;
        return (
            <i id="Hover-Icon" className={`bi bi-cart2 h3 bg-success text-white
             ${isActive ? 'active' : ''}`}
               onMouseEnter={() => this.handelItemHover(itemName)}
               style={{ visibility: isActive ? 'visible' : 'hidden' }}
            ></i>
        );
    };


    componentDidMount() {
        console.log("Params in componentDidMount:", this.props.params);
        this.fetchProducts();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.params.category_id !== this.props.params.category_id) {
            console.log("Params in componentDidUpdate:", this.props.params);
            this.fetchProducts();
        }
    }

    fetchProducts = () => {
        const client = new ApolloClient({
            uri: 'http://localhost/index.php/graphql',
            cache: new InMemoryCache(),
        });

        // Ensure category_id is correctly converted to an integer
        const categoryId = Number(this.props.params.category_id);

        console.log("Original category_id:", this.props.params.category_id);
        console.log('Converted categoryId:', categoryId);
        console.log('Type of categoryId:', typeof categoryId);

        // If the categoryId is NaN or invalid, skip the query
        if (isNaN(categoryId)) {
            console.log("Invalid category_id, skipping query");
            return;
        }

        console.log("Sending query with category_id:", categoryId);

        this.setState({ loading: true, error: null });

        client.query({
            query: GET_PRODUCTS,
            variables: { category_id: categoryId } ,
            fetchPolicy: 'network-only'
        })
            .then((result) => {
                console.log("Query result:", result);
                this.setState({
                    products: result.data.products,
                    loading: false,
                    error: null,
                }, () => {
                    console.log("Updated products state:", this.state.products);
                });
            })
            .catch((error) => {
                console.error("GraphQL query error:", error);
                this.setState({
                    error: error.message,
                    loading: false,
                });
            });
    };



    render() {
        const { products, loading, error } = this.state;

        console.log("Render method called, products:", this.props.params);

        if (loading) {
            return <p>Loading...</p>;
        }

        if (error) {
            return <p>Error: {error}</p>;
        }


        return (
            <div className="row row-cols-3 row-cols-md-3 g-4">
                {products.map((product, index) => (
                    <div className="col" key={index}>

                        <div className="card" onMouseEnter={() => this.handelItemHover(product.product)}
                             onMouseLeave={this.handleItemLeave}>
                            <div className="Product-Image">
                                <img
                                    src={product.images.length > 0 ? product.images[0].image : ""}
                                    className="card-img-top" alt="Product"/>
                                {this.renderCart(product.product)}
                            </div>
                            <div className="card-body">
                                <p>{product.product}</p>
                                <p>{product.prices[0].symbol}{product.prices[0].amount}</p>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        );
    }
}

export default withRouter(Products);