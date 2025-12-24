import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user, logout, isAuthenticated } = useAuthStore();
    const cartItems = useCartStore((state) => state.items);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-bold text-gray-900 tracking-tight">
                        FASHION<span className="text-blue-600">DEMON</span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition">Главная</Link>
                        <Link to="/products" className="text-gray-600 hover:text-blue-600 font-medium transition">Магазин</Link>
                        {isAuthenticated && (
                            <Link to="/my-orders" className="text-gray-600 hover:text-blue-600 font-medium transition">Мои Заказы</Link>
                        )}
                    </nav>

                    <div className="flex items-center space-x-6">
                        <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition">
                            <ShoppingCart className="w-6 h-6" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="text-sm font-medium text-gray-700 hidden sm:block">
                                    {user?.email}
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition"
                                    title="Выйти"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">Войти</Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30"
                                >
                                    Регистрация
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto px-4 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white text-lg font-bold mb-4">FASHIONDEMON</h3>
                            <p className="text-sm">
                                Ваше лучшее место для модной и качественной одежды. Одевайтесь так, чтобы впечатлять.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-4">Магазин</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/products" className="hover:text-white transition">Все Товары</Link></li>
                                <li><Link to="/products?category=1" className="hover:text-white transition">Мужчинам</Link></li>
                                <li><Link to="/products?category=2" className="hover:text-white transition">Женщинам</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-4">Помощь</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-white transition">Контакты</a></li>
                                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                                <li><a href="#" className="hover:text-white transition">Доставка и Возврат</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-4">Будьте на связи!</h4>
                            <p className="text-sm mb-4"> Скидка 10% за подписку на новинки и акции</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Ваш email"
                                    className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition">
                                    ОК
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-sm text-gray-400">
                            &copy; 2025 FashionDemon. Все права защищены.
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-gray-500 text-sm hidden sm:block">Принимаем к оплате:</span>
                            <div className="flex items-center gap-3">
                                <div className="bg-gray-800 px-3 py-1.5 rounded flex items-center justify-center border border-gray-700" title="Visa">
                                    <span className="text-white font-bold tracking-wider text-sm italic">VISA</span>
                                </div>
                                <div className="bg-gray-800 px-3 py-1.5 rounded flex items-center justify-center border border-gray-700" title="MasterCard">
                                    <div className="flex relative">
                                        <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80 -ml-1"></div>
                                    </div>
                                </div>
                                <div className="bg-gray-800 px-3 py-1.5 rounded flex items-center justify-center border border-gray-700" title="МИР">
                                    <span className="text-green-500 font-bold text-sm">МИР</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
