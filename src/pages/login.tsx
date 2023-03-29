import { useState } from "react";
import axios from 'axios';
import { parseCookies, setCookie } from 'nookies';
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event: any) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://strapi-production-5785.up.railway.app/api/auth/local', {
        identifier: email,
        password,
      });

      // Verificar si el usuario ha confirmado su cuenta
      if (!response.data.user.confirmed) {
        setError('Cuenta no confirmada');
        return;
      }

      // Guardar token en cookie con duración de 4 horas
      setCookie(null, 'token', response.data.jwt, {
        maxAge: 4 * 60 * 60, // Duración de 4 horas
        path: '/', // Disponible en todas las rutas
      });

      // Redireccionar a la página de inicio
      window.location.href = '/';
    } catch {
      setError('Usuario o contraseña incorrecta');
    }
  };

  // Verificar si ya hay una cookie de sesión
  const cookies = parseCookies();
  if (cookies.token) {
    // Redireccionar a la página de inicio
    window.location.href = '/';
  }

  return (
    <div className="login-form">
      <form onSubmit={handleLogin}>
        <Image className="logo" src={'/R.png'} width={200} height={105.4} alt={'...'}></Image>
        <label>
          Correo electrónico:
          <input type="email" onChange={e => setEmail(e.target.value) } value={email}/>
        </label>
        <label>
          Contraseña:
          <input type="password" onChange={e => setPassword(e.target.value) } value={password}/>
        </label>
        {error && <p>{error}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
};
