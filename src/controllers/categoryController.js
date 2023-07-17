const Category = require('../models/Category')

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body
        const newCategory = new Category({name})
        await newCategory.save()
        return res.status(200).json({newCategory})
    } catch (error) {
        return res.status(404).json({message: error.message})
    }
}

exports.getCategorys = async (req, res)=> {
    try {
        const { name } = req.query
        const categories = await Category.find({})
        if (!name) return res.status(200).json({categories})
        const categoryFilter = categories.filter((cate) => 
            cate.name.toLocaleLowerCase().includes(name.toLocaleLowerCase())
        )

        if(!categoryFilter.length) throw new Error('no type found with that name')

        return res.status(200).json({categoryFilter})
    } catch (error) {
        return res.status(404).json({message: error.message})
    }
}

exports.getCategoryById = async (req, res)=> {
    try {
        const { id } = req.params
        const category = await Category.findById(id)
        if (!category) throw new Error('category not found')
        return res.status(200).json({category})
    } catch (error) {
        return res.status(404).json({message: error.message})
    }
}

exports.deleteCategory = async (req, res)=> {
    try {
        const { id } = req.params
        const isRemovedCorrect = await Category.findOneAndRemove({_id:id})
        if (!isRemovedCorrect) throw new Error('the category does not exist')
        return res.status(200).json({message: `the category with id ${id} has been removed`})
    } catch (error) {
        return res.status(404).json({message: error.message})
    }
}