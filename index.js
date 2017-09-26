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
const moment = require("moment");
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
//   console.log( "its the 2" );
// }
// if (day === daysInMonth) {
const thisDate = moment().date();
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
                        let monthColNumbers = [];
                        if (thisDate === 2) {
                            monthColNumbers = spreadsheet.getSpecificMonthSpan(datesArr, true);
                        }
                        else {
                            monthColNumbers = spreadsheet.getSpecificMonthSpan(datesArr, false);
                        }
                        let datesWithoutWeekend = [];
                        if (thisDate === 2) {
                            datesWithoutWeekend = spreadsheet.getWeekdays(datesArr, true);
                        }
                        else {
                            datesWithoutWeekend = spreadsheet.getWeekdays(datesArr, false);
                        }
                        const holidaysArr = yield spreadsheet.checkHolidays();
                        let workingDates = [];
                        if (thisDate === 2) {
                            workingDates = spreadsheet.workingDates(datesWithoutWeekend, holidaysArr, true);
                        }
                        else {
                            workingDates = spreadsheet.workingDates(datesWithoutWeekend, holidaysArr, false);
                        }
                        const reportedTimeObj = yield spreadsheet.findRowOfReportedTime();
                        const rowNumberOfReportedCells = spreadsheet.getRowNumberOfReportedTime(reportedTimeObj);
                        const hourCells = yield spreadsheet.getTimeReported(rowNumberOfReportedCells, monthColNumbers);
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