
import { useUserStore } from '../Store/useUserStore';
import { toast } from "sonner";

const useLogout = () => {
  const setUser = useUserStore(state => state.setUser);

  const logout = async () => {
    try {
      // Example: call your logout API (adjust endpoint as needed)
      const res = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        return;
      }
      // Clear local storage
      localStorage.removeItem('user');
      // Clear Zustand state
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error(error.message || String(error));
    }
  };

  return logout;
};

export default useLogout;


// import useLogout from '../hooks/useLogout';

// function LogoutButton() {
//   const logout = useLogout();

//   return (
//     <button onClick={logout}>
//       Logout
//     </button>
//   );
// }