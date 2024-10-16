import React, { useState, useRef, useEffect } from 'react';
import { ChatCategory } from './types';
import { 
  MessageCircle,
  Users,
  Bug,
  Phone,
  CheckCircle,
  UserPlus,
  Clock,
  ListFilter
} from 'lucide-react';
import '../../css/Agentes/ChatCategories.css';

interface ChatCategoriesProps {
  onCategoryChange: (category: string) => void;
}

const categories: ChatCategory[] = [
  { icon: <ListFilter size={20} />, label: 'Todos' },
  { icon: <MessageCircle size={20} />, label: 'Sin gestionar' },
  { icon: <Users size={20} />, label: 'Conversacion' },
  { icon: <Bug size={20} />, label: 'Depuracion' },
  { icon: <Phone size={20} />, label: 'Llamadas' },
  { icon: <Clock size={20} />, label: 'Segunda Llamada' },
  { icon: <CheckCircle size={20} />, label: 'Inscrito' },
  { icon: <UserPlus size={20} />, label: 'Venta Perdida' },
];

const ChatCategories: React.FC<ChatCategoriesProps> = ({ onCategoryChange }) => {
  const [activeCategory, setActiveCategory] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const handleWheel = (e: WheelEvent) => {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      };
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current!.offsetLeft);
    setScrollLeft(containerRef.current!.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleCategoryClick = (index: number) => {
    setActiveCategory(index);
    onCategoryChange(categories[index].label);
  };

  return (
    <div
      ref={containerRef}
      className="bg-gray-100 p-2 overflow-x-auto scrollbar-hide cursor-grab select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <div className="flex space-x-2 min-w-max">
        {categories.map((category, index) => (
          <button
            key={category.label}
            className={`flex items-center px-3 py-2 rounded-md whitespace-nowrap ${
              activeCategory === index ? 'bg-white text-blue-500' : 'text-gray-600'
            }`}
            onClick={() => handleCategoryClick(index)}
          >
            {category.icon}
            <span className="ml-2 text-sm font-medium">{category.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatCategories;