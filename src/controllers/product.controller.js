import { findProducts, findProductById, paginateProducts, createOneProduct, updateOneProduct, deleteOneProduct } from "../services/ProductService.js";

//Get all existing products.
export const getProducts = async (req, res) => {
    let { limit = 10, page = 1, category = undefined, stock = undefined, sort = undefined } = req.query;
    try {
        // Checking wrong params
        if (isNaN(page)) throw new Error("Parameter 'page' must be type: number")

        // Pagination filter and options
        let filter = {} // Contains category and stock filters
        if (category) filter.category = category
        if (stock) filter.stock = { $gt: stock - 1 }

        const options = {
            page,
            limit,
            sort: sort && Object.keys(sort).length ? sort : undefined
        };

        // Sorting definition, if no parameter is received, do not sort
        if (sort != undefined) {
            if (sort.toLowerCase() != "asc" && sort.toLowerCase() != "desc") {
                throw new Error("Invalid sorting parameter")
            } else {
                sort.toLowerCase() == "asc" ? options.sort = "price" : options.sort = "-price"
            }
        }
        
        
        // Perform the query with filters and sorting
        const products = await paginateProducts(filter, options)

        if ((page > products.totalPages) || (page <= 0)) throw new Error("Parameter 'page' is out of range")

        // Creating links to prev and next pages
        const categoryLink = category ? `&category=${category}` : ""
        const stockLink = stock ? `&stock=${stock}` : ""
        const limitLink = limit ? `&limit=${limit}` : ""
        const sortLink = sort ? `&sort=${sort}` : ""

        const prevPageLink = products.hasPrevPage ? `/api/products?page=${products.prevPage}${limitLink}${categoryLink}${stockLink}${sortLink}` : null
        const nextPageLink = products.hasNextPage ? `/api/products?page=${products.nextPage}${limitLink}${categoryLink}${stockLink}${sortLink}` : null

        res.send({
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: prevPageLink,
            nextLink: nextPageLink

        })

    } catch (error) {
        res.status(500).send({
            message: "Error en la búsqueda del producto.",
            error: error.message
        })
    }
}
//Get a single product
export const getProduct = async (req, res) => {
    try {
        const product = await findProductById(req.params.pid)
        res.send({
            status: "success",
            payload: product
        });
    } catch (error) {
        res.send({
            status: "error",
            payload: error
        })
    }
}
//Create a Product
export const createProduct = async (req, res) => {
    try {
        const info = req.body;
        let response = await createOneProduct(info);
        res.send({
            status: "success",
            payload: response,
        });
    } catch (error) {
        res.send({
            status: "error",
            payload: error,
        });
    }
}
//Update a single product
export const updateProduct = async (req, res) => {
    try {
        const product = await updateOneProduct(req.params.pid, req.body)
        res.status(200).send({
            status: "success",
            payload: `Producto ${JSON.stringify(product)} actualizado.`
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            payload: error
        })       
    }

}
//Delete a single product.
export const deleteProduct = async (req, res) => {
    try {
        const product = await deleteOneProduct(req.params.pid) 
        res.status(200).send({
            status: "success",
            payload: `Producto ${JSON.stringify(product)} eliminado.`
        })
    } catch (error) {
        res.status(500).send({
            status: "error",
            payload: error
        })
    }

}