import './App.css';
import { Component } from 'react';
import NavigationBar from './Components/NavigationBar';
import Products from './Components/Products';
import {  Routes, Route } from 'react-router-dom';


class App extends Component {
    render() {
        return (
            <div className="App">
                <main>
                    <NavigationBar />
                    <Routes>
                        <Route exact path="/" element={<Products />} />
                        <Route path="/products/:category_id" element={<Products />} />
                    </Routes>
                </main>
            </div>
        );
    }
}

export default App;
