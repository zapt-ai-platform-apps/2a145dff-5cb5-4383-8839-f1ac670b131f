import { createSignal, onMount, onCleanup } from 'solid-js';
import { supabase } from './supabaseClient';
import { Routes, Route, useNavigate } from '@solidjs/router';
import Home from './pages/Home';
import Setup from './pages/Setup';
import Login from './pages/Login';

function App() {
  const [user, setUser] = createSignal(null);
  const navigate = useNavigate();

  const checkUserSignedIn = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      navigate('/home', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  onMount(() => {
    checkUserSignedIn();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        navigate('/home', { replace: true });
      } else {
        setUser(null);
        navigate('/', { replace: true });
      }
    });

    onCleanup(() => {
      subscription.unsubscribe();
    });
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