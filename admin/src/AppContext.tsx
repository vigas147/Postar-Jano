import React,{ReactNode} from "react";
import useToken from "./hooks/useToken";

interface TokenData {
    token :string|null
    setToken :React.Dispatch<React.SetStateAction<string|null>>
}

const AppContext = React.createContext<TokenData>({token:null, setToken:() => {}})

interface AppProps {
    children :React.ReactNode
}

function AppProvider({children} :AppProps) {
    const [token, setToken] = useToken()

    return (
        <AppContext.Provider value={{token,setToken}}>
            {children}
        </AppContext.Provider>
    )
}

export {AppProvider, AppContext}