import React, {SetStateAction, useState} from 'react';
import {signInUser} from "../api/login";

interface Props {
    setToken :React.Dispatch<SetStateAction<string|null>>
}

const Login: React.FC<Props> = ({setToken}) => {
    const [username, setUserName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errs, setErrs] = useState<string>()


    const handleSubmit = async (e :React.FormEvent) => {
        e.preventDefault();
        await signInUser(
            username,
            password
        ).then(
            (resp) => {
                if (resp.data !== undefined) {
                    setToken(resp.data.token)
                }
                setErrs(undefined)
            }
        ).catch(
            (err) => {
                if (err.response !== undefined && err.response.status === 403) {
                    setErrs("Nespravne meno alebo heslo.")
                } else {
                    setErrs("Chyba prihlasenia, skuste to neskor.")
                }
            }
        )
    }

    return(
        <div className="login-wrapper">
            <h1>Prihlaste sa</h1>
            {errs && <span>{errs}</span>}
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUserName(e.target.value)}/>
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={e => setPassword(e.target.value)} />
                </label>
                <div>
                    <button type="submit" >Submit</button>
                </div>
            </form>
        </div>
    )
}
export default Login;