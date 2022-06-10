# JSON Database

## Variables
> Main module declaration:
```js
const database = require('ls-jsondb');
// or
import * as database from 'ls-jsondb';
```

> Declare a single database:
```js
const anyVarName = new database('path', {settings})
```

> **settings**: you can leave this empty.
> **parameters**:
```js
{
    usealerts: Boolean
}
```

> ? path is a String option to declare path to a folder with .json files aka tables.<br />you can use multiple amount of databases by creating new **paths**:
```js
// for example:
const first = new database('./first')
const second = new database('./second')
```




## Functions
> tip: there are tooltips for every parameter and argument if you hover on any function or constructor.

### write(tablename, key, value)
> **tablename**(String) is a .json file inside path you declared.<br />**key**(String) is a header of an Object: 
```js
{
    key: value
}
```
> **value**(Any) is a value *<sub>lol</sub>*



### read(tablename, key)
> **tablename**(String) is a .json file inside path you declared.<br />**key**(String) is a header of an Object: 
```js
{
    key: value
}
```



### edit(tablename, key, value, subvalue?)
> **tablename**(String) is a .json file inside path you declared.<br />**key**(String) is a header of an Object: 
```js
{
    key: value
}
```
> **value**(Any) is a value that you are editing inside of an Object.<br />**subvalue**(Any)*(not necessary)* a value of parent value.<br />UPDATED: if subvalue === null or !subvalue it changes whole key.



### remove(tablename, key)
> **tablename**(String) is a .json file inside path you declared.<br />**key**(String) is a header of an Object: 
```js
{
    key: value = undefined
}
```



### generateToken(length, {parameters?})
> **length**(Number) is a length of the token.<br />**parameters**(Object)*(not necessary)*:
```js
{
    alphabet: String,
    notallowed: Array
}
```
> **alphabet** is a String value of all possible characters. If not stated, uses "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" by default.<br />**notallowed** is an Array ['upperCaseString', 'lowerCaseString', 'numbers, 'others?'] of letters, that won't be used by the generator.<br />UPDATED: "others" works only if parameter alphabet stated.