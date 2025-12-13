import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { Carousel, InputNumber, message, Slider } from "antd";
import Search from "antd/es/input/Search";
import { addToCart } from "../../features/cartSlice/cartSlice";
import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";

export default function Products() {
  const [sliderValue, setSliderValue] = useState([30, 50]);
  const [finalValue, setFinalValue] = useState(sliderValue);
  const [isDisabled, setIsDisabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const productsRef = useRef(null);
  const offset = Number(searchParams.get("offset")) || 0;
  const limit = Number(searchParams.get("limit")) || 10;

  const dispatch = useDispatch();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", finalValue, searchQuery, offset, limit],
    queryFn: async () => {
      const res = await api.get(
        `/products/?price_min=${finalValue[0]}&price_max=${finalValue[1]}&title=${searchQuery}&offset=${offset}&limit=${limit}`
      );
      return res.data;
    },
  });

  const { data: category } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await api.get("/categories");
      return res.data;
    },
  });

  // Initial load tugagandan keyin flag o'zgartirish
  useEffect(() => {
    if (data) {
      setIsInitialLoad(false);
    }
  }, [data]);

  const scrollToProducts = () => {
    if (!productsRef.current || isInitialLoad) return;

    const headerHeight = 100;
    const top = productsRef.current.offsetTop - headerHeight;

    window.scrollTo({
      top: top,
      behavior: "smooth",
    });
  };

  const getProductsByCategory = (categoryName) => {
    return (
      data?.filter(
        (product) =>
          product.category.name.toLowerCase() === categoryName.toLowerCase()
      ) || []
    );
  };

  const getCategoryHeroData = () => {
    if (!category || !data) return [];

    return category.slice(0, 5).map((cat) => {
      const products = getProductsByCategory(cat.name);
      const firstProduct = products[0];

      return {
        id: cat.id,
        name: cat.name,
        image:
          firstProduct?.images?.[0] ||
          cat.image ||
          "https://via.placeholder.com/400",
        title: `${cat.name} Collection`,
        description: `Discover amazing ${cat.name.toLowerCase()} products`,
      };
    });
  };

  const heroSlides = getCategoryHeroData();

  const onSearch = (value) => setSearchQuery(value);

  useEffect(() => {
    if (isDisabled) {
      setSliderValue([1, 500]);
      setFinalValue([1, 500]);
    }
  }, [isDisabled]);

  const onChange = (currentSlide) => console.log(currentSlide);

  const filteredProducts = data?.filter((product) => {
    const matchesCategory =
      categoryFilter === "all" ||
      product.category.name.toLowerCase() === categoryFilter.toLowerCase();

    return matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Slider */}
      <div className="max-w-7xl pt-[100px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Carousel autoplay arrows className="rounded-2xl overflow-hidden mb-8">
          {heroSlides.map((slide, index) => {
            const gradients = [
              "from-blue-600 via-indigo-600 to-purple-700",
              "from-pink-500 via-rose-500 to-red-600",
              "from-amber-500 via-orange-500 to-red-600",
              "from-green-500 via-emerald-500 to-teal-600",
              "from-purple-500 via-violet-500 to-fuchsia-600",
            ];

            const gradient = gradients[index % gradients.length];

            return (
              <div
                key={slide.id}
                className={`relative h-64 md:h-96 bg-gradient-to-br ${gradient} overflow-hidden`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute inset-0 flex items-center justify-between px-8 md:px-16">
                  <div className="text-white max-w-xl z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg capitalize">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-2xl mb-6 drop-shadow-md">
                      {slide.description}
                    </p>
                    <button
                      onClick={scrollToProducts}
                      className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                      Shop Now
                    </button>
                  </div>
                  <div className="hidden md:block relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-110"></div>
                    <img
                      src={slide.image}
                      alt={slide.name}
                      className="relative w-80 h-80 object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>

        {/* Category Pills */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide md:scrollbar-default">
            <button
              onClick={() => {
                setCategoryFilter("all");
                scrollToProducts();
              }}
              className={`
                snap-start shrink-0
                px-4 sm:px-5 py-2 sm:py-2.5 
                rounded-xl border transition-all whitespace-nowrap
                flex items-center gap-2 shadow-sm
                ${
                  categoryFilter === "all"
                    ? "bg-black text-white border-black shadow-md"
                    : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:shadow"
                }
              `}
            >
              <span className="text-xs sm:text-sm font-medium">All</span>
            </button>

            {category?.map((cat) => {
              const isActive = categoryFilter === cat.name.toLowerCase();

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoryFilter(cat.name.toLowerCase());
                    scrollToProducts();
                  }}
                  className={`
                    snap-start shrink-0
                    px-4 sm:px-5 py-2 sm:py-2.5 
                    rounded-xl border transition-all whitespace-nowrap
                    flex items-center gap-2 shadow-sm
                    ${
                      isActive
                        ? "bg-black text-white border-black shadow-md"
                        : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:shadow"
                    }
                  `}
                >
                  <span className="text-xs sm:text-sm font-medium capitalize">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Search
                className="flex-1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onSearch={onSearch}
                placeholder="Search products..."
                size="large"
              />

              <button
                onClick={() => setIsDisabled((p) => !p)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDisabled
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isDisabled ? "Enable Filter" : "Disable Filter"}
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Price Range</h3>

              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Min</label>
                  <InputNumber
                    disabled={isDisabled}
                    min={1}
                    max={500}
                    value={sliderValue[0]}
                    onChange={(v) => setSliderValue((p) => [v, p[1]])}
                    className="!w-28"
                    size="large"
                    prefix="$"
                  />
                </div>

                <div className="flex-1 pt-6">
                  <Slider
                    disabled={isDisabled}
                    range
                    min={1}
                    max={500}
                    value={sliderValue}
                    onChange={setSliderValue}
                    onAfterChange={() => setFinalValue(sliderValue)}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-500">Max</label>
                  <InputNumber
                    disabled={isDisabled}
                    min={1}
                    max={500}
                    value={sliderValue[1]}
                    onChange={(v) => setSliderValue((p) => [p[0], v])}
                    className="!w-28"
                    size="large"
                    prefix="$"
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Showing products between{" "}
                <span className="font-medium text-gray-900">
                  ${sliderValue[0]}
                </span>{" "}
                and{" "}
                <span className="font-medium text-gray-900">
                  ${sliderValue[1]}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <main>
          {isLoading && (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Loading products...</p>
            </div>
          )}

          {isError && (
            <div className="py-12 text-center">
              <p className="text-red-500 text-lg">
                {error?.message || "Something went wrong"}
              </p>
            </div>
          )}

          {!isLoading && filteredProducts?.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your filters
              </p>
            </div>
          )}

          <div
            ref={productsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredProducts?.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <Link to={`/products/${product.id}`}>
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <Carousel
                      autoplay
                      arrows
                      afterChange={onChange}
                      className="h-full"
                    >
                      {product.images?.slice(0, 3).map((img, i) => (
                        <div key={i} className="h-full">
                          <img
                            src={img}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </Carousel>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2 h-12">
                      {product.title}
                    </h3>

                    {product.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </p>
                    </div>
                  </div>
                </Link>

                <div className="px-4 pb-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      dispatch(addToCart(product));
                      message.success(`${product.title} added to cart`);
                    }}
                    className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-black text-white hover:bg-gray-800 transition-colors active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={offset <= 0}
            onClick={() => {
              setSearchParams({ offset: offset - 10, limit: 10 });
              scrollToProducts();
            }}
            className={`
              px-6 py-2 rounded-lg font-medium text-sm transition-all shadow 
              flex items-center gap-2
              ${
                offset <= 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
              }
            `}
          >
            ← Prev
          </button>

          <span className="text-gray-600 text-sm font-medium">
            Page: {offset / 10 + 1}
          </span>

          <button
            onClick={() => {
              setSearchParams({ offset: offset + 10, limit: 10 });
              scrollToProducts();
            }}
            className="
              px-6 py-2 rounded-lg font-medium text-sm transition-all 
              bg-black text-white hover:bg-gray-800 shadow flex items-center gap-2
            "
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}