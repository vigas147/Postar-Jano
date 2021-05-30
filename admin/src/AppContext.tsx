import React,{ReactNode} from "react";
import useToken from "./hooks/useToken";

interface TokenData {
    apiHost :string
    token :string|null
    setToken :React.Dispatch<React.SetStateAction<string|null>>
}

const AppContext = React.createContext<TokenData>({apiHost:"",token:null, setToken:() => {}})

const defaultApiHost = "https://leto.sbb.sk"

interface AppProps {
    host :string|undefined
    children :React.ReactNode
}

function AppProvider({host, children} :AppProps) {
    const [token, setToken] = useToken()
    const apiHost = host || defaultApiHost
    return (
        <AppContext.Provider value={{apiHost,token,setToken}}>
            {children}
        </AppContext.Provider>
    )
}

export {AppProvider, AppContext}