import logo from "../../img/head-logo.svg";
import {useEffect} from "react";

export const Logo = ({handleSwitch}) => {
    useEffect(() => {
        setTimeout(() => {
            document.getElementById(("iconFigure")).classList.add("is-96x96")
        },50)
    },[])
    return (
        <figure id="iconFigure" className="image is-48x48" style={{cursor:"pointer",transition:"all 400ms ease-in"}}>
            <img className="icon pr-5 m-4"  src={logo} onClick={()=>handleSwitch(true)} alt="logo"/>
        </figure>
    )
}