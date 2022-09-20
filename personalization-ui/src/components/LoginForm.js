
import React, { useState, useEffect } from "react";

export default function LoginForm({ closeModal, login }) {
    const [state, setState] = useState({username: '', password: ''});

    useEffect(() => {
        document.body.style.pointerEvents = 'none';
        return () => document.body.style.pointerEvents = 'unset';
    }, []);


    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        login(state.username, state.password)
        closeModal()
    }



    return (
        <div className="modal" onClick={closeModal}>
            <form onSubmit={handleSubmit}>
                <div className="modal-content" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h4 className="modal-title">Login</h4>
                    </div>
                    <div className="modal-body">
                        <label>
                            Username :
                            <input
                                name="username"
                                type="text"
                                value={state.username}
                                onChange={handleInputChange} />
                        </label>
                        <br />
                        <label>
                            Password :
                            <input

                                name="password"
                                type="password"
                                value={state.password}
                                onChange={handleInputChange} />
                        </label>

                    </div>
                    <div className="modal-footer">
                        <button onClick={closeModal} className="button-modal-close">
                            Close
                        </button>
                        <button type="submit" className="button-modal-login">
                            Login
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );


}