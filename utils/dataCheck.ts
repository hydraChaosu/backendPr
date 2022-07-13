import { ValidationError } from "./errors";

export const isNull = (
  variable: any,
  name?: string,
  errorName?: string
): void => {
  if (variable === null) {
    throw new ValidationError(
      errorName
        ? errorName
        : `${name ? name : Object.keys({ variable })[0]} does not exist`
    );
  }
};

export const isNotNull = (
  variable: any,
  name?: string,
  errorName?: string
): void => {
  if (variable !== null) {
    throw new ValidationError(
      errorName
        ? errorName
        : `${name ? name : Object.keys({ variable })[0]} does exist`
    );
  }
};

export const isSmaller = (
  variable: number,
  than: number,
  name?: string,
  errorName?: string
): void => {
  if (variable > than) {
    throw new ValidationError(
      errorName
        ? errorName
        : `${
            name ? name : Object.keys({ variable })[0]
          } is bigger than ${variable}`
    );
  }
};

export const isBigger = (
  variable: number,
  than: number,
  name?: string,
  errorName?: string
): void => {
  if (variable < than) {
    throw new ValidationError(
      errorName
        ? errorName
        : `${
            name ? name : Object.keys({ variable })[0]
          } is smaller than ${variable}`
    );
  }
};

export const isBetween = (
  variable: any,
  first: number,
  second: number,
  name?: string,
  errorName?: string
): void => {
  let isString = false;
  if (typeof variable === "string") {
    isString = true;
  }

  if (first > second) {
    if (variable > first || variable < second) {
      throw new ValidationError(
        errorName
          ? errorName
          : `${
              name ? name : Object.keys({ variable })[0]
            } should be beetwen ${second} and ${first} ${
              isString ? "characters" : "value"
            }.`
      );
    }
  } else {
    if (variable < first || variable > second) {
      throw new ValidationError(
        errorName
          ? errorName
          : `${
              name ? name : Object.keys({ variable })[0]
            } should be beetwen ${first} and ${second} ${
              isString ? "characters" : "value"
            }.`
      );
    }
  }
};

export const isBetweenEqual = (
  variable: any,
  first: number,
  second: number,
  name?: string,
  errorName?: string
): void => {
  let isString = false;
  if (typeof variable === "string") {
    isString = true;
  }

  if (first > second) {
    if (variable >= first || variable <= second) {
      throw new ValidationError(
        errorName
          ? errorName
          : `${
              name ? name : Object.keys({ variable })[0]
            } should be beetwen or equal ${second} and ${first} ${
              isString ? "characters" : "value"
            }.`
      );
    }
  } else {
    if (variable <= first || variable >= second) {
      throw new ValidationError(
        errorName
          ? errorName
          : `${
              name ? name : Object.keys({ variable })[0]
            } should be beetwen or equal ${first} and ${second} ${
              isString ? "characters" : "value"
            }.`
      );
    }
  }
};

export const exists = (
  variable: any,
  name?: string,
  errorName?: string
): void => {
  if (variable === undefined) {
    throw new ValidationError(
      errorName
        ? errorName
        : `${name ? name : Object.keys({ variable })[0]} does not exist`
    );
  }
};

export const isTypeOf = (
  variable: any,
  desiredType: string,
  name?: string,
  errorName?: string
): void => {
  if (typeof variable !== desiredType) {
    throw new ValidationError(
      errorName
        ? errorName
        : `${
            name ? name : Object.keys({ variable })[0]
          } is not of type ${desiredType}`
    );
  }
};
