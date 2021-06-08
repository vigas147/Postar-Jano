import React, {useContext} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import EventList from "./components/EventList";
import RegistrationList from "./components/RegistrationList";
import Login from "./components/Login";
import {AppContext} from "./AppContext";
import {Navbar, Nav} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';


const App: React.FC = () => {
    const {token, setToken} = useContext(AppContext);
    // TODO: check token validity

    if(!token) {
        return <Login setToken={setToken}/>
    }

    return (
         <div className="wrapper">
           <BrowserRouter basename="/admin">
               <Navbar bg="light">
                   <Navbar.Brand>Leto 2021</Navbar.Brand>
                   <Nav style={{display:'flex', width:'100%'}}>
                       <Nav.Link>
                           <Link to="/events">
                               Akcie
                           </Link>
                       </Nav.Link>
                       <Nav.Link>
                           <Link to="/registrations">
                               Prihlaseni
                           </Link>
                       </Nav.Link>
                       <Nav.Link style={{marginInlineStart:'auto'}}>
                            <button
                                onClick={() => setToken(null)}
                            >Odhlasit sa</button>
                       </Nav.Link>
                   </Nav>
               </Navbar>
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
