export const fetchCountries = async () => fetch('https://restcountries.com/v3.1/region/ame').then(res => res.json());
