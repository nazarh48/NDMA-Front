import { Form, FormikProvider, useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
// material
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// component
import useAuth from "../../hooks/useAuth";
import { toast } from "react-toastify";
import _axios from "../../components/Axios";
// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const { setUser, setIsAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Email must be a valid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      type: 1,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, actions) => {
      try {
        const response = await _axios("post", "/User/login", values);
        console.log(response);
        if (response.status === 200) {
          setUser(response.data.data.user);
          setIsAuthenticated(true);
          localStorage.setItem("NCOP-Auth-Token", response.data.data.token);
          navigate("/map", { replace: true });
        }
      } catch (err) {
        console.log(err);
        toast.error(err.response.data.message, {
          duration: 2000,
          closeButton: true,
        });
      }
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex justify-center flex-col gap-4 bg-gray-200 p-10 rounded-lg">
        <img src="/logoPng.png" alt="logo" className="h-20 object-contain" />
        <FormikProvider value={formik} autoComplete="off">
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ my: 2 }}>
              <TextField
                fullWidth
                autoComplete="username"
                type="email"
                label="Email address"
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? "text" : "password"}
                label="Password"
                {...getFieldProps("password")}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleShowPassword} edge="end">
                        <i
                          className={showPassword ? " fa-solid fa-eye " : " fa-solid fa-eye-slash "}
                        ></i>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Stack>

            <button type="submit" className="w-full bg-zinc-800  text-white hover:bg-zinc-900">
              Login
            </button>
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
}
