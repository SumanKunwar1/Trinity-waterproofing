import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const Register: React.FC = () => {
  const handleSubmit = (values: any) => {
    // Implement registration logic here
    console.log('Register values:', values);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Register</h1>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          validationSchema={registerSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Input label="First Name" name="firstName" type="text" />
            <Input label="Last Name" name="lastName" type="text" />
            <Input label="Email" name="email" type="email" />
            <Input label="Password" name="password" type="password" />
            <Input label="Confirm Password" name="confirmPassword" type="password" />
            <Button type="submit" className="w-full mt-4">
              Register
            </Button>
          </Form>
        </Formik>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

