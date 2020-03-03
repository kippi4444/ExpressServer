const Album = require('../models/album');
const User = require('../models/user');
const Photo = require('../models/photo');
const fs = require('fs');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class AlbumService {

    static async add (body) {

        const user = await  User.findOne({_id: body.owner});

        if (!user) {
            throw new Error("Owner not found!");
        }

        const album = new Album(body);
        await album.save();
        return album._id;
    }

    static async update (req){
        const album = await Album.findOneAndUpdate({_id: req.params.id}, req.body);
        const unwindAlbum = await this.getAlbum(album._id.toString());
        return unwindAlbum[0];
    }

    static async del(id){
        const photos =  await Photo.find({album: id});
        for (let p of photos){
            const getUrl = p.url.replace(/files/i, `public`);
            fs.unlink(getUrl, err => {
                console.log(err)});
        }
        await Photo.deleteMany({album: id.toString()});
        await Album.deleteOne({_id: id.toString()});
        return id
    }

    static async getAlbum (id) {
        return await Album.aggregate([
            {
                $match: { _id: ObjectId(id) }
            },
            {
                $lookup: {
                    from: "photos",
                    localField: '_id',
                    foreignField: "album",
                    as: "photos"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: 'owner',
                    foreignField: "_id",
                    as: "owner"
                }
            },
            { $unwind: "$owner" },
            {$unset: ['owner.password', 'owner.tokens']}
        ]);


    }

    static async getAllAlbums (login){
        const user = await User.findOne({login});

        return await Album.aggregate([
            {
                $match: { owner: user._id }
            },
            {
                $lookup: {
                    from: "photos",
                    localField: '_id',
                    foreignField: "album",
                    as: "photos"
                }
            },
            { $sort: { _id: 1} },
            {
                $lookup: {
                    from: "users",
                    localField: 'owner',
                    foreignField: "_id",
                    as: "owner"
                }
            },
            { $unwind: "$owner" },
            {$unset: ['owner.password', 'owner.tokens']}
        ]);
    }

}

module.exports = AlbumService;
