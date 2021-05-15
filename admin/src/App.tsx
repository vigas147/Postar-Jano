import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import EventList from "./components/EventList";
import RegistrationList from "./components/RegistrationList";
import Login from "./components/Login";
import useToken from "./hooks/useToken";

const App: React.FC = () => {
    const [token,setToken] = useToken();
    // TODO: check token validity

    if(!token) {
        return <Login setToken={setToken}/>
    }

    return (
         <div className="wrapper">
           <h1>Prihlasovanie Leto 2021</h1>

           <BrowserRouter>
               <Link to="events">
                   Akcie
               </Link>
               <Link to="registrations">
                   Prihlaseni
               </Link>
             <Switch>
               <Route path="/events">
                 <EventList/>
               </Route>
                <Route path="/registrations">
                 <RegistrationList setToken={setToken} token={token}/>
               </Route>
             </Switch>
           </BrowserRouter>
         </div>
    );
}

export default App;
