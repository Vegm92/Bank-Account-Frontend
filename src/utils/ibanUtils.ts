const generateIBAN = (): string => {
  const countryCode = "ES";
  const bankCode = "1234";
  const accountNumber = Math.floor(Math.random() * 10000000000)
    .toString()
    .padStart(10, "0");
  const iban = `${countryCode}${bankCode}${accountNumber}`;
  return iban;
};

export const getOrCreateIBAN = (): string => {
  let iban = localStorage.getItem("userIBAN");
  if (!iban) {
    iban = generateIBAN();
    localStorage.setItem("userIBAN", iban);
  }
  return iban;
};
