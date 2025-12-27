import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function MenuListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeNavigate = window.electron.subscribeNavigate((path) => {
      navigate(path);
    });

    const unsubscribeMenuAction = window.electron.subscribeMenuAction((action) => {
      console.log('Menu action received:', action);
      // Dispatch custom events or call IPC for shared actions
      if (action === 'toggle-server') {
        // We need to coordinate this with the actual state in MediaScreen
        // An easy way is to dispatch a DOM event
        window.dispatchEvent(new CustomEvent('menu-toggle-server'));
      }
      if (action === 'toggle-public') {
        window.dispatchEvent(new CustomEvent('menu-toggle-public'));
      }
    });

    return () => {
      unsubscribeNavigate();
      unsubscribeMenuAction();
    };
  }, [navigate]);

  return null;
}
