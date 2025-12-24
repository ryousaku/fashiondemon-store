import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, ArrowLeft, Truck, ShieldCheck, RefreshCw } from 'lucide-react';

interface Product {
    ID: number;
    Name: string;
    Description: string;
    Price: number;
    ImageURL: string;
    CategoryID: number;
    InStock: boolean;
}

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (isLoading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

    const handleAddToCart = () => {
        addToCart({
            id: product.ID,
            name: product.Name,
            price: product.Price,
            image: product.ImageURL || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000'
        });
    };

    return (
        <div className="max-w-6xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-gray-900 transition mb-6"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Назад к товарам
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                {/* Product Image */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 aspect-square relative">
                    <img
                        src={product.ImageURL || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000'}
                        alt={product.Name}
                        className="w-full h-full object-cover object-center"
                    />
                </div>

                {/* Product Info */}
                <div className="flex flex-col justify-center">
                    <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2">Эксклюзив FashionDemon</span>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.Name}</h1>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-bold text-gray-900">${product.Price.toFixed(2)}</span>
                        {product.InStock ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">В наличии</span>
                        ) : (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">Нет в наличии</span>
                        )}
                    </div>

                    <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                        {product.Description || "Создано для современных людей, ценящих стиль и комфорт. Это изделие выполнено из премиальных материалов, обеспечивая долговечность и идеальную посадку для любого случая."}
                    </p>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-gray-600">
                            <div className="bg-gray-100 p-2 rounded-full"><Truck className="w-5 h-5" /></div>
                            <span className="text-sm font-medium">Бесплатная доставка и возврат</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <div className="bg-gray-100 p-2 rounded-full"><ShieldCheck className="w-5 h-5" /></div>
                            <span className="text-sm font-medium">Гарантия 2 года включена</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                            <div className="bg-gray-100 p-2 rounded-full"><RefreshCw className="w-5 h-5" /></div>
                            <span className="text-sm font-medium">30 дней гарантии возврата денег</span>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!product.InStock}
                        className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        <ShoppingCart className="w-6 h-6 group-hover:animate-bounce" />
                        В Корзину
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
