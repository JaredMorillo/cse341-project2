const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// Validation helper
function validateProduct(data) {
    return data.name && data.price && data.category && data.description && data.sku && data.stock && data.supplier;
}

const getAllProducts = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection('products').find();
        const products = await result.toArray();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const getSingleProduct = async (req, res) => {
    try {
        const productId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection('products').find({ _id: productId });
        const products = await result.toArray();
        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(products[0]);
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const createProduct = async (req, res) => {
    try {
        if (!validateProduct(req.body)) {
            return res.status(400).json({ error: 'Invalid product data' });
        }
        const product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock
        };
        const response = await mongodb.getDatabase().db().collection('products').insertOne(product);
        if (response.acknowledged) {
            res.status(201).json({ message: 'Product created successfully', productId: response.insertedId });
        } else {
            res.status(500).json({ error: 'An error occurred while creating the product' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        if (!validateProduct(req.body)) {
            return res.status(400).json({ error: 'Invalid product data' });
        }
        const productId = new ObjectId(req.params.id);
        const product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock
        };
        const response = await mongodb.getDatabase().db().collection('products').replaceOne({ _id: productId }, product);
        if (response.modifiedCount > 0) {
            res.status(200).json({ message: 'Product updated successfully' });
        } else {
            res.status(404).json({ error: 'Product not found or not updated' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const productId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection('products').deleteOne({ _id: productId });
        if (response.deletedCount > 0) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error', details: err.message });
    }
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct
};