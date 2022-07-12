# JSON Database

## Contact with me

> You can add me in Discord: **Squeens#6280**<br />Or join my test Discord server: **https://discord.gg/mKYuStucmp**

## Variables

Main module declaration:

```js
const database = require("ls-jsondb");
```

Declare a single database:

```js
const anyVarName = new database("path", { settings });
```

**settings**: you can leave this empty.<br /> **parameters**:

```js
{
  usealerts: Boolean;
}
```

**path** is a String option to declare path to a folder with .json files aka tables.<br />you can use multiple amount of databases by creating new **paths**:

```js
// for example:
const first = new database("./first");
const second = new database("./second");
```

## Functions

> tip: there are tooltips for every parameter and argument if you hover on any function or constructor.

### createTable(tablename)

**tablename**(String) is a .json file inside path you declared.

### removeTable(tablename)

**tablename**(String) is a .json file inside path you declared.

### write(tablename, key, value)

**tablename**(String) is a .json file inside path you declared.<br />**key**(String) is a header of an Object.<br />**value**(Any) is a value _<sub>lol</sub>_

```js
{
  key: value;
}
```

### read(tablename, key)

**tablename**(String) is a .json file inside path you declared.<br />**key**(String) is a header of an Object.<br /><br />Returns **Any**

```js
{
  key: value;
}
```

### edit(tablename, key, value, subvalue?)

**tablename**(String) is a .json file inside path you declared.<br />**key**(String) is a header of an Object.<br />**value**(Any) is a value that you are editing inside of an Object.<br />**subvalue**(Any)_(not necessary)_ a value of parent value.<br />UPDATED: if subvalue === null or !subvalue it changes whole key.

```js
{
  key: value;
}
```

### remove(tablename, key)

**tablename**(String) is a .json file inside path you declared.<br />**key**(String) is a header of an Object.

```js
{
  key: value = undefined;
}
```

### check(tablename, key)

**tablename**(String) is a .json file inside path you declared.<br />**key**(String) is a header of an Object.<br /><br />Returns **Boolean**

```js
{
  key: value;
}
```

### readIncrement()

returns stringified Object of all increment values in console.

### editIncrement(tableName, value)

**tableName**(String) is a .json file inside path you declared (and also stored as a key for increment).<br />**value**(Number) is a numberic value-ofset of increment.

### generateToken(length, {parameters?})

**length**(Number) is a length of the token.<br />**parameters**(Object)_(not necessary)_.<br />**alphabet** is a String value of all possible characters. If not stanted, uses "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" by default.<br />**notallowed** is an Array ['upperCaseString', 'lowerCaseString', 'numbers, 'others?'] of letters, that won't be used by the generator.<br />UPDATED: "others" works only if parameter alphabet stated.<br /><br />Returns **String**

```js
{
  alphabet: String,
  notallowed: Array
}
```

## other parameters

### "AUTO_INCREMENT"

Put this inside **value** parameter or inside mother {Object}<br />
For example:

```js
database.write("test", "USER", { id: "AUTO_INCREMENT" });
```

and it will write it like that:

```json
{
  "USER": {
    "id": 1
  }
}
```

increment value is written inside **./increment.json** and writes like that:

```js
{
  TABLENAME: VALUE; // Number
}
```

> WARNING: can be used only once per table!<br />
> WARNING: do not use AUTO_INCREMENT value in edit() function.<br />
> WARNING: write() function creates a new version of the key so it always reroll AUTO_INCREMENT value.<br />

### STRICT MODE

This is a very complicated thing. Let's talk about it a little bit more.<br />
When using **createTable()** function, you can add {parameters} after tableName property.<br />
It automaticaly makes this table in strict mode: creates **tableName-rules.json** file.<br />
Example of usage:

```js
db.createTable("example", { id: "AUTO_INCREMENT", roles: "ARRAY" });
```

It creates empty file **example.json** and **example-rules.json** with:

```json
{
  "id": "AUTO_INCREMENT",
  "roles": "ARRAY"
}
```

When you write or edit something in this table, it uses strict parameters:

```js
db.write("example", "user", {
  id: "AUTO_INCREMENT",
  roles: ["ADMIN", "MODER"],
});
```

If, for example, you make "roles" as a STRING, it will throw an error:

```js
db.write("example", "user", {
  id: "AUTO_INCREMENT",
  roles: "ADMIN",
  //     ^^^^^^^ typeof ≠ array.
});
```

console:

```
Error: in rule-file "roles" is instance of ARRAY
```

that's it.

## Examples

### write()

Default mode:

```js
db.write("users", db.generateToken(12), {
  id: "AUTO_INCREMENT",
  username: "user",
});
```

Strict mode:

```js
// rules:
{
  id: "AUTO_INCREMENT",
  username: "STRING",
}

db.write("users", db.generateToken(12), {
  id: "AUTO_INCREMENT", // rule => returned true
  username: "user" // rule => returned true
});
```

### edit()

Default mode:

```js
db.edit("users", db.generateToken(12), {
  // do not edit AUTO_INCREMENT
  username: "lissa",
});

// if you need to add a new line, just paste it:
db.edit("users", db.generateToken(12), {
  description: "example description.",
});
```

Strict mode:

```js
// rules:
{
  id: "AUTO_INCREMENT",
  username: "STRING",
}

db.edit("users", db.generateToken(12), {
  // do not edit AUTO_INCREMENT
  username: "lissa" // rule => returned true
});

// you can't add new lines in strict mode.
```

### remove()

```js
db.remove("users", "F3W9hk4klaHl");
```

### check()

```js
if (db.check("users", "F3W9hk4klaHl") == true) doSomething();
```

### read()

```js
const user = db.read("users", "F3W9hk4klaHl");

// for example returns:
F3W9hk4klaHl: {
  "id": 1,
  "username": "Lissa",
  "description": "Example description."
}

console.log(user.id) // returns 1
console.log(user.username) // returns "Lissa"
console.log(user.description) // returns "Example description."
```

### generateToken()

```js
const token = db.generateToken(12, {
  alphabet: "abcdefABCDEF123456.",
  notallowed: ["upperCaseString"],
});
// generates token using "abcdefABCDEF123456." characters but without "ABCDEF".
```

### createTable()

Default mode:

```js
db.createTable("example");
```

Strict mode:

```js
db.createTable("example", {
  id: "AUTO_INCREMENT",
  username: "STRING",
});
```

### removeTable()

```js
db.removeTable("example");
```

### editIncrement()

```js
db.editIncrement("example", 1);
```

### readIncrement()

```js
db.readIncrement();
```
