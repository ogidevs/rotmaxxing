import { useEffect } from 'react';
import {
   BrowserRouter as Router,
   Route,
   Routes,
   Navigate,
} from 'react-router-dom';
import LoginPage from './LoginPage'; // Your login page component
import HomePage from './HomePage.tsx'; // The page users see after login
import AuthHandler from './AuthHandler'; // Import AuthHandler for authentication logic

const App = () => {
   const { isAuthenticated } = AuthHandler(); // Get the isAuthenticated function directly from AuthHandler

   useEffect(() => {
      // No need to set any local state for isAuthenticated anymore
   }, [isAuthenticated]);

   return (
      <Router>
         <div className="App">
            <Routes>
               {/* If the user is authenticated, navigate them to the dashboard */}
               <Route
                  path="/home"
                  element={
                     isAuthenticated() ? <HomePage /> : <Navigate to="/start" />
                  }
               />
               {/* Login route */}
               <Route
                  path="/start"
                  element={
                     !isAuthenticated() ? (
                        <LoginPage />
                     ) : (
                        <Navigate to="/home" />
                     )
                  }
               />
               {/* Add other routes here */}
               <Route
                  path="/"
                  element={
                     <Navigate to={isAuthenticated() ? '/home' : '/start'} />
                  }
               />
            </Routes>
         </div>
      </Router>
   );
};

export default App;
