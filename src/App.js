import './App.css';
import { Component } from 'react';
import NavigationBar from './Components/NavigationBar';
import Products from './Components/Products';
import {  Routes, Route } from 'react-router-dom';
import ProductDetails from "./Components/ProductDetails";
import Cart from "./Components/Cart";
import {CartProvider} from "react-use-cart";


class App extends Component {
    render() {
        return (
            <div className="App">
                <main>
                    <CartProvider><NavigationBar/>

                        <Routes>

                            <Route exact path="/products/:category_id" element={<Products/>}/>
                            <Route path="/productdetails/:id" element={<ProductDetails/>}/>
                        </Routes>
                        <Cart/></CartProvider>
                </main>
            </div>
        );
    }
}

export default App;
