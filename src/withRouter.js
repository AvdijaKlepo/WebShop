import { useLocation, useParams,useNavigate } from 'react-router-dom';

export const withRouter = (Component) => {
    return (props) => {
        const params = useParams();
        const location = useLocation();
        const navigate = useNavigate();

        return <Component {...props} params={params} location={location} navigate={navigate} />;
    };
};
