import React from 'react';
import { AuthProvider } from './context/AuthContext'; // Assurez-vous que le chemin est correct
import AppRoutes from './routes'; // Importez vos routes configurées
import Navbar from './components/Navbar';
import { BrowserRouter} from 'react-router-dom';

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <main>
            <AppRoutes /> {/* Composant qui gère toutes les routes */}
            {/* <ImageUploader /> */}
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
