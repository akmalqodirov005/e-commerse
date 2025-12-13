import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../features/auth/authSlice";
import api from "../../services/api";
import { useForm } from "react-hook-form";
import SplashCursor from "../../components/SplashCursor/SplashCursor";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });
      dispatch(login(res.data));
      navigate("/admin/products");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Login
        </h2>

        <div className="mb-5">
          <input
            {...register("email")}
            type="text"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>

        <div className="mb-6">
          <input
            {...register("password")}
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-black transition-all"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-900 transition-all font-medium"
        >
          Login
        </button>

        <div className="mt-6 text-gray-500 text-sm text-center">
          <p>
            email: <i>john@mail.com</i>
          </p>
          <p>
            password: <i>changeme</i>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;