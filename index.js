const fio = document.getElementById("fio");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const submitButton = document.getElementById("submitButton");
const resultContainer = document.getElementById("resultContainer");
const loader = document.getElementById("loader");
const myFormFields = document.querySelectorAll("#myForm input");

const domains = ["ya.ru", "yandex.ru", "yandex.ua", "yandex.by", "yandex.kz", "yandex.com"];
const settableFields = ["phone", "fio", "email"];
const maxPhoneSum = 30;

const MyForm = {
  validate: () => {
    let result = {isValid: true, errorFields: []};
    [...myFormFields].forEach((field) => {
      if (!validateField(field)) {
        field.classList.add("error");
        result.isValid = false;
        result.errorFields.push(field.name);
      } else {
        field.classList.remove("error");
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
    for (let key of Object.keys(obj)) {
      if (settableFields.includes(key)) {
        document.getElementById(key).value = obj[key];
      }
    }
  },
  submit: () => {
    if (MyForm.validate().isValid) {
      submitButton.disabled = true;
      loader.classList.remove("hidden");
      return new Promise((resolve, reject) => {
        // It is not possible to send XMLHttpRequests to local file,
        // so for testing we randomly retrieve sample data
        setTimeout(() => {
          const statuses = [successData, errorData, progressData];
          let randomStatus = statuses[Math.floor(Math.random()*statuses.length)];
          let response = JSON.parse(randomStatus);
          resolve(response[0]);
        }, 1000);
      }).then((result) => {
        resultContainer.className = "result-container";
        submitButton.disabled = false;
        loader.classList.add("hidden");
        handleResults(result, resultContainer);
      });
    }
  }
};

const handleResults = (result, container) => {
  container.classList.add(result.status);
  if (result.status === "success") {
    container.textContent = "Success";
  } else if (result.status === "error") {
    container.textContent = result.reason;
  } else {
    container.textContent = "Посылаю повторный запрос...";
    setTimeout(() => {
      MyForm.submit();
    }, result.timeout);
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
  return isValidTel && sumDigits(str) <= maxPhoneSum;
};
