
class Services {

    async upload (file) {
        if(!file)
            throw new Error ("Файл не найден");
        else
            return {path: file.path.replace(/public/i, 'files')};
    }

}

module.exports = new Services;
