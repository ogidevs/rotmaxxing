import {
   BrowserRouter as Router,
   Route,
   Routes,
   Navigate,
} from 'react-router-dom';
import LoginPage from './LoginPage'; // Your login page component
import HomePage from './HomePage'; // The page users see after login
import LoadingScreen from '@/components/custom/LoadingScreen'; // Import the LoadingScreen component
import AuthHandler from './AuthHandler'; // Import AuthHandler for authentication logic

const App = () => {
   const { authed } = AuthHandler(); // Get the isAuthenticated function directly from AuthHandler

   if (authed == null) {
      return <LoadingScreen />;
   }

   return (
      <Router>
         <div className="App">
            <Routes>
               {/* If the user is authenticated, navigate them to the dashboard */}
               <Route
                  path="/home"
                  element={authed ? <HomePage /> : <Navigate to="/start" />}
               />
               {/* Login route */}
               <Route
                  path="/start"
                  element={!authed ? <LoginPage /> : <Navigate to="/home" />}
               />
               {/* Add other routes here */}
               <Route
                  path="/"
                  element={<Navigate to={authed ? '/home' : '/start'} />}
               />
            </Routes>
         </div>
      </Router>
   );
};

export default App;
