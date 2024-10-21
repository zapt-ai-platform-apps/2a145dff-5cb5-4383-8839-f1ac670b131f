import { createSignal, onMount, createEffect } from 'solid-js';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Routes, Route, useNavigate } from '@solidjs/router';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Login from './pages/Login';

function App() {
  const [user, setUser] = createSignal(null);
  const navigate = useNavigate();

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      navigate('/home', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  onMount(checkUserSignedIn);

  createEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/home', { replace: true });
      } else {
        setUser(null);
        navigate('/', { replace: true });
      }
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/setup" element={<Setup user={user} />} />
      <Route path="/home" element={<Home user={user} />} />
    </Routes>
  );
}

export default App;