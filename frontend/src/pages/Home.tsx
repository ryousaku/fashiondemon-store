import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Star, TrendingUp } from 'lucide-react';
import api from '../utils/api';
import { motion } from 'framer-motion';

interface Product {
    ID: number;
    Name: string;
    Price: number;
    ImageURL: string;
}

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                // Just taking first 4 for featured
                setFeaturedProducts(response.data.slice(0, 4));
            } catch (error) {
                console.error('Failed to fetch products', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="space-y-16">
            {/* Hero Section */}
            <section className="relative rounded-3xl overflow-hidden bg-gray-900 text-white shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2070"
                    alt="Fashion Header"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-20 px-8 py-24 md:py-32 md:px-16 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 inline-block">
                            Коллекция Зима 2025
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                            Стань демоном <br />
                            <span className="text-blue-500">стиля</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                            Откройте для себя последние тренды в моде. Премиум качество, экологичность и дизайн, который говорит за вас.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/products"
                                className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition flex items-center gap-2 group"
                            >
                                Каталог
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/products?category=sale"
                                className="border border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition"
                            >
                                Распродажа
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { icon: ShoppingBag, title: "Премиум Качество", text: "Тщательно отобранные материалы для вашего комфорта." },
                    { icon: TrendingUp, title: "Последние Тренды", text: "Всегда на шаг впереди с новыми стилями." },
                    { icon: Star, title: "Поддержка 5 Звезд", text: "Наша команда всегда готова помочь вам выглядеть лучше всех." },
                ].map((feature, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100">
                        <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-6 text-blue-600">
                            <feature.icon className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{feature.text}</p>
                    </div>
                ))}
            </section>

            {/* Featured Products */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Популярные Товары</h2>
                    <Link to="/products" className="text-blue-600 font-bold hover:underline">
                        Смотреть Все
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse">
                                <div className="bg-gray-200 h-64 rounded-xl mb-4" />
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map((product) => (
                            <Link key={product.ID} to={`/products/${product.ID}`} className="group">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                        <img
                                            src={product.ImageURL || `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1000`}
                                            alt={product.Name}
                                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {!product.ImageURL && (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                                                Нет фото
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition truncate">{product.Name}</h3>
                                        <p className="text-gray-500 font-medium">${product.Price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
