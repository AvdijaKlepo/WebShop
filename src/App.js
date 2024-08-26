import './App.css';
import {Component} from "react";
import NavigationBar from "./Components/NavigationBar";
import Products from "./Components/Products";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetails from "./Components/ProductDetails";

class App extends Component  {



    render() {


    return (
        <div className="App">

            <NavigationBar/>

                <main>

                <Routes>
                    <Route exact path="/"  element={<Products/>}/>
                    <Route path="/ProductDetails" element={<ProductDetails/>}/>
                </Routes>
                </main>


        </div>

    );
  }
}

export default App;
