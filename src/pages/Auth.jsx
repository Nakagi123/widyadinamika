// src/pages/Auth.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

function Auth() {
    const navigate = useNavigate();
    const { login, register, user, isAuthenticated } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'kasir') {
                navigate('/admin', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);

    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [registerForm, setRegisterForm] = useState({ username: "", password: "" });

    const handleLoginChange = (e) => {
        setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
        setError("");
    };

    const handleRegisterChange = (e) => {
        setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
        setError("");
    };
    
    const handleLoginSubmit = async () => {
        if (!loginForm.username || !loginForm.password) {
            setError("Username dan password harus diisi");
            return;
        }
        
        setLoading(true);
        setError("");
        
        const result = await login(loginForm.username, loginForm.password);
        
        setLoading(false);
        
        if (!result.success) {
            setError(result.error);
        }
        // Redirect will happen automatically via useEffect
    };

    const handleRegisterSubmit = async () => {
        if (!registerForm.username || !registerForm.password) {
            setError("Username dan password harus diisi");
            return;
        }
        
        if (registerForm.password.length < 6) {
            setError("Password minimal 6 karakter");
            return;
        }
        
        setLoading(true);
        setError("");
        
        const result = await register(registerForm.username, registerForm.password, false);
        
        setLoading(false);
        
        if (!result.success) {
            setError(result.error);
        }
        // Redirect will happen automatically via useEffect after login
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (isLogin) {
                handleLoginSubmit();
            } else {
                handleRegisterSubmit();
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center px-4">
            <div className="w-full max-w-md">

                {/* Logo */}
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Widyadinamika" className="h-10 w-auto" />
                        <span className="text-xl font-bold text-gray-900 font-poppins">Widyadinamika</span>
                    </div>
                    <p className="text-sm text-gray-400">Bersama Koperasi, Kebutuhan Sekolah Terpenuhi</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                    {/* Toggle */}
                    <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                        <button
                            onClick={() => {
                                setIsLogin(true);
                                setError("");
                            }}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                                ${isLogin ? "bg-white text-violet-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            Masuk
                        </button>
                        <button
                            onClick={() => {
                                setIsLogin(false);
                                setError("");
                            }}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                                ${!isLogin ? "bg-white text-violet-600 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            Daftar
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-red-600 text-sm text-center">{error}</p>
                        </div>
                    )}

                    {isLogin ? (
                        /* Login Form */
                        <div className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Selamat Datang!</h2>
                                <p className="text-sm text-gray-400 mt-1">Masuk ke akun kamu</p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={loginForm.username}
                                    onChange={handleLoginChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="username"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                                    autoComplete="username"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={loginForm.password}
                                        onChange={handleLoginChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition pr-10"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleLoginSubmit}
                                disabled={loading}
                                className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {loading ? "Memproses..." : "Masuk"}
                            </button>

                            <p className="text-center text-sm text-gray-400">
                                Belum punya akun?{" "}
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="text-violet-500 font-semibold hover:underline"
                                >
                                    Daftar sekarang
                                </button>
                            </p>
                        </div>

                    ) : (
                        /* Register Form */
                        <div className="flex flex-col gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Buat Akun</h2>
                                <p className="text-sm text-gray-400 mt-1">Daftar untuk mulai belanja</p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={registerForm.username}
                                    onChange={handleRegisterChange}
                                    onKeyPress={handleKeyPress}
                                    placeholder="pilih username"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
                                    autoComplete="username"
                                />
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={registerForm.password}
                                        onChange={handleRegisterChange}
                                        onKeyPress={handleKeyPress}
                                        placeholder="minimal 6 karakter"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition pr-10"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Password minimal 6 karakter</p>
                            </div>

                            <button
                                onClick={handleRegisterSubmit}
                                disabled={loading}
                                className="w-full py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {loading ? "Memproses..." : "Daftar"}
                            </button>

                            <p className="text-center text-sm text-gray-400">
                                Sudah punya akun?{" "}
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="text-violet-500 font-semibold hover:underline"
                                >
                                    Masuk di sini
                                </button>
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Auth;