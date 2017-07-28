const myForm = document.getElementById("myForm");
const fio = document.getElementById("fio");
const email = document.getElementById("email");
const phone = document.getElementById("phone");

const MyForm = {
  validate: () => {
    let result = {isValid: true, errorFields: []};
    let myFormFields = document.querySelectorAll("#myForm input");
    [...myFormFields].forEach((field) => {
      if (!validateField(field)) {
        field.classList.add("error");
        result.isValid = false;
        result.errorFields.push(field.name);
      }
    });
    console.log(result);
    return result;
  },
  getData: () => {
    return {
      fio: fio.value,
      email: email.value,
      phone: phone.value
    }
  },
  setData: (obj) => {
    // TODO: set inputs values
  },
  submit: () => {
    if (MyForm.validate().isValid) {
      myForm.submit();
    }
  }
};

const validateField = (field) => {
  switch (field.name) {
    case "email":
      return validateEmail(field.value);
      break;
    case "fio":
      return validateFIO(field.value);
      break;
    case "phone":
      return validatePhone(field.value);
      break;
    default:
      console.log('Unknown field: ' + field.name);
  }
};

const validateFIO = (str) => {
  // Three words exactly
  let patt = new RegExp(/^([\S]+)\s([\S]+)\s([\S]+)/g);
  return patt.test(str);
};

const validateEmail = (str) => {
  // ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com
  const domains = ["ya.ru", "yandex.ru", "yandex.ua", "yandex.by", "yandex.kz", "yandex.com"];
  let strParts = str.split("@");
  if (strParts.length > 2) {
    return false;
  }
  if (domains.includes(strParts[1])) {
    return true;
  }
  return false;
};

const sumDigits = (str) => {
  // Helper function to get the sum of all integers in a string
  let result = 0;
  for (let value of str) {
    result += Number.isInteger(parseInt(value)) ? parseInt(value) : 0;
  }
  return result;
};

const validatePhone = (str) => {
  // Start with +7
  // Valid format: +7(999)999-99-99
  let patt = new RegExp(/^\+7\(([0-9]{3})\)([0-9]{3})-([0-9]{2})-([0-9]{2})$/);
  let isValidTel = patt.test(str);
  // Sum of all digits <= 30
  return isValidTel && sumDigits(str) <= 30;
};















// pattern="^([\S]+)\s([\S]+)\s([\S]+)"
// pattern="^[^@\s]+@yahoo.com$"
