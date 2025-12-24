import { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Trash2, Plus, Minus, ArrowRight, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Cart = () => {
    const { items, removeFromCart, updateQuantity, total, clearCart } = useCartStore();
    const { isAuthenticated } = useAuthStore();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        setIsCheckingOut(true);
        try {
            // Create request body matching existing order struct if possible
            // Existing backend expects logic probably? 
            // Checking `order/routes.go`: CreateOrderHandler
            // `order/model.go` suggests it contains Total and OrderItems.
            // Typically CreateOrderHandler would read user ID from context and items from body.
            // Let's deduce body from typical practice, probably { items: [{product_id, quantity}] }

            const orderData = {
                items: items.map(item => ({
                    ProductID: item.id,
                    Quantity: item.quantity,
                    Price: item.price // Some backends might want price, some calculate it server side. Sending just in case or simpler
                }))
            };

            await api.post('/orders', orderData);
            setOrderSuccess(true);
            clearCart();
        } catch (error) {
            console.error('Checkout failed', error);
            alert('Checkout failed. Please try again.');
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-green-100 p-6 rounded-full text-green-600 mb-6">
                    <CheckCircle className="w-16 h-16" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Заказ Успешно Оформлен!</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    Спасибо за покупку. Ваш заказ подтвержден и скоро будет отправлен.
                </p>
                <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
                    Продолжить Покупки
                </Link>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ваша корзина пуста</h2>
                <p className="text-gray-500 mb-8">Похоже, вы еще ничего не добавили в корзину.</p>
                <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition">
                    Начать Покупки
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Корзина</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                                <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Сумма Заказа</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Подытог</span>
                                <span>${total().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Доставка</span>
                                <span>Бесплатно</span>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
                                <span>Итого</span>
                                <span>${total().toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isCheckingOut ? 'Оформление...' : 'Оформить заказ'}
                            {!isCheckingOut && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
