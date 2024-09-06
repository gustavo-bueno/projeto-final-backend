const getMonthsBetweenDates = (goalDate) => {
  const currentDate = new Date();
  const goalDateObj = new Date(goalDate);

  const yearsDifference = goalDateObj.getFullYear() - currentDate.getFullYear();
  const monthsDifference = goalDateObj.getMonth() - currentDate.getMonth();

  return yearsDifference * 12 + monthsDifference;
}

const formatDate = (date) => {
  const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
  };
  return new Intl.DateTimeFormat('pt-BR', options).format(new Date(date));
}

const formatPrice = (price) => {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
});
return formatter.format(price);
}

module.exports = { getMonthsBetweenDates, formatDate, formatPrice  }