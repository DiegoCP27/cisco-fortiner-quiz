import React from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Image from "next/image";
import styles from "@styles/login.module.scss"

type LoginFormProps = {
  handleLogin: (values: LoginFormValues, helpers: FormikHelpers<LoginFormValues>) => void;
  logoSrc: string;
  width: number
  height: number
};

type LoginFormValues = {
  email: string;
  password: string;
};

const LoginForm = ({ handleLogin, logoSrc, width, height }: LoginFormProps) => (
  <Formik
    initialValues={{
      email: '',
      password: '',
    }}
    validationSchema={Yup.object().shape({
      email: Yup.string().email('Correo electrónico inválido').required('Campo requerido'),
      password: Yup.string().required('Campo requerido'),
    })}
    onSubmit={handleLogin}
  >
    <Form>
      <Image priority={false} className={styles.logo} src={logoSrc} width={width} height={height} alt={'...'} />
      <div>
        <label htmlFor="email">Correo electrónico:</label>
        <Field type="email" id="email" name="email" />
        <ErrorMessage name="email" component="div" className={styles.errorMessage} />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <Field type="password" id="password" name="password" />
        <ErrorMessage name="password" component="div" className={styles.errorMessage} />
      </div>
      <button type="submit">Iniciar sesión</button>
    </Form>
  </Formik>
);

export default LoginForm;
