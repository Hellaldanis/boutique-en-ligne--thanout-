const FALLBACK_IMAGE = 'https://via.placeholder.com/600x600?text=Thanout';

const toNumber = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    return value;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const resolveCategoryName = (category) => {
  if (!category) {
    return 'Sans catégorie';
  }

  if (typeof category === 'string') {
    return category;
  }

  return category.name || category.title || category.slug || 'Sans catégorie';
};

const resolveCategorySlug = (category) => {
  if (!category || typeof category === 'string') {
    return null;
  }

  return category.slug || null;
};

const resolveImage = (product) => {
  if (!product) {
    return FALLBACK_IMAGE;
  }

  const imageFromArray = Array.isArray(product.images) && product.images.length > 0
    ? (product.images.find((img) => img.isPrimary)?.imageUrl || product.images[0].imageUrl)
    : null;

  return (
    product.image ||
    product.imageUrl ||
    product.thumbnailUrl ||
    imageFromArray ||
    product.mainImage ||
    FALLBACK_IMAGE
  );
};

export const normalizeProduct = (product = {}) => {
  if (!product || typeof product !== 'object') {
    return null;
  }

  const price = toNumber(product.price) ?? 0;
  const oldPrice = toNumber(product.oldPrice);
  const discountFromPayload = product.discount ?? product.discountPercentage;
  const computedDiscount = oldPrice && price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : null;
  const discount = discountFromPayload ?? computedDiscount ?? 0;
  const rating = toNumber(product.averageRating ?? product.rating) ?? 0;
  const reviewCount = toNumber(product.reviewCount ?? product.reviews ?? product._count?.reviews) ?? 0;
  const stockQuantity = toNumber(product.stock ?? product.stockQuantity) ?? 0;

  return {
    ...product,
    price,
    oldPrice,
    discount,
    averageRating: rating,
    rating,
    reviews: reviewCount,
    reviewCount,
    stock: stockQuantity,
    stockQuantity,
    category: resolveCategoryName(product.category),
    categorySlug: product.categorySlug || resolveCategorySlug(product.category),
    image: resolveImage(product)
  };
};

export const normalizeProductCollection = (payload) => {
  if (Array.isArray(payload)) {
    return payload.map(normalizeProduct);
  }

  if (payload && Array.isArray(payload.products)) {
    return {
      ...payload,
      products: payload.products.map(normalizeProduct)
    };
  }

  return normalizeProduct(payload);
};

export const getNormalizedProductArray = (payload) => {
  const normalized = normalizeProductCollection(payload);

  if (!normalized) {
    return [];
  }

  if (Array.isArray(normalized)) {
    return normalized;
  }

  if (Array.isArray(normalized.products)) {
    return normalized.products;
  }

  return [normalized];
};
