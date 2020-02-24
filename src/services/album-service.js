const Album = require('../models/album');
const User = require('../models/user');
const Photo = require('../models/photo');

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
        await Album.updateOne({_id: req.params.id}, req.body);
        return "ok";
    }

    static async del(id){
        const photos =  await Photo.find({album: id.toString()});
        for (p of photos){
            const getUrl = p.url.replace(/files/i, `public`);
            fs.unlink(getUrl, err => {
                console.log(err)});
        }
        await Photo.deleteMany({album: id.toString()});
        await Album.deleteOne({_id: id.toString()});
        return "deleted"
    }

    static async getAlbum (id) {
        const album = await Album.aggregate([
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

            { $unset: ["tokens", "__v", "password"] }
        ]);
        return  await Album.populate(album, {path: "owner"});

    }

    static async getAllAlbums (login){

        const user = await User.findOne({login});

        const albums = await Album.aggregate([
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

            { $unset: ["tokens", "__v", "password"] }
        ]);
        return  await Album.populate(albums, {path: "owner"});
    }

}

module.exports = AlbumService;
