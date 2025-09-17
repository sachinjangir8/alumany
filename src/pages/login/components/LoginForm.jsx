import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { Checkbox } from "../../../components/ui/Checkbox";
import Icon from "../../../components/AppIcon";
import { useAuth } from "../../../contexts/AuthContext";
import { handleSupabaseError } from "../../../utils/supabaseService";
import { supabase } from "../../../lib/supabase";

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "alumni",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  // Mock credentials for different user types
  const mockCredentials = {
    "admin@punjab.gov.in": {
      password: "Admin@123",
      role: "administrator",
      redirect: "/alumni-dashboard",
    },
    "alumni@example.com": {
      password: "Alumni@123",
      role: "alumni",
      redirect: "/alumni-dashboard",
    },
    "student@college.edu": {
      password: "Student@123",
      role: "student",
      redirect: "/alumni-dashboard",
    },
    "faculty@college.edu": {
      password: "Faculty@123",
      role: "faculty",
      redirect: "/alumni-dashboard",
    },
    "manager@punjab.gov.in": {
      password: "Manager@123",
      role: "management",
      redirect: "/alumni-dashboard",
    },
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData?.password) {
      newErrors.password = "Password is required";
    } else if (formData?.password?.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isSignUp) {
        const { error } = await signUp(formData?.email, formData?.password, {
          full_name: formData?.fullName,
          role: formData?.role,
        });
        if (error) {
          setErrors({
            general: handleSupabaseError(
              error,
              "Sign up failed. Please try again."
            ),
          });
        } else {
          // If email confirmations are enabled, instruct user
          navigate("/alumni-dashboard");
        }
      } else {
        const { error } = await signIn(formData?.email, formData?.password);
        if (error) {
          setErrors({
            general: handleSupabaseError(
              error,
              "Login failed. Please try again."
            ),
          });
        } else {
          navigate("/alumni-dashboard");
        }
      }
    } catch (error) {
      setErrors({
        general:
          "Network error. Please check your internet connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData?.email) {
      setErrors({
        general: "Enter your email above, then click Forgot password.",
      });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(
        formData?.email,
        {
          redirectTo: window?.location?.origin + "/login",
        }
      );
      if (error) {
        setErrors({
          general: handleSupabaseError(error, "Could not send reset email."),
        });
      } else {
        alert("Password reset email sent. Please check your inbox.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    setIsSignUp((prev) => !prev);
    setErrors({});
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card rounded-lg shadow-elevation-2 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp
              ? "Sign up to start using AlumniConnect"
              : "Sign in to your AlumniConnect account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors?.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <Icon
                name="AlertCircle"
                size={20}
                className="text-red-500 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1">
                <p className="text-red-700 text-sm font-medium">
                  Authentication Failed
                </p>
                <p className="text-red-600 text-sm mt-1">{errors?.general}</p>
              </div>
            </div>
          )}

          {/* Demo Credentials Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-700 text-sm font-medium mb-2">
              Demo Credentials:
            </p>
            <div className="text-xs text-blue-600 space-y-1">
              <p>
                <strong>Admin:</strong> admin@punjab.gov.in / Admin@123
              </p>
              <p>
                <strong>Alumni:</strong> alumni@example.com / Alumni@123
              </p>
              <p>
                <strong>Student:</strong> student@college.edu / Student@123
              </p>
              <p>
                <strong>Faculty:</strong> faculty@college.edu / Faculty@123
              </p>
              <p>
                <strong>Manager:</strong> manager@punjab.gov.in / Manager@123
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {isSignUp && (
              <Input
                label="Full name"
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                value={formData?.fullName}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            )}
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData?.email}
              onChange={handleInputChange}
              error={errors?.email}
              required
              disabled={isLoading}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData?.password}
              onChange={handleInputChange}
              error={errors?.password}
              required
              disabled={isLoading}
            />

            {isSignUp && (
              <div className="text-xs text-muted-foreground">
                By creating an account you agree to our Terms and Privacy
                Policy.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData?.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
            />

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            iconName={isSignUp ? "UserPlus" : "LogIn"}
            iconPosition="right"
            disabled={isLoading}
          >
            {isLoading
              ? isSignUp
                ? "Creating Account..."
                : "Signing In..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={handleCreateAccount}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              disabled={isLoading}
            >
              {isSignUp ? "Sign in" : "Create new account"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
