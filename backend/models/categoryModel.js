const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

categorySchema.pre('validate', function() {
    if(this.name && !this.slug) {
        this.slug = this.name.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g, '');
    }
})


module.exports = mongoose.model("Category", categorySchema);