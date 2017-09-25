"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const spreadsheet_1 = require("./spreadsheet");
const creds = require("./SlackBot-6ef626291af0.json");
const googleSpreadsheet = require("google-spreadsheet");
const doc = new googleSpreadsheet("***REMOVED***");
// Check if today's date is the 30th / 31th. then run app.
// const now = moment().format();
// const day = moment().date();
// console.log(now);
// console.log(day);
// const daysInMonth = moment(now).daysInMonth();
// Check date?
// if date is 2:nd. check previous month.
// if month is january, check december and previous year.
// if ( day === 2 ) {
//   console.log( 'its the 2' );
// }
// if (day === daysInMonth) {
doc.useServiceAccountAuth(creds, (err) => {
    doc.getInfo((error, info) => {
        for (const worksheet of info.worksheets) {
            if (worksheet.title !== "TID: Planering och rapportering=>"
                && worksheet.title !== "Modellparametrar"
                && worksheet.title !== "Holidays") {
                const sheet = worksheet;
                const name = worksheet.title;
                const spreadsheet = new spreadsheet_1.default(sheet, name, doc);
                const callFuncs = () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const datesArr = yield spreadsheet.getRowColOfDates();
                        const monthCols = spreadsheet.getThisMonthSpan(datesArr);
                        const datesWithoutWeekend = spreadsheet.getWeekdays(datesArr);
                        // await spreadsheet.checkHolidays(workingDates, mon);
                        const holidaysArr = yield spreadsheet.checkHolidays();
                        const workingDates = spreadsheet.workingDates(datesWithoutWeekend, holidaysArr);
                        const reportedTimeObj = yield spreadsheet.findRowOfReportedTime();
                        const rowNumberOfReportedCells = spreadsheet.getRowNumberOfReportedTime(reportedTimeObj);
                        const hourCells = yield spreadsheet.getTimeReported(rowNumberOfReportedCells, monthCols);
                        spreadsheet.checkTimeFilled(workingDates, hourCells);
                    }
                    catch (err) {
                        console.log(err);
                    }
                });
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
//# sourceMappingURL=index.js.map