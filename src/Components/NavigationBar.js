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
                        <i className="bi bi-cart me-5 pe-5 h3" data-bs-toggle="modal"
                           data-bs-target="#exampleModal"></i>

                    </div>
                </div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel"
                     aria-hidden="true"

                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                ...
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close
                                </button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

    </nav>



    )
        ;
    }
}

export default NavigationBar;