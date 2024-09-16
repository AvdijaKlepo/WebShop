import React, { Component } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GET_CATEGORIES } from "../GraphQL/Queries";
import { Link } from "react-router-dom";

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
                this.setState({ categories: result.data.categories, loading: false });
            })
            .catch((error) => {
                this.setState({ error: error.message, loading: false });
            });
    }

    render() {
        const { categories, loading, error, activeItem } = this.state;

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;

        return (
            <nav className="navbar navbar-expand-lg p-4 fs-4">
                <div className="container-fluid">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-4 ps-5 me-auto mb-2 mb-lg-0">
                            {categories.map((category) => {
                                const isActive = activeItem === category.category;
                                return (
                                    <li
                                        key={category.id}
                                        className={`nav-item ${isActive ? 'active' : ''}`}
                                        onClick={() => this.handleItemClick(category.category)}
                                        style={{ borderBottom: isActive ? '3px solid lightgreen' : 'none' }}
                                    >
                                        <Link
                                            to={`/products/${category.id}`}
                                            style={{ textDecoration: 'none', color: isActive ? 'lightgreen' : 'inherit' }}

                                            className="nav-link active mb-4">
                                            {category.category.toUpperCase()}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <img className="Shop-Logo" src="/src/Assets/a-logo.png" alt="webShopLogo" />
                    <i id="modalCart" className="bi bi-cart me-5 pe-5 h3" data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                </div>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                ...
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }
}

export default NavigationBar;
