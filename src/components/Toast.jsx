import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Info, AlertCircle, Flower2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Toast = ({ id, message, type, onRemove }) => {
    const icons = {
        success: <Check className="text-green-500" size={18} />,
        error: <AlertCircle className="text-red-500" size={18} />,
        info: <Info className="text-maua-primary" size={18} />,
        flower: <Flower2 className="text-maua-primary" size={18} />,
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className="flex items-center gap-3 bg-white border border-stone-100 shadow-lg rounded-2xl p-4 min-w-[300px] pointer-events-auto"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)'
            }}
        >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-maua-bg flex items-center justify-center border border-maua-primary/10">
                {type === 'success' && message.includes('panier') ? icons.flower : icons[type] || icons.info}
            </div>
            
            <div className="flex-1">
                <p className="text-stone-700 text-sm font-medium leading-tight">
                    {message}
                </p>
            </div>

            <div className="flex items-center gap-2 pl-2">
                <button 
                    onClick={() => onRemove(id)}
                    className="text-maua-primary text-xs font-bold uppercase tracking-wider hover:opacity-70 transition-opacity"
                >
                    OK
                </button>
            </div>
        </motion.div>
    );
};

const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none max-w-[90vw]">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast 
                        key={toast.id} 
                        {...toast} 
                        onRemove={removeToast} 
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ToastContainer;
