
class Services {

    async upload (req) {

        let filedata = req.file;
        console.log(filedata);
        if(!filedata)
            throw new Error ("Ошибка при загрузке файла");
        else
            return "Файл загружен";
    }

}

module.exports = new Services;
