const Dialog = require('../models/dialog');
const Mes = require('../models/message');
const User = require('../models/user');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


class DialogMessageServices {

     static async addDialog (body) {
        const findDialog = await Dialog.find({person:
            {$elemMatch:
                    {$or:[{'person.id': body.person[1].id}, {'id': body.person[0].id}]}
                },
            }
        );

        if (findDialog.length>0) {
            return findDialog[0];
        }

        const dialog = new Dialog(body);
        await dialog.save();
        return dialog
    }

    static async addMes (body) {

        const dialog = await Dialog.findOne({_id: body.dialog});

        if (!dialog) {
            throw new Error("dialog not found!");
        }

        const message = new Mes(body);
        await message.save();

        return message;
    }

    static async delDialog(id){
        await Dialog.deleteOne({_id: id.toString()});
        return "deleted"
    }

    static async delMes(id){
        await Mes.deleteOne({_id: id.toString()});
        return "deleted"
    }

    static async editDialog(body){
        return await Dialog.findOneAndUpdate({_id: body._id.toString()}, body);
    }

    static async editMes(body){
        return await Mes.findOneAndUpdate({_id: body._id.toString()}, body);
    }

    static async getDialog(dialogId){
        return await Dialog.findOne({_id: dialogId.toString()});
    }

    static async getDialogs(userId){
        // const dialogs = await Dialog.find({ person:{ $elemMatch: {id: userId.toString()}}});
        return await Dialog.aggregate([
            {$match: { person:{ $elemMatch: {id: userId}}}},

            { $addFields:
                    { persons:
                            {
                                $filter:
                                    {
                                        input: "$person", as: "id", cond:
                                            {$ne: ["$$id.id", userId]}
                                    }
                            }
                    }
            },
            {$unwind: "$persons" },
            {
                $lookup: {
                    from: "users",
                    localField: 'persons.id',
                    foreignField: '_id',
                    as: "persons"
                }
            },
            {$unwind: "$persons" },
            {$unset: ['person','__v', 'persons.password', 'persons.tokens', 'persons.__v', 'updatedAt']},
            {
                $lookup: {
                    from: "photos",
                    localField: 'persons.avatar',
                    foreignField: 'album',
                    as: "photos"
                }
            },

        ]);

    }

     static async getAllDialogs(){
        return await Dialog.find({}).select('_id');
    }

    static async getMessages(dialogId){
        return await Mes.find({dialog: dialogId.toString()});
    }

}

module.exports = DialogMessageServices;
