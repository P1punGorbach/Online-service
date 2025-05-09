// authContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export default AuthContext;
export function AuthProvider({ children }) {


  const [user, setUser] = useState(null);
  useEffect(() => {
    // Функция для получения текущего пользователя
    async function fetchUser() {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include' // если используются cookie
        });
        if (!response.ok) {
          throw new Error('Ошибка получения пользователя');
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
        setUser(null); // на случай ошибки
      }
    }

    fetchUser();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const x = useContext(AuthContext);
  console.log(x)
  return x
}
