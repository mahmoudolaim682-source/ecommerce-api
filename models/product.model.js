import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, "Product name is required"], 
        minlength: [3, "Product name must be at least 3 characters long"], 
        maxlength: [20, "Product name must be at most 20 characters long"], 
        trim: true, 
        index: true
    },

    description: { 
        type: String, 
        maxlength: [200, "Description must be at most 200 characters long"], 
        trim: true 
    },

    price: { 
        type: Number, 
        required: [true, "Price is required"], 
        min: [0, "Price must be greater than 0"],
        validate: {
            validator: Number.isFinite,
            message: "Price must be a valid number"
        }
    },

    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
        lowercase: true,
        enum: {
            values: ["electronics", "clothing", "home", "beauty", "sports"],
            message: "{VALUE} is not a valid category"
        },
        minlength: [3, "Category must be at least 3 characters"],
        maxlength: [30, "Category must be less than 30 characters"],
        index: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z\s]+$/.test(value);
            },
            message: "Category must contain only letters"
        }
    },

    brand: {
        type: String,
        required: [true, "Brand is required"],
        trim: true,
        uppercase: true,
        minlength: [2, "Brand must be at least 2 characters"],
        maxlength: [25, "Brand must be less than 25 characters"],
        index: true,
        validate: {
            validator: function (value) {
                return /^[a-zA-Z0-9\s]+$/.test(value);
            },
            message: "Brand must contain letters and numbers only"
        }
    },

    inStock: { 
        type: Boolean, 
        default: true 
    }

}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;