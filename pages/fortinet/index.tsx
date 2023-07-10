/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { parseCookies, setCookie } from "nookies";
import { useRouter } from "next/router";
import { LoginForm } from "@/components";
import styles from "@styles/login.module.scss";
import { FormikHelpers } from "formik";
import { useEffect } from "react";
import { LoginFormValues } from "@/models";

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = async (
    values: LoginFormValues,
    { setSubmitting, setFieldError }: FormikHelpers<LoginFormValues>
  ) => {
    try {
      const response = await axios.post(
        "https://strapi-production-d5a4.up.railway.app/api/auth/local",
        {
          identifier: values.email,
          password: values.password,
        }
      );

      // Verificar si el usuario ha confirmado su cuenta
      if (!response.data.user.confirmed) {
        setFieldError("email", "Cuenta no confirmada");
        return;
      }

      // Guardar token en cookie con duración de 8 horas
      setCookie(null, "token_fortinet", response.data.jwt, {
        maxAge: 8 * 60 * 60,
        path: "/",
      });

      // Redireccionar a la página de menú
      router.push("/fortinet/menu");
    } catch (error) {
      setFieldError("email", "Usuario o contraseña incorrecta");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.token_fortinet && router.pathname == "/fortinet") {
      // Redireccionar a la página de menú
      router.push("/fortinet/menu");
    }
  }, []);

  return (
    <div className={styles.loginForm}>
      <LoginForm
        width={180}
        height={180}
        logoSrc="/logo2.jpg"
        handleLogin={handleLogin}
      />
    </div>
  );
};

export default LoginPage;
