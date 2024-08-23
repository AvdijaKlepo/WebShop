import './App.css';
import {Component} from "react";
import NavigationBar from "./Components/NavigationBar";
import Products from "./Components/Products";

class App extends Component  {



    render() {


    return (
        <div className="App">
            <NavigationBar/>

            <Products/>

        </div>

    );
  }
}

export default App;
