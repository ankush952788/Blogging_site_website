const updateBlog = async function (req, res) {
    try {
  
      let data = req.query;
      let filter = {
  
        //DELETE BLOG POINT NUMBER 1
        // isDeleted: false,
        // isPublished: true,
        ...data
      }
      const { authorId, category, tags, subcategory } = data
      if (category) {
        let verifyCategory = await blogModel.find({ category: category })
        if (!verifyCategory) {
          return res.status(400).send({ status: false, msg: "No Blogs In This Category Exist" })
        }
      }
      if (tags) {
        let verifyTag = await blogModel.find({ tags: tags })
        if (!verifyTag) {
          return res.status(400).send({ status: false, msg: "No Blogs In This Tags Exist" })
        }
      }
      if (subcategory) {
        let verifySubcategory = await blogModel.find({ subcategory: subcategory })
        if (!verifySubcategory) {
          return res.status(400).send({ status: false, msg: "No Blogs In This SubCategory Exist" })
        }
      }
      if (authorId) {
        if (!mongoose.isValidObjectId(authorId))
          return res.status(400).send({ status: false, msg: "Invalid AuthorId" })
      }
  
      let getRecord = await blogModel.find(filter).populate("authorId")
  
  
      if (getRecord.length == 0) {
        return res.status(404).send({
          data: "Data Not Found"
        })
      }
  
      return res.status(200).send({ status: true,msg:"get", data: getRecord })
    }
    catch (err) {
      res.status(500).send({ msg: err.name })
    }
    }
  