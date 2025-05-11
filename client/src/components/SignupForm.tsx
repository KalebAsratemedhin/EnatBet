import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "@/redux/api/authApi";
import Snackbar from "./Snackbar";
import LoadingSpinner from "./LoadingSpinner";

const signupSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^\d+$/, "Phone must be digits only")
    .min(10, "Phone must be at least 10 digits")
    .required("Phone is required"),
  address: yup.string().required("Address is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup
    .string()
    .oneOf(["restaurant_owner", "delivery_person", "customer"], "Invalid role")
    .required("Role is required"),
});

type SignupFormValues = yup.InferType<typeof signupSchema>;

const SignupForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: yupResolver(signupSchema),
  });

  const [signup, { isError, isLoading, error, isSuccess }] =
    useSignupMutation();
  const navigator = useNavigate();
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await signup(data).unwrap();
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  useEffect(() => {
    if (isError) {
      setSnackbar({ message: "Error Signing up", type: "error" });
    }
    if (isSuccess) {
      setSnackbar({ message: "Signed up", type: "success" });
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      navigator(`/dashboard/${user.role}`);
    }
  }, [isError, isSuccess]);

  return (
    <div className="p-10 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-black">
        Sign Up to <span className="text-red-500">Enat Bet</span>
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-96">
        <InputField
          label="Full Name"
          name="name"
          register={register}
          error={errors.name?.message}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email?.message}
        />
        <InputField
          label="Phone Number"
          name="phoneNumber"
          register={register}
          error={errors.phoneNumber?.message}
        />
        <InputField
          label="Address"
          name="address"
          register={register}
          error={errors.address?.message}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password?.message}
        />

        {/* Dropdown for Role Selection */}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-gray-700 font-medium mb-1"
          >
            Select Role
          </label>
          <select
            id="role"
            {...register("role")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-500"
          >
            <option value="">-- Choose a Role --</option>
            <option value="restaurant_owner">Restaurant Owner</option>
            <option value="delivery_person">Delivery Person</option>
            <option value="customer">Customer</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Sign Up
          </button>
        )}

        <p className="text-sm text-gray-600 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/signin" className="text-red-500 hover:underline">
            Sign In
          </Link>
        </p>

        <p className="text-xs text-gray-500 mt-2 text-center">
          By signing up, you agree to our{" "}
          <a href="/terms" target="_blank" className="underline text-red-500">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="/privacy" target="_blank" className="underline text-red-500">
            Privacy Policy
          </a>
          .
        </p>
      </form>

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onClose={() => setSnackbar(null)}
        />
      )}
    </div>
  );
};

export default SignupForm;
