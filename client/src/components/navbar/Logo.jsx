import logo from "../../img/logo.svg";

export const Logo = ({handleSwitch}) => {
    return (
        <figure className="image is-96x96" style={{cursor:"pointer"}}>
            <img  src={logo} onClick={()=>handleSwitch(true)} alt="logo"/>
        </figure>
    )
}