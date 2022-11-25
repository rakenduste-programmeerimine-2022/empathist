import {useState} from "react";
import {useNavbarStore} from "../../store/store";

export const EnterName = () => {

    const isEnterNameOpen = useNavbarStore(state => state.isEnterNameOpen);
    const setIsEnterNameOpen = useNavbarStore(state => state.setIsEnterNameOpen);
    const setIsLoginOpen = useNavbarStore(state => state.setIsLoginOpen);
    const [name, setName] = useState('');
    const handleEnterName = ()=>{

    }
    const handleSwitchToLogin = ()=>{
        setIsLoginOpen(true);
        setIsEnterNameOpen(false);
    }

    return (
        <div className={isEnterNameOpen ? "modal is-active" : "modal"}>
            <div className="modal-background" onClick={()=>setIsEnterNameOpen(false)}></div>
            <div className="modal-card px-2">
                <header className="modal-card-head">
                    <p className="modal-card-title is-size-3">Enter your name</p>
                    <button
                        className="delete"
                        aria-label="close"
                        onClick={() => setIsEnterNameOpen(false)}
                    ></button>
                </header>
                <section className="modal-card-body">
                    <div className="field">
                        <label className="label is-size-5">Enter Name</label>
                        <div className="control">
                            <input
                                className="input"
                                type="text"
                                placeholder="Username"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></input>
                        </div>
                    </div>
                    <div className="field">
                        <p>
                            Already have an account? <button className="button is-text" style={{color:"#2565AE"}} onClick={handleSwitchToLogin}>Login</button>
                        </p>
                    </div>
                    <div className="field is-grouped">
                        <p className="control">
                            <button onClick={handleEnterName} className="button is-link" >
                                Submit
                            </button>
                        </p>
                        <p className="control">
                            <button
                                className="button is-link is-light"
                                onClick={() => setIsEnterNameOpen(false)}
                            >
                                Cancel
                            </button>
                        </p>
                    </div>
                </section>
            </div>
        </div>


    )
}