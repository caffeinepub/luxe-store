import { useNavigate } from '@tanstack/react-router';

interface CategoryCardProps {
  name: string;
  image: string;
  productCount: number;
}

export default function CategoryCard({ name, image, productCount }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate({ to: '/products', search: { category: name } })}
      className="relative overflow-hidden rounded-xl cursor-pointer group shadow-luxury hover:shadow-luxury-lg transition-shadow"
      style={{ height: '220px' }}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-display text-xl font-bold text-white">{name}</h3>
        <p className="text-white/80 text-sm">{productCount} items</p>
      </div>
    </div>
  );
}
