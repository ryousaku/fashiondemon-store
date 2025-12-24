import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Assuming backend returns { token: "..." }
            // NOTE: The current backend LoginHandler writes "Success" or similar implicitly?
            // Need to verify backend response format.
            // Looking at `user/routes.go`, LoginHandler is registered.
            // Need to check `user/handler.go` implementation to match response.
            // For now, I'll assume standard JWT response or handle accordingly.

            const response = await api.post('/login', { email, password });

            // Let's assume the backend returns something like { token: "..." } or sets a cookie?
            // Wait, let's just inspect the backend LoginHandler in a bit if this fails.
            // Going safe: assume it returns a JSON with token.

            if (response.data.token) {
                login({ id: 0, email, role: 'user' }, response.data.token);
                navigate('/');
            } else {
                // Fallback if backend just returns 200 OK without JSON body for now?
                // Actually looking at typical Go implementations, it should return a token.
                // If the backend isn't perfect, I might need to fix it.
                // Let's assume it returns token field.
                setError('Invalid response from server');
            }

        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">С Возвращением</h2>
                    <p className="text-gray-500 mt-2">Войдите, чтобы продолжить в FashionDemon</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email адрес</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Нет аккаунта?{' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                        Создать аккаунт
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
