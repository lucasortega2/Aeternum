import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Category, Product } from '@/types/types';
interface Products {
  products: Product[];
  categories: Category[];
}

const Products: React.FC<Products> = ({ products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isLoading, setIsLoading] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const allCategories = [{ id: 'all', name: 'Todos' }, ...categories];
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Apply both category and search filters
    setIsLoading(true);
    // Only hide products during initial load
    if (isInitialRender.current) {
      setShowProducts(false);
    }

    // Simulate loading delay

    const filtered = products.filter((product) => {
      // Apply category filter
      const categoryMatch =
        selectedCategory === 'all' || product.category_id === selectedCategory;

      // Apply search filter (case insensitive)
      const searchMatch =
        searchTerm === '' ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch;
    });

    setFilteredProducts(filtered);
    setIsLoading(false);

    // Only trigger fade-in animation on initial render
    if (isInitialRender.current) {
      setShowProducts(true);
      isInitialRender.current = false; // Mark initial render as complete
    }
  }, [selectedCategory, searchTerm, products]);

  return (
    <div className="pt-28 pb-20">
      <div className="text-center mb-16 animate-fade-in">
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Nuestra colleción
        </h1>
        <p className="text-aeternum-accent/70 max-w-2xl mx-auto">
          Descubre nuestros productos, creados para quienes valoran la
          durabilidad y el buen diseño.
        </p>
      </div>
      {/* Category Filter and Search */}
      <div className="mb-12 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Category Filter */}
          <div className="overflow-x-auto scrollbar-hidden w-full md:w-auto">
            <div className="flex space-x-2 min-w-max py-2">
              {allCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-aeternum-accent/20 text-aeternum-highlight'
                      : 'bg-transparent text-aeternum-accent/70 hover:text-aeternum-highlight'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Busca tus productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-aeternum-medium border border-aeternum-accent/20 rounded-full py-2 pl-10 pr-4 text-aeternum-highlight placeholder:text-aeternum-accent/40 focus:outline-none focus:border-aeternum-accent/50 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-aeternum-accent/50 w-4 h-4" />
          </div>
        </div>
      </div>
      {/* Products Grid */}
      <div className="min-h-[500px]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-aeternum-medium/50 rounded-lg h-80 animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`transition-all duration-500 ease-in-out ${
                  showProducts
                    ? 'opacity-100 transform translate-y-0'
                    : 'opacity-0 transform translate-y-8'
                }`}
                style={{
                  transitionDelay: showProducts ? `${index * 200}ms` : `0ms`,
                }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  url={product.url[0]}
                  category_id={product.category_id}
                  featured
                />
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-aeternum-accent/70">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
