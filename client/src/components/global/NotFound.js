import {Link} from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <div className="title">404 - Not Found!</div>
        <Link to="/">Go to home page</Link>
    </div>
  )
}
export default NotFound
