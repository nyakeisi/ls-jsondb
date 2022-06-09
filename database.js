'use strict'

const fs = require('fs');

function checkFile(tablePath, tableName) {
    if (
        !fs.existsSync(
            tablePath+'/'+tableName+'.json', 
            'utf-8'
        )
    ) {
        const fileError = 'Unable to find table ./'+tableName+'.json'
        throw new Error(fileError) 
    }
}

function checkDir(tablePath) {
    if (
        !fs.existsSync(
            tablePath
        )
    ) {
        const dirError = 'Unable to find dir /'+tablePath+'/'
        throw new Error(dirError)
    }
}

class LissaSqueens {
    /**
     * The main class of database app.
     * @param {String} tablePath A path, that uses your database. (Supports multiple databases)
     * @param {Object} settings Settings to customize your experience using database.
     * @arg {Boolean} settings.usealerts - Alert writes and removes to the console.
     * @arg {Boolean} settings.usealerts - False by default.
     */
    constructor(tablePath, settings) {
        this.tablePath = tablePath;
        this.settings = settings;
    }

    /**
     * Write a line in database.
     * @param {String} tableName Name of the table (/tablePath/tableName.json).
     * @param {String} key Key in a table to write and then use it as beacon.
     * @param {Any} value 
     */
    write(tableName, key, value) {
        checkDir(this.tablePath)
        checkFile(this.tablePath, tableName)
        let data = fs.readFileSync(
            this.tablePath+'/'+tableName+'.json', 
            'utf-8'
        );
        data = JSON.parse(data);
        data[key] = value;
        fs.writeFileSync(
            this.tablePath+'/'+tableName+'.json', 
            JSON.stringify(
                data, 
                null, 
                '\t'
            )
        );
        if (this.settings && this.settings.usealerts == true) console.log('\nAlert: Added a new line to /'+this.tablePath+'/'+tableName+'.json:\n'+JSON.stringify(data[key], null, '\t'))
    }

    /**
     * Check if this key exists.
     * @returns {Boolean} Boolean
     * @param {String} tableName Name of the table (/tablePath/tableName.json).
     * @param {String} key Key in a table to write and then use it as beacon.
     */
     check(tableName, key) {
        checkDir(this.tablePath)
        checkFile(this.tablePath, tableName)
        let data = fs.readFileSync(
            this.tablePath+'/'+tableName+'.json', 
            'utf-8'
        );
        return (
            JSON.parse(data)[key] == undefined
                ? false
                : true
        )
    }

    /**
     * Read and return data of this key in database.
     * @returns {Any} If this key doesnt exist it returns undefined.
     * @param {String} tableName Name of the table (/tablePath/tableName.json).
     * @param {String} key Key in a table to write and then use it as beacon.
     */
    read(tableName, key) {
        checkDir(this.tablePath)
        checkFile(this.tablePath, tableName)
        let data = fs.readFileSync(
            this.tablePath+'/'+tableName+'.json', 
            'utf-8'
        );
        if (
            !JSON.parse(data)[key] || JSON.parse(data)[key] == undefined
        ) {
            return undefined;
        }
        return JSON.parse(data)[key];
    }

    /**
     * Edit single value of this key in database.
     * @param {String} tableName Name of the table (/tablePath/tableName.json).
     * @param {String} key Key in a table to write and then use it as beacon.
     * @param {Any} value 
     * @param {Any} subvalue New value of this subkey.
     */
     edit(tableName, key, value, subvalue) {
        checkDir(this.tablePath)
        checkFile(this.tablePath, tableName)
        let data = fs.readFileSync(
            this.tablePath+'/'+tableName+'.json', 
            'utf-8'
        );
        data = JSON.parse(data);
        if (!data[key]) {
            const keyError = 'Can\'t find "'+key+'" key in database. Unable to change it.'
            throw new Error(keyError)
        }
        if (typeof data[key] !== 'object' && subvalue && subvalue != null) {
            data[key][value] = subvalue;
            fs.writeFileSync(
                this.tablePath+'/'+tableName+'.json', 
                JSON.stringify(
                    data, 
                    null, 
                    '\t'
                )
            );
        } else {
            data[key] = value;
            fs.writeFileSync(
                this.tablePath+'/'+tableName+'.json', 
                JSON.stringify(
                    data, 
                    null, 
                    '\t'
                )
            );
        }
        if (this.settings && this.settings.usealerts == true) console.log('\nAlert: Edited a line in /'+this.tablePath+'/'+tableName+'.json:\n'+JSON.stringify(data[key], null, '\t'))
    }

    /** 
     * Remove a line in database.
     * @param {String} tableName Name of the table (/tablePath/tableName.json).
     * @param {String} key Key in a table to write and then use it as beacon.
     */
    remove(tableName, key) {
        checkDir(this.tablePath)
        checkFile(this.tablePath, tableName)
        let data = fs.readFileSync(
            this.tablePath+'/'+tableName+'.json', 
            'utf-8'
        );
        if (
            !JSON.parse(data)[key]
        ) {
            const keyError = 'Unable to find key: "'+key+'"'
            throw new Error(keyError)
        }
        data = JSON.parse(data);
        const oldResult = JSON.stringify(data[key], null, '\t')
        data[key] = undefined;
        fs.writeFileSync(
            this.tablePath+'/'+tableName+'.json', 
            JSON.stringify(
                data, 
                null, 
                '\t'
            )
        );
        if (this.settings && this.settings.usealerts == true) console.log('\nAlert: Removed a line from /'+this.tablePath+'/'+tableName+'.json:\n'+oldResult+'\nWARNING: THIS IS REMOVED LINE!')
    }

    /**
     * A random token generator.
     * @returns {String} String
     * @param {Number} length Length of the token you want to create.
     * @param {Object} parameters Parameters to customize the generator.
     * @arg {String} parameters.alphabet - An alphabet of allowed symbols in generated token.\
     * @arg {String} parameters.alphabet - "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" by default.
     * @arg {Array} parameters.notallowed - Remove some type(-s) of characters.
     * @arg {Array} parameters.notallowed - ["upperCaseString", "lowerCaseString", "number", "other?"]
     * @arg {Array} parameters.notallowed - "other" is used only if argument alphabet exists.
     * @arg {Array} parameters.notallowed - Nothing by default.
     */
    generateToken(length, parameters) { 
        if (typeof length !== "number") {
            const typeError = 'parameter must be a Number.'
            throw new Error(typeError)
        }
        if (length < 1 || length > 100) {
            if (length < 0) {
                var lengthError = 'parameter must be greater than 0.';
            }
            if (length > 100) {
                var lengthError = 'parameter must be less than 101.'
            }
            throw new Error(lengthError)
        }
        var result = '';
        if (!parameters) {
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        } else {
            if (parameters.alphabet) {
                var characters = parameters.alphabet
                if (parameters.alphabet.lenght < 2) {
                    const lengthError = 'parameter must be greater than 1 symbol.'
                    throw new Error(lengthError)
                }
                if (parameters.notallowed) {
                    var upperCase = ""
                    var lowerCase = ""
                    var numbers = ""
                    var others = ""
                    for (let i = 0; i < characters.length; i++) {
                        if (characters[i].match(/[0-9]/)) {
                            numbers += characters[i];
                        }
                        if (characters[i].match(/[a-z]/)) {
                            lowerCase += characters[i];
                        }
                        if (characters[i].match(/[A-Z]/)) {
                            upperCase += characters[i];
                        }
                        if (!characters[i].match(/[0-9]/) && !characters[i].match(/[A-Z]/)&& !characters[i].match(/[a-z]/)) {
                            others += characters[i];
                        }
                    }

                    if (parameters.notallowed.every(elem => ['lowerCaseString', 'upperCaseString', 'number', 'other'].includes(elem))) {
                        if ((parameters.notallowed).indexOf("lowerCaseString") >= 0) {
                            characters = characters.replace(lowerCase, '');
                        }
                        if ((parameters.notallowed).indexOf("upperCaseString") >= 0) {
                            characters = characters.replace(upperCase, '');
                        }
                        if ((parameters.notallowed).indexOf("number") >= 0) {
                            characters = characters.replace(numbers, '');
                        }
                        if ((parameters.notallowed).indexOf("other") >= 0) {
                            characters = characters.replace(others, '');
                        }
                        var charactersLength = characters.length;
                        for (var i = 0; i < length; i++) {
                            result += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                    }  else {
                        const arrayError = '"notallowed" can only read these params: ["lowerCaseString", "upperCaseString", "number", "other"]'
                        throw new Error(arrayError)
                    }
                } else {
                    var charactersLength = characters.length;
                    for (var i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                }
                return result;
            }
            if (parameters.notallowed && !parameters.alphabet) {
                if (parameters.notallowed.every(elem => ['lowerCaseString', 'upperCaseString', 'number',].includes(elem))) {
                    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        if ((parameters.notallowed).indexOf("lowerCaseString") >= 0) {
                            characters = characters.replace('abcdefghijklmnopqrstuvwxyz', '');
                        }
                        if ((parameters.notallowed).indexOf("upperCaseString") >= 0) {
                            characters = characters.replace('ABCDEFGHIJKLMNOPQRSTUVWXYZ', '');
                        }
                        if ((parameters.notallowed).indexOf("number") >= 0) {
                            characters = characters.replace('0123456789', '');
                        }
                    var charactersLength = characters.length;
                    for (var i = 0; i < length; i++) {
                        result += characters.charAt(Math.floor(Math.random() * charactersLength));
                    }
                    return result;
                }  else {
                    const arrayError = '"notallowed" can only read these params: ["lowerCaseString", "upperCaseString", "number"]'
                    throw new Error(arrayError)
                }
            }
        }
    }
}

module.exports = LissaSqueens;