import React, {useContext} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import EventList from "./components/EventList";
import RegistrationList from "./components/RegistrationList";
import Login from "./components/Login";
import {AppContext} from "./AppContext";
import 'bootstrap/dist/css/bootstrap.min.css';


const App: React.FC = () => {
    const {token, setToken} = useContext(AppContext);
    // TODO: check token validity

    if(!token) {
        return <Login setToken={setToken}/>
    }

    return (
         <div className="wrapper">
           <h1>Prihlasovanie Leto 2021</h1>

           <BrowserRouter>
               <Link to="/events">
                   Akcie
               </Link>
               <Link to="/registrations">
                   Prihlaseni
               </Link>
               <button onClick={() => setToken(null)}>Odhlasit sa</button>
             <Switch>
                <Route path="/events">
                  <EventList/>
                </Route>
                 <Route path="/registrations/:event">
                     <RegistrationList/>
                 </Route>
                <Route path="/registrations">
                  <RegistrationList/>
                </Route>

             </Switch>
           </BrowserRouter>
         </div>
    );
}

export default App;
