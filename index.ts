import Spreadsheet from "./spreadsheet";

import * as creds from "./SlackBot-6ef626291af0.json";

import * as googleSpreadsheet from "google-spreadsheet";
import * as moment from "moment";

const doc: any = new googleSpreadsheet("***REMOVED***");

// Check if today's date is the 30th / 31th. then run app.
// const now = moment().format();
const day = moment().date();
// console.log(now);
// console.log(day);
// const daysInMonth = moment(now).daysInMonth();

// Check date?
// if date is 2:nd. check previous month.
// if month is january, check december and previous year.


// if (day === daysInMonth) {

doc.useServiceAccountAuth(creds, (err) => {

  doc.getInfo((error, info) => {
    for (const worksheet of info.worksheets) {

      if (worksheet.title !== "TID: Planering och rapportering=>"
      && worksheet.title !== "Modellparametrar"
      && worksheet.title !== "Holidays") {
        const sheet: any = worksheet;
        const name = worksheet.title;
        const spreadsheet = new Spreadsheet(sheet, name, doc);

        const callFuncs = async () => {

          try {
            const datesArr: any = await spreadsheet.getRowColOfDates();
            const monthCols: number[] = spreadsheet.getThisMonthSpan(datesArr);
            const datesWithoutWeekend: any[] = spreadsheet.getWeekdays(datesArr);
            // await spreadsheet.checkHolidays(workingDates, mon);
            const holidaysArr: any = await spreadsheet.checkHolidays();
            const workingDates: number[] = spreadsheet.workingDates(datesWithoutWeekend, holidaysArr);
            const reportedTimeObj: any = await spreadsheet.findRowOfReportedTime();
            const rowNumberOfReportedCells: number = spreadsheet.getRowNumberOfReportedTime(reportedTimeObj);
            const hourCells: any = await spreadsheet.getTimeReported(rowNumberOfReportedCells, monthCols);
            spreadsheet.checkTimeFilled(workingDates, hourCells);
          }catch (err) {
            console.log(err);
        }
      };

        callFuncs();
      }
    }

  });
});

// function x(err, holidaysArr) {
//   // istället för callback, "wrapper" funktion som använder promise
//   // om success: promise.resolve
//   // om error: promise.reject
//   // för denna wrapper kan man sedan göra await (async/await)
// }
// }
