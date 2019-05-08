
class RandomDatesGenerator {
  constructor(_startYear, _endYear) {
    this.startYear = _startYear;
    this.endYear = _endYear;
  
    
  }  
  addDays = (date, days)=> {
  let result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

  subDays = (date, days)=> {
    let result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  };


  datesGenerator = () =>{
  let randomYear = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  let randomMonth = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  let randomDay = (month, year) => {
    let daysInMonth = new Date(year, month, 0).getDate();
    return Math.floor(Math.random() * daysInMonth + 1);
  };
  let startYear = randomYear(this.startYear, this.endYear);
  let startMonth = randomMonth(1, 12);
  let startDay = randomDay(startMonth, startYear);
  let startYearS = startYear.toString();
  let startMonthS = startMonth.toString();
  let startDayS = startDay.toString();
  let startDateS = startYearS + "-" + startMonthS + "-" + startDayS;
  let startDate = new Date(startDateS);
  let endDate = this.addDays(startDate, 14);
  let endDateS = endDate.toISOString().substring(0, 10);
  return { startS: startDateS, endS: endDateS };
};
  randomDates = () => {
  let gen = this.datesGenerator();
  let todayDate = new Date();
  let endDate = new Date(gen.endS);
  let startDate = new Date(gen.startS);

  if (endDate > todayDate) this.randomDates();
  else
    return {
      //startDate:startDate.toISOString().substring(0, 10), 
      //endDate:endDate.toISOString().substring(0, 10)

      startDate:startDate, 
      endDate:endDate,
    }    
};

  rangeDates = (items) =>{
    let allDates = [];  
    for(let cn = 0; cn < items; cn++)
    { 
      let tmp = this.randomDates();
      if (typeof tmp !== 'undefined')
      allDates.push(tmp); else cn -=1;    
    }
    return allDates; 
  };}  
  

export {RandomDatesGenerator};


