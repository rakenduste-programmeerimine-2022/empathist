import {useEffect, useState} from "react";
import '../../css/navbar/logo.css';

export const InteractiveLogo = ({handleSwitch}) => {

    const [clicks, setClicks] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            document.getElementById(("navTitle")).classList.add("is-size-1")

        },50)
    },[])

    const handleClick = () => {
        setClicks(clicks=>clicks + 1);
        if (clicks >= 6) {
            handleSwitch(false);
        }
    }

    useEffect(() => {
        let counter = 1
        const interval = setInterval(() => {
            let element = document.getElementById(`title-${counter}-char`)
            element.style.filter = `brightness(2) saturate(2) drop-shadow(0 0 20px yellow) `
            setTimeout(() => {
                element.style.filter = ` saturate(0.1) brightness(0.1) contrast(2) drop-shadow(0 20px 40px black)`
            },500)
            setTimeout(() => {
                element.style.filter = ` brightness(1) saturate(1)  `
            },500)
            if (counter < 9) {
                counter++
            }
            else {
                counter = 1
            }
        },1000)
        return () => clearInterval(interval)
    },[])



    return (
        <div
    className="navbar-item is-size-4-touch ml-3 mr-6 has-text-light"
    id="navTitle" style={{cursor: "none"}}>
            <div className="char" id="title-1-char" onMouseDown={handleClick}>E</div>
            <div className="char" id="title-2-char" onMouseDown={handleClick}>m</div>
            <div className="char" id="title-3-char" onMouseDown={handleClick}>p</div>
            <div className="char" id="title-4-char" onMouseDown={handleClick}>a</div>
            <div className="char" id="title-5-char" onMouseDown={handleClick}>t</div>
            <div className="char" id="title-6-char" onMouseDown={handleClick}>h</div>
            <div className="char" id="title-7-char" onMouseDown={handleClick}>i</div>
            <div className="char" id="title-8-char" onMouseDown={handleClick}>s</div>
            <div className="char" id="title-9-char" onMouseDown={handleClick}>t</div>
        </div>
    )
}