const express=require('express');
const router=express.Router();
const Recipe=require('../model/Recipes');
router.get("/meal/:type",async(req,res)=>{
    const {type}=req.params;
    try {
        const recipes=await Recipe.find({mealType:type});
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({messsage:"Server error",error:error.message})
    }
})
module.exports=router;