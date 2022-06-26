const updateBlog = async function (req, res) {
    try {

        let data = req.body
        let blogId = req.params.blogId;
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ msg: "Please provide blog details" })
        }

        let title = req.body.title
        let body = req.body.body
        let tags = req.body.tags
        let subcategory = req.body.subcategory
        let Data = Date.now()

        const updateblog = await blogModel.findByIdAndUpdate
            ({ _id: blogId, isDeleted: false },
                { $set: { title: title, body: body, tags: tags, subcategory: subcategory, isPublished: true, publishedAt: Data } },
                { new: true })

        console.log(updateblog)
        // blogid exist ka bar m TA se dicuss
        // if do not provide the blog id
        res.status(200).send({ status: true, data: updateblog })

    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}