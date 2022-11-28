import {useNavbarStore} from "../../store/store";

export const Notification = () => {
    const globalNotification = useNavbarStore(state => state.globalNotification);
    const isNotificationOpen = useNavbarStore(state => state.isNotificationOpen);
    const setIsNotificationOpen = useNavbarStore(state => state.setIsNotificationOpen);


    return (
        <div className={ isNotificationOpen? "modal is-active" : "modal"}>
            <div className="modal-background" onClick={()=>setIsNotificationOpen(false)}></div>
                <div className="modal-card px-2">
                    <header className="modal-card-head">
                        <p className="modal-card-title is-size-2">Notification</p>
                        <button
                            className="delete"
                            aria-label="close"
                            onClick={()=>setIsNotificationOpen(false)}
                        ></button>
                    </header>
                    <section className="modal-card-body">
                        <div className="field">
                            <div className="is-size-5 is-bold">{globalNotification}</div>
                        </div>
                    </section>
            </div>
        </div>
    )
}