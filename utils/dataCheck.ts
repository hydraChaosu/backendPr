import {ValidationError} from "./errors";

export const isNull = (variable: any, name?: string, errorName?: string): void => {
    if (variable === null) {
        throw new ValidationError(errorName ? errorName :`${name ? name : Object.keys({variable})[0]} does not exist`);
    }
}

export const isNotNull = (variable: any, name?: string,errorName?: string): void => {
    if (variable !== null) {
        throw new ValidationError(errorName ? errorName :`${name ? name : Object.keys({variable})[0]} does exist`);
    }
}

export const isBetween = (variable: any, first: number, second: number, name?: string, errorName?: string) : void => {

    let isString = false
    if (typeof(variable) === 'string') {
        isString = true
    }

    if (first > second) {
        if (variable.length > first || variable.length < second) {
            throw new ValidationError(errorName ? errorName : `${name ? name : Object.keys({variable})[0]} should be beetwen ${second} and ${first} ${isString ? 'characters' : 'value'}.`);
        }

    } else {
        if  (variable.length < first || variable.length > second) {
            throw new ValidationError(errorName ? errorName :`${name ? name : Object.keys({variable})[0]} should be beetwen ${first} and ${second} ${isString ? 'characters' : 'value'}.`);
        }
    }
}

export const exists = (variable: any): boolean =>
    variable ? true : false

