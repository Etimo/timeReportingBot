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
const cron_1 = require("cron");
const spreadsheet_1 = require("./spreadsheet");
const creds = require("./creds/SlackBot-0bd3a3481e0e.json");
const googleSpreadsheet = require("google-spreadsheet");
const googleSpreadsheetKey_1 = require("./creds/googleSpreadsheetKey");
const moment = require("moment");
const job = new cron_1.CronJob("0 0 10 * * *", () => {
    const doc = new googleSpreadsheet(googleSpreadsheetKey_1.googleSpreadsheetKey);
    const thisDate = moment().date();
    const lastDayInMonth = moment().daysInMonth();
    if (thisDate === lastDayInMonth || thisDate === 1) {
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
                                let datesWithoutWeekend = [];
                                let workingDates = [];
                                const holidaysArr = yield spreadsheet.checkHolidays();
                                if (thisDate === 1) {
                                    monthColNumbers = spreadsheet.getSpecificMonthSpan(datesArr, true);
                                    datesWithoutWeekend = spreadsheet.getWeekdays(datesArr, true);
                                    workingDates = spreadsheet.workingDates(datesWithoutWeekend, holidaysArr, true);
                                }
                                else {
                                    monthColNumbers = spreadsheet.getSpecificMonthSpan(datesArr, false);
                                    datesWithoutWeekend = spreadsheet.getWeekdays(datesArr, false);
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
    }
});
// function x(err, holidaysArr) {
//   // istället för callback, "wrapper" funktion som använder promise
//   // om success: promise.resolve
//   // om error: promise.reject
//   // för denna wrapper kan man sedan göra await (async/await)
// }
// }
//# sourceMappingURL=index.js.map