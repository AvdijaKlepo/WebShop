
import {Component} from "react";
import {ApolloClient, InMemoryCache} from "@apollo/client";

import {withRouter} from "../withRouter";
import {GET_CATEGORIES, GET_PRODUCTS} from "../GraphQL/Queries";
import {Link} from "react-router-dom";



class Products extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: null,
            products: [],
            loading: true,
            error: null,
            categories:[]
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


    render() {
        const { products, loading, error,categories } = this.state;


        const categoryId = this.props.params.category_id;
        if (loading) {
            return <p>Loading...</p>;
        }

        if (error) {
            return <p>Error: {error}</p>;
        }
        if(categoryId===categories.id){

        }
        console.log(categories)
        console.log(categoryId)

        const displayCategory = categories.find((category) => category.id === categoryId);
        console.log("Correct Category",displayCategory)




        return (
            <div>
                {displayCategory ? (
                    <h1 className="DisplayCategory">{displayCategory.category.toUpperCase()}</h1>
                ): null}
                <div className="row row-cols-3 row-cols-md-3 g-4">

                {products.map((product, index) => (
                    <div className="col" key={index}>
                        <Link to={`/productdetails/${product.id}`}>
                            <div className="card" onMouseEnter={() => this.handelItemHover(product.product)}
                                 onMouseLeave={this.handleItemLeave}>
                                <div className="Product-Image">
                                    <img
                                        src={product.images.length > 0 ? product.images[0].image : ""}
                                        className="card-img-top" alt="Product"
                                    style={{filter: product.inStock ? "false" :"opacity(0.4)"}}/>

                                    {product.inStock ? "" : <h1 className="inStockCheck"
                                    style={{opacity:"0.4",position:"absolute",top:"250",}}>OUT OF STOCK</h1>}
                                    {product.inStock ?  this.renderCart(product.product) : ""}
                                </div>
                                <div className="card-body">
                                    <p>{product.product}</p>
                                    <p>{product.prices[0].symbol}{product.prices[0].amount}</p>
                                </div>
                            </div>
                        </Link>

                    </div>
                ))}
            </div>
    </div>
        );
    }
}

export default withRouter(Products);