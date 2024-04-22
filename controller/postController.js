const mongoose = require("mongoose");
const Post = require("../models/postModel");
const errorHandle = require("../service/errorHandle");
const successHandle = require("../service/successHandle");

const postController = {
    async getPosts(req, res) {
        const allposts = await Post.find();
        successHandle(res, allposts);
    },
    async postPosts(req, res) {
        try {
            const data = req.body;
            if (data.content.trim() !== undefined) {
                const newPost = await Post.create(
                    {
                        name: data.name,
                        location: data.location,
                        type: data.type,
                        tags: data.tags,
                        content: data.content,
                        image: data.image,
                        likes: data.likes
                    }
                );
                successHandle(res, newPost);
            } else {
                const message = "欄位未填寫正確，或無該筆貼文 id";
                errorHandle(res, message);
            }
        } catch (error) {
            const message = error;
            errorHandle(res, message);
        };
    },
    async deleteAllPosts(req, res) {
        await Post.deleteMany();
        res.status(200).send({
            "status": "success",
            "message": "已刪除全部貼文"
        });
        res.end();
    },
    async deletePosts(req, res) {
        const id = req.params.id;
        const idResult = await Post.findByIdAndDelete(id);
        // 找到可刪除的會回傳那筆的物件內容。找不到可刪除的則回傳 null
        // console.log(idResult);
        if (idResult !== null) {
            successHandle(res, null);
            
        } else {
            const message = '查無該筆貼文 id';
            errorHandle(res, message);
        };
    },
    async patchPosts(req, res) {
        try {
            const data = req.body;
            // console.log(data);
            const id = req.params.id;
            const idResult = await Post.findById(id);
            // 找到這筆 id 會回傳那筆的物件內容。找不到則回傳 null
            // console.log(idResult);
            if (data.content.trim() !== undefined && idResult !== null) {
                await Post.findByIdAndUpdate(
                    id,
                    {
                        name: data.name,
                        location: data.location,
                        type: data.type,
                        tags: data.tags,
                        content: data.content,
                        image: data.image,
                        likes: data.likes
                    }
                );
                successHandle(res, data);
            } else {
                const message = '查無該筆貼文內容或 id 屬性';
                errorHandle(res, message);
            };
        } catch (error) {
            const message = '查無該筆貼文 id';
            errorHandle(res, message);
        };
    },
};

module.exports = postController;

