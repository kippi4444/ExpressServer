const fs = require('fs');
const Photo = require('../models/photo');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class PhotoServices {

     async add (req) {
        const user = await  User.findOne({_id: req.user._id});
        if (!user) {
            throw new Error("Owner not found!");
        }
        let photos = [];
        for (let p of req.files){
            const getUrl = p.path.replace(/public/i, `files`);
            const body = {
                url: getUrl,
                album: ObjectId(req.params.id),
                owner: req.user._id,
            };
            const photo = new Photo (body);
            await  photo.save();
            photos.push(photo);
        }
        return photos;
    }


     async del(id){
        const photo = await Photo.findById(id.toString());
        const getUrl = photo.url.replace(/files/i, `public`);
        fs.unlink(getUrl, err => {
            console.log(err)});
        await Photo.deleteOne({_id: id.toString()});
        return "deleted"
    }

     async getPhoto (id) {

        return await Photo.find({_id: id.toString()}).populate('owner');
    }

     async getAllPhotos (login){
        const user = await User.findOne({login: login});
        return await Photo.find({owner: user._id}).sort({ _id: -1 }).populate('owner album');
    }

     async setAvatarUsers (req){
        const getUrl = req.file.path.replace(/public/i, `files`);
        const body = {
            url: getUrl,
            album: req.user.avatar,
            owner: req.user._id,
        };
        const photo = new Photo (body);
        await photo.save();
        // const getUrl = `files/${req.user._id}/${req.file.originalname}`;

        return 'ok';
    }

}

module.exports = new PhotoServices;
