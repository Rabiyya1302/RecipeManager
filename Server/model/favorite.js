const mongoose = require('mongoose');
const favoriteSchema = new mongoose.Schema({
    recipeId: {
        type: mongoose.Schema.Types.ObjectId, ref: "Recipe",
        required: true
    },
    addedAt:{type:Date,default:Date.now}
})
module.exports=mongoose.model("Favorite",favoriteSchema)