export const generateProductErrorInfo = (product) => {
    return `Incomplete or invalid properties were found.
    PRODUCT Properties:
        * title         : (required) string, received ${typeof product.title}
        * description   : (required) string, received ${typeof product.description}
        * code          : (required) string, received ${typeof product.code}
        * price         : (required) number, received ${typeof product.number}
        * stock         : (required) number, received ${typeof product.stock}
        * category      : (required) string, received ${typeof product.category}
        * thumbnail    : array, received ${typeof product.thumbnails}`
}