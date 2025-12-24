import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import { Filter } from 'lucide-react';

interface Product {
    ID: number;
    Name: string;
    Price: number;
    ImageURL: string;
    CategoryID: number;
}

interface Category {
    ID: number;
    Name: string;
}

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories')
                ]);
                setProducts(prodRes.data);
                setCategories(catRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredProducts = selectedCategory
        ? products.filter(p => p.CategoryID === Number(selectedCategory))
        : products;

    return (
        <div>
            <div className="flex flex-col md:flex-row items-baseline justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
                    {selectedCategory
                        ? `${categories.find(c => c.ID === Number(selectedCategory))?.Name || 'Категория'} Коллекция`
                        : 'Все Товары'}
                </h1>
                <div className="text-gray-500 text-sm">
                    Показано {filteredProducts.length} товаров
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg">
                            <Filter className="w-5 h-5" />
                            Фильтры
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-700">Категории</h3>
                            <div className="flex flex-col space-y-2">
                                <button
                                    onClick={() => setSearchParams({})}
                                    className={`text-left px-3 py-2 rounded-lg transition text-sm ${!selectedCategory
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Все Категории
                                </button>
                                {categories.map(cat => (
                                    <button
                                        key={cat.ID}
                                        onClick={() => setSearchParams({ category: String(cat.ID) })}
                                        className={`text-left px-3 py-2 rounded-lg transition text-sm ${Number(selectedCategory) === cat.ID
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {cat.Name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="bg-white rounded-2xl p-4 shadow-sm animate-pulse h-96" />
                            ))}
                        </div>
                    ) : filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product) => (
                                <Link key={product.ID} to={`/products/${product.ID}`} className="group block h-full">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
                                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                                            <img
                                                src={product.ImageURL || `https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000`}
                                                alt={product.Name}
                                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">{product.Name}</h3>
                                            <div className="mt-auto pt-4 flex items-center justify-between">
                                                <p className="text-lg font-bold text-gray-900">${product.Price.toFixed(2)}</p>
                                                <span className="text-sm font-medium text-blue-600 group-hover:underline">Подробнее</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg">Товары в этой категории не найдены.</p>
                            <button
                                onClick={() => setSearchParams({})}
                                className="mt-4 text-blue-600 font-bold hover:underline"
                            >
                                Сбросить фильтры
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
