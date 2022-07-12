'use strict'

const fs = require('fs');

function checkFile(tablePath, tableName) {
    if (
        !fs.existsSync(
            tablePath + '/' + tableName + '.json',
            'utf-8'
        )
    ) {
        const fileError = 'Unable to find table ./' + tableName + '.json'
        throw new Error(fileError)
    }
}

function checkDir(tablePath) {
    if (
        !fs.existsSync(
            tablePath
        )
    ) {
        const dirError = 'Unable to find dir /' + tablePath + '/'
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
     * Remove table inside foolder.
     * @param {String} tableName Name of the table (/tablePath/tableName.json).
     */
    removeTable(tableName) {
        checkDir(this.tablePath)
        if (
            fs.existsSync(
                this.tablePath + '/' + tableName + '.json',
                'utf-8'
            )
        ) {
            fs.unlink(this.tablePath + '/' + tableName + '.json',
                function (error) {
                    if (error) throw new Error(error)
                }
            );
            if (
                fs.existsSync(
                    tablePath + '/' + tableName + '-rules.json',
                    'utf-8'
                )
            ) {
                fs.unlink(this.tablePath + '/' + tableName + '-rules.json',
                    function (error) {
                        if (error) throw new Error(error)
                    }
                );
            }
            if (this.settings && this.settings.usealerts == true) console.log('Alert: deleted table with name "' + tableName + '".')
        } else {
            const fileError = 'Unable to find table ./' + tableName + '.json'
            throw new Error(fileError)
        }
    }

    /**
     * Create a new table inside foolder.
     * @param {String} tableName Name of the table (/tablePath/tableName.json).
     * @param {Object} parameters Parameters for strict requirements.
     * @arg {Any} parameter 
     */
    createTable(tableName, parameters) {
        checkDir(this.tablePath)
        switch (parameters && parameters != undefined) {
            default: {
                if (
                    fs.existsSync(
                        this.tablePath + '/' + tableName + '.json',
                        'utf-8'
                    )
                ) {
                    if (this.settings && this.settings.usealerts == true) console.log('Alert: created a new table "' + tableName + '" with strict mode:\n' + JSON.stringify(parameters, null, '\t'))
                    let result = {}
                    fs.writeFileSync(this.tablePath + '/' + tableName + '.json', JSON.stringify(result));
                    fs.writeFileSync(this.tablePath + '/' + tableName + '-rules.json', JSON.stringify(parameters, null, '\t'));
                } else {
                    if (this.settings && this.settings.usealerts == true) console.log('Alert: created a new table "' + tableName + '" with strict mode. Cleared old one.')
                    let result = {}
                    fs.writeFileSync(this.tablePath + '/' + tableName + '.json', JSON.stringify(result));
                    fs.writeFileSync(this.tablePath + '/' + tableName + '-rules.json', JSON.stringify(parameters, null, '\t'));
                }
                break;
            }
            case undefined: {
                if (
                    fs.existsSync(
                        this.tablePath + '/' + tableName + '.json',
                        'utf-8'
                    )
                ) {
                    if (this.settings && this.settings.usealerts == true) console.log('Alert: created a new table "' + tableName + '" withour strict mode.')
                    let result = {}
                    fs.writeFileSync(this.tablePath + '/' + tableName + '.json', JSON.stringify(result));
                } else {
                    if (this.settings && this.settings.usealerts == true) console.log('Alert: created a new table "' + tableName + '" without strict mode. Cleared old one.')
                    let result = {}
                    fs.writeFileSync(this.tablePath + '/' + tableName + '.json', JSON.stringify(result));
                }
                break;
            }
        }
    }

    /**
     * Read whole amount of increments.
     */
    readIncrement() {
        checkDir(this.tablePath)
        let incr = fs.readFileSync(
            __dirname + '/increment.json',
            'utf-8'
        );
        incr = JSON.parse(incr)
        console.log(JSON.stringify(incr, null, '\t'))
    }

    /**
     * edit increment value.
     * @param {String} tableName Name of the table (/tablePath/tableName.json).
     * @param {Number} value 
     */
    editIncrement(tableName, value) {
        checkDir(this.tablePath)
        let incr = fs.readFileSync(
            __dirname + '/increment.json',
            'utf-8'
        );
        incr = JSON.parse(incr)
        if (!value instanceof Number) {
            const typeError = '"value" must be a NUMBER type.'
            throw new Error(typeError)
        }
        if (value < 1) {
            const valueError = '"value" must be greater than 0.'
            throw new Error(valueError)
        }
        var ex = false;
        var doub = false;
        for (const [key, val] of Object.entries(incr)) {
            if (key == tableName) ex = true;
            if (val == value) doub = true;
        }
        switch (ex) {
            case true: {
                if (doub == true) {
                    if (this.settings && this.settings.usealerts == true) console.log('\nAlert: Increment value of ' + tableName + ' == value. Nothing to change.')
                } else {
                    if (this.settings && this.settings.usealerts == true) console.log('\nAlert: Increment value of ' + tableName + ' is now ' + value + '.')
                    incr[tableName] = value
                    fs.writeFileSync(
                        __dirname + '/increment.json',
                        JSON.stringify(
                            incr,
                            null,
                            '\t'
                        )
                    )
                }
                break;
            }
            case false: {
                const listError = 'couldn\'t find.'
                throw new Error(listError)
            }
        }
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
            this.tablePath + '/' + tableName + '.json',
            'utf-8'
        );
        if (data && tableName.endsWith('-rules')) {
            const fileError = 'Don\'t edit RULE file: ./' + tableName + '.json'
            throw new Error(fileError)
        }
        if (
            fs.existsSync(
                this.tablePath + '/' + tableName + '-rules.json',
                'utf-8'
            )
        ) {
            var rules = fs.readFileSync(
                this.tablePath + '/' + tableName + '-rules.json',
                'utf-8'
            );
        }
        let incr = fs.readFileSync(
            __dirname + '/increment.json',
            'utf-8'
        );
        data = JSON.parse(data);
        data[key] = value;
        if (rules) {
            if (value instanceof Object) {
                rules = JSON.parse(rules);
                var isValue = true
                for (const [input] of Object.entries(value)) {
                    for (const [arule] of Object.entries(rules)) {
                        if (input === arule) {
                            isValue = true
                        } else {
                            isValue = false
                        }
                    }
                }
                if (isValue == false) {
                    const validError = 'parameters in "value" are not the same as in rule file.'
                    throw new Error(validError)
                }
                for (const [rule, rulevalue] of Object.entries(rules)) {
                    if (this.settings && this.settings.usealerts == true) console.log(`${rule}: ${rulevalue}   =>   ${(typeof value[rule]).toUpperCase()} (${(typeof value[rule]).toUpperCase() == rulevalue ? true : false})`)
                    switch (typeof value[rule]) {
                        case "string": {
                            if (rulevalue == 'AUTO_INCREMENT' && value[rule] == "AUTO_INCREMENT") {
                                console.log('# "' + rule + '" is now AUTO_INCREMENT.')
                                break;
                            }
                            if (rulevalue != 'STRING') {
                                const typeError = 'in rule-file "' + value[rule] + '" is instance of ' + rulevalue
                                throw new Error(typeError)
                            }
                            break;
                        }
                        case "number": {
                            if (rulevalue == 'AUTO_INCREMENT' && value[rule] == "AUTO_INCREMENT") {
                                console.log('# "' + rule + '" is now AUTO_INCREMENT.')
                                break;
                            }
                            if (rulevalue != 'NUMBER') {
                                const typeError = 'in rule-file "' + value[rule] + '" is instance of ' + rulevalue
                                throw new Error(typeError)
                            }
                            break;
                        }
                        case "object": {
                            if (rulevalue == 'AUTO_INCREMENT' && value[rule] == "AUTO_INCREMENT") {
                                console.log('# "' + rule + '" is now AUTO_INCREMENT.')
                                break;
                            }
                            if (rulevalue != 'OBJECT') {
                                const typeError = 'in rule-file "' + value[rule] + '" is instance of ' + rulevalue
                                throw new Error(typeError)
                            }
                            break;
                        }
                        case "array": {
                            if (rulevalue == 'AUTO_INCREMENT' && value[rule] == "AUTO_INCREMENT") {
                                console.log('# "' + rule + '" is now AUTO_INCREMENT.')
                                break;
                            }
                            if (rulevalue != 'ARRAY') {
                                const typeError = 'in rule-file "' + value[rule] + '" is instance of ' + rulevalue
                                throw new Error(typeError)
                            }
                            break;
                        }
                        case "boolean": {
                            if (rulevalue == 'AUTO_INCREMENT' && value[rule] == "AUTO_INCREMENT") {
                                console.log('# "' + rule + '" is now AUTO_INCREMENT.')
                                break;
                            }
                            if (rulevalue != 'BOOLEAN') {
                                const typeError = 'in rule-file "' + value[rule] + '" is instance of ' + rulevalue
                                throw new Error(typeError)
                            }
                            break;
                        }
                    }
                }
            } else {
                const typeError = '"value" must be an OBJECT in strict mode'
                throw new Error(typeError)
            }
        }
        if (data[key] instanceof Object) {
            for (const [subkey, subvalue] of Object.entries(data[key])) {
                if (subvalue == 'AUTO_INCREMENT') {
                    incr = JSON.parse(incr)
                    !incr[tableName]
                        ? incr[tableName] = 1
                        : incr[tableName] = incr[tableName] + 1
                    fs.writeFileSync(
                        __dirname + '/increment.json',
                        JSON.stringify(
                            incr,
                            null,
                            '\t'
                        )
                    )
                    data[key][subkey] = Number(data[key][subkey].replace('AUTO_INCREMENT', incr[tableName]))
                }
            }
        } else {
            if (data[key] == 'AUTO_INCREMENT') {
                incr = JSON.parse(incr)
                !incr[tableName]
                    ? incr[tableName] = 1
                    : incr[tableName] = incr[tableName] + 1
                fs.writeFileSync(
                    __dirname + '/increment.json',
                    JSON.stringify(
                        incr,
                        null,
                        '\t'
                    )
                )
                data[key] = Number(data[key].replace('AUTO_INCREMENT', incr[tableName]))
            }
        }
        fs.writeFileSync(
            this.tablePath + '/' + tableName + '.json',
            JSON.stringify(
                data,
                null,
                '\t'
            )
        );
        if (this.settings && this.settings.usealerts == true) console.log('\nAlert: Added a new line to /' + this.tablePath + '/' + tableName + '.json:\n' + key + ':\t' + JSON.stringify(data[key], null, '\t'))
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
            this.tablePath + '/' + tableName + '.json',
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
            this.tablePath + '/' + tableName + '.json',
            'utf-8'
        );
        if (data && tableName.endsWith('-rules')) {
            const fileError = 'Don\'t edit RULE file: ./' + tableName + '.json'
            throw new Error(fileError)
        }
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
     * @param {Any} value Can work as subkey for subvalue
     * @param {Any} subvalue New value of this subkey.
     */
    edit(tableName, key, value, subvalue) {
        checkDir(this.tablePath)
        checkFile(this.tablePath, tableName)
        let data = fs.readFileSync(
            this.tablePath + '/' + tableName + '.json',
            'utf-8'
        )
        if (data && tableName.endsWith('-rules')) {
            const fileError = 'Don\'t edit RULE file: ./' + tableName + '.json'
            throw new Error(fileError)
        }
        if (
            fs.existsSync(
                this.tablePath + '/' + tableName + '-rules.json',
                'utf-8'
            )
        ) {
            var rules = fs.readFileSync(
                this.tablePath + '/' + tableName + '-rules.json',
                'utf-8'
            );
        }
        data = JSON.parse(data);
        if (!data[key]) {
            const keyError = 'can\'t find "' + key + '" key in database. Unable to change it.'
            throw new Error(keyError)
        }
        if (rules) {
            if (subvalue) {
                rules = JSON.parse(rules);
                for (const [rule, rulevalue] of Object.entries(rules)) {
                    if (rule === value) {
                        console.log(`${rule}: ${rulevalue}   =>   ${(typeof value).toUpperCase()} (${rulevalue === (typeof value).toUpperCase() ? true : false})`)
                        if (subvalue == "AUTO_INCREMENT") {
                            const valueError = 'don\'t use "' + subvalue + '" value in this function. If its already stated as AUTO_INCREMENT, why do you need to change it?'
                            throw new Error(valueError)
                        }
                        switch (typeof subvalue) {
                            case "string": {
                                if (rulevalue != 'STRING') {
                                    const typeError = 'in rule-file "' + value[rule] + '" is instance of ' + rulevalue
                                    throw new Error(typeError)
                                }
                                break;
                            }
                            case "number": {
                                if (rulevalue != 'NUMBER') {
                                    const typeError = 'in rule-file "' + value[rule] + '" is instance of ' + rulevalue
                                    throw new Error(typeError)
                                }
                                break;
                            }
                            case "object": {
                                if (rulevalue != 'OBJECT') {
                                    const typeError = 'in rule-file "' + value[rule] + '" is instance of ' + rulevalue
                                    throw new Error(typeError)
                                }
                                break;
                            }
                            case "array": {
                                if (rulevalue != 'ARRAY') {
                                    const typeError = 'in rule-file "' + value[rule] + '" is instance of ' + rulevalue
                                    throw new Error(typeError)
                                }
                                break;
                            }
                            case "boolean": {
                                if (rulevalue != 'BOOLEAN') {
                                    const typeError = 'in rule-file "' + value[rule] + '" is instance of ' + rulevalue
                                    throw new Error(typeError)
                                }
                                break;
                            }
                        }
                    }
                }
            } else {
                const argsError = 'can\'t edit whole table in strict mode. Use subvalue instead.'
                throw new Error(argsError)
            }
        }
        if (data[key] instanceof Object) {
            if (!String(subvalue)) {
                data[key] = value;
            } else {
                data[key][value] = subvalue;
            }
            fs.writeFileSync(
                this.tablePath + '/' + tableName + '.json',
                JSON.stringify(
                    data,
                    null,
                    '\t'
                )
            );
        } else {
            data[key] = value;
            fs.writeFileSync(
                this.tablePath + '/' + tableName + '.json',
                JSON.stringify(
                    data,
                    null,
                    '\t'
                )
            );
        }
        if (this.settings && this.settings.usealerts == true) console.log('\nAlert: Edited a line in /' + this.tablePath + '/' + tableName + '.json:\n' + key + ':\t' + JSON.stringify(data[key], null, '\t'))
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
            this.tablePath + '/' + tableName + '.json',
            'utf-8'
        );
        if (data && tableName.endsWith('-rules')) {
            const fileError = 'Don\'t edit RULE file: ./' + tableName + '.json'
            throw new Error(fileError)
        }
        if (
            !JSON.parse(data)[key]
        ) {
            const keyError = 'Unable to find key: "' + key + '"'
            throw new Error(keyError)
        }
        data = JSON.parse(data);
        const oldResult = JSON.stringify(data[key], null, '\t')
        data[key] = undefined;
        fs.writeFileSync(
            this.tablePath + '/' + tableName + '.json',
            JSON.stringify(
                data,
                null,
                '\t'
            )
        );
        if (this.settings && this.settings.usealerts == true) console.log('\nAlert: Removed a line from /' + this.tablePath + '/' + tableName + '.json:\n' + key + ':\t' + oldResult + '\nWARNING: THIS IS REMOVED LINE!')
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
        if (!length instanceof Number) {
            const typeError = 'parameter "length" must be a Number.'
            throw new Error(typeError)
        }
        switch (true) {
            case (length < 2): {
                var lengthError = 'parameter "length" must be greater than 1.';
                throw new Error(lengthError)
            }
            case (length > 100): {
                var lengthError = 'parameter "length" must be less than 101.'
                throw new Error(lengthError)
            }
        }
        var result = '';
        var alphabetDefault = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        switch (parameters && parameters != undefined) {
            case undefined: {
                var characters = alphabetDefault;
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
            default: {
                if (parameters.alphabet) {
                    switch (true) {
                        case (parameters.alphabet.length < 2): {
                            var lengthError = '"alphabet"\'s length must be greater than 1 symbol.';
                            throw new Error(lengthError)
                        }
                    }
                    var characters = parameters.alphabet;
                }
                if (parameters.notallowed) {
                    if (!parameters.notallowed instanceof Array) {
                        const typeError = 'parameter "notallowed" must be an Array.'
                        throw new Error(typeError)
                    }
                    var characters = parameters.alphabet ? parameters.alphabet : alphabetDefault;

                    var upperCase = "";
                    var lowerCase = "";
                    var numbers = "";
                    var others = "";
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
                        if (!characters[i].match(/[0-9]/) && !characters[i].match(/[A-Z]/) && !characters[i].match(/[a-z]/) && parameters.alphabet) {
                            others += characters[i];
                        }
                    }

                    if (parameters.notallowed.every(elem => ['lowerCaseString', 'upperCaseString', 'number', parameters.alphabet ? 'other' : null].includes(elem))) {
                        if ((parameters.notallowed).indexOf("lowerCaseString") >= 0) {
                            characters = characters.replace(lowerCase, '');
                        }
                        if ((parameters.notallowed).indexOf("upperCaseString") >= 0) {
                            characters = characters.replace(upperCase, '');
                        }
                        if ((parameters.notallowed).indexOf("number") >= 0) {
                            characters = characters.replace(numbers, '');
                        }
                        if ((parameters.notallowed).indexOf("other") >= 0 && parameters.alphabet) {
                            characters = characters.replace(others, '');
                        }
                    } else {
                        const arrayError = parameters.alphabet
                            ? '"notallowed" can only read these params: ["lowerCaseString", "upperCaseString", "number", "other"]'
                            : '"notallowed" can only read these params: ["lowerCaseString", "upperCaseString", "number"]'
                        throw new Error(arrayError)
                    }
                }
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }
        }
    }
}

module.exports = LissaSqueens;