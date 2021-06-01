import React, {SetStateAction, useContext, useState} from 'react';
import {Button, Alert, Form} from "react-bootstrap";
import {signInUser} from "../api/login";
import {AppContext} from "../AppContext";

interface Props {
    setToken :React.Dispatch<SetStateAction<string|null>>
}

const Login: React.FC<Props> = ({setToken}) => {
    const [username, setUserName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [errs, setErrs] = useState<string>()
    const {apiHost} = useContext(AppContext)

    const handleSubmit = async (e :React.FormEvent) => {
        e.preventDefault();
        await signInUser(
            apiHost,
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
            <h1>Prihláste sa</h1>
            {errs && <Alert variant="danger">{errs}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Prihlasovacie meno</Form.Label>
                    <Form.Control
                        type="text"
                        onChange={e => setUserName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Heslo</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>

                <Button type="submit" variant="primary">Prihlásiť sa</Button>
            </Form>
        </div>
    )
}
export default Login;