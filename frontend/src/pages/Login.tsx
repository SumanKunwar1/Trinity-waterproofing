import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const Login: React.FC = () => {
  const handleSubmit = (values: any) => {
    // Implement login logic here
    console.log('Login values:', values);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Input label="Email" name="email" type="email" />
            <Input label="Password" name="password" type="password" />
            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </Form>
        </Formik>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

