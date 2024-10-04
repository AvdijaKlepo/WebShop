import React, { Component } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GET_CATEGORIES } from "../GraphQL/Queries";
import { Link } from "react-router-dom";
import logo from '../assets/a-logo.png';
import {withRouter} from "../withRouter";
import {withCart} from "../useCart";
class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: null,
            categories: [],
            loading: true,
            error: null,
        };
    }
    handleItemClick = (item) => {
        this.setState({ activeItem: item });

    };

    componentDidMount() {
        const client = new ApolloClient({
            uri: 'http://localhost/index.php/graphql',
            cache: new InMemoryCache(),
        });
        client
            .query({
                query: GET_CATEGORIES,
            })
            .then((result) => {
                const categories = result.data.categories;
                this.setState({ categories: result.data.categories, loading: false,
                    activeItem:categories.length > 0 ? categories[0].category : null
                });
                if (categories.length>0){
                    const firstCategoryId = categories[0].id;
                    this.navigateToCategory(firstCategoryId);
                }

            })
            .catch((error) => {
                this.setState({ error: error.message, loading: false });
            });
    }
    navigateToCategory = (categoryId) => {
        this.props.navigate(`/products/${categoryId}`);
    }

    render() {
        const { categories, loading, error, activeItem } = this.state;
        const { items,
            totalItems,
            } = this.props.cart;

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;

        return (
            <nav className="navbar fixed-top navbar-expand-lg p-4 fs-4">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse d-flex justify-content-between align-items-center" id="navbarSupportedContent">
                            <ul className="navbar-nav me-4 ps-5  mb-2 mb-lg-0">
                                {categories.map((category) => {
                                    const isActive = activeItem === category.category;
                                    return (
                                        <li
                                            key={category.id}
                                            className={`nav-item ${isActive ? 'active' : ''}`}
                                            onClick={() => this.handleItemClick(category.category)}
                                            style={{borderBottom: isActive ? '3px solid lightgreen' : 'none'}}
                                            data-testid='active-category-link'
                                        >
                                            <Link
                                                data-testid='category-link'
                                                to={{

                                                    pathname: `/products/${category.id}`,
                                                    state: {activeCategory: activeItem},

                                                }}
                                                key={category.id}

                                                style={{
                                                    textDecoration: 'none',
                                                    color: isActive ? 'lightgreen' : 'inherit',

                                                }}

                                                className="nav-link active mb-4">
                                                {category.category.toUpperCase()}

                                            </Link>

                                        </li>
                                    );
                                })}
                            </ul>
                        <div className="d-none d-lg-block text-center flex-grow-1">
                            <img className="Shop-Logo" src={logo} alt="webShopLogo"/>
                        </div>
                            <button data-testId="cart-btn" style={{backgroundColor: "white", border: "none"}}>
                                <i  id="modalCart" className="bi bi-cart me-5 pe-5 h3" data-bs-toggle="modal"
                                   data-bs-target="#exampleModal">

                                    <h6 className="Bubble" style={{position:"relative",bottom:"40px",left:"65px",backgroundColor:"black",color:"white",
                                    width:"20px",borderRadius:"50%"}}>{totalItems===0 ? "":totalItems}</h6>

                                </i>
                            </button>


                    </div>

                </div>
            </nav>
        );
    }
}

export default withRouter(withCart(NavigationBar));
