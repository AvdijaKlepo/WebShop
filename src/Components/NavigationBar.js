import {Component} from "react";

class NavigationBar extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            activeItem:null,
        };


    }
    handleItemClick = (item)=>{
        this.setState({activeItem: item});
    };

    renderNavItem = (itemName)=>{
        const {activeItem} = this.state;
        const isActive = activeItem === itemName;

        return(
            <li className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={()=> this.handleItemClick(itemName)}
                style={{borderBottom:isActive ? '1px solid lightgreen' : 'none'}}
            >
                <a
                    className="nav-link active mb-4"
                    style={{color:isActive ? 'lightgreen' : 'inherit'}}
                    href="#"
                    >
                    {itemName.toUpperCase()}</a>
            </li>
        );
    };


    render() {

        return (

               <nav className="navbar navbar-expand-lg p-4 fs-4">
                   <div className="container-fluid">
                       <div className="collapse navbar-collapse" id="navbarSupportedContent">
                           <ul className="navbar-nav me-4 ps-5 me-auto mb-2 mb-lg-0">
                               {['Women', 'Men', 'Kids'].map(this.renderNavItem)}
                           </ul>

                           <i className="bi bi-bag-check-fill col-5 me-lg-2 text-success h1"></i>
                           <i className="bi bi-cart me-5 pe-5 h3"></i>
                       </div>
                   </div>
               </nav>



        );
    }
}

export default NavigationBar;