"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendMessage_1 = require("./sendMessage");
const moment = require("moment");
class Spreadsheet {
    constructor(sheet, name, doc) {
        this.sheet = sheet;
        this.name = name;
        this.thisYear = moment().year();
        this.thisMonth = moment().month();
        this.doc = doc;
    }
    // public gettingCells(maxR, minR, maxC, minC) {
    //   return new Promise((resolve, reject) => {
    //     this.sheet.getCells({
    //       "max-col": maxC,
    //       "max-row": maxR, // 5
    //       "min-col": minC, // 6
    //       "min-row": minR, // 5
    //       "return-empty": false,
    //     }, (err, arr) => {
    //       if (err) {
    //         return reject(err);
    //       }
    //       return resolve(arr);
    //     });
    //   });
    // }
    // Getting row 5, col DK and > for all the DATES in the sheet
    getRowColOfDates() {
        return new Promise((resolve, reject) => {
            this.sheet.getCells({
                "max-row": 5,
                "min-col": 6,
                "min-row": 5,
                "return-empty": false,
            }, (err, arr) => {
                if (err) {
                    return reject(err);
                }
                return resolve(arr);
            });
        });
    }
    getWeekdays(arr, second) {
        const monthDatesWithoutWeekend = [];
        for (const item of arr) {
            const dates = item.value;
            const day = moment(dates, "MM-DD-YYYY").day();
            const year = moment(dates, "MM-DD-YYYY").year();
            const month = moment(dates, "MM-DD-YYYY").month();
            // Check for prev months
            if (second) {
                if (this.thisMonth === 0) {
                    if ((this.thisYear - 1) === year
                        && 11 === month
                        && day !== 6 && day !== 0) {
                        monthDatesWithoutWeekend.push(item);
                    }
                }
                else {
                    if (this.thisYear === year
                        && (this.thisMonth - 1) === month
                        && day !== 6 && day !== 0) {
                        monthDatesWithoutWeekend.push(item);
                    }
                }
            }
            else {
                if (this.thisYear === year
                    && (this.thisMonth) === month
                    && day !== 6 && day !== 0) {
                    monthDatesWithoutWeekend.push(item);
                }
            }
        }
        return monthDatesWithoutWeekend;
    }
    getSpecificMonthSpan(arr, second) {
        const monthCols = [];
        // Getting right columns of month and year span
        for (const item of arr) {
            const dates = item.value;
            const year = moment(dates, "MM-DD-YYYY").year();
            const month = moment(dates, "MM-DD-YYYY").month();
            // If it's the 2, check for previous month
            if (second) {
                // If it's January, check for december last year.
                if (this.thisMonth === 0) {
                    if (11 === month && (this.thisYear - 1) === year) {
                        monthCols.push(item.col);
                    }
                }
                else {
                    if ((this.thisMonth - 1) === month && this.thisYear === year) {
                        monthCols.push(item.col);
                    }
                }
            }
            else {
                if ((this.thisMonth) === month && this.thisYear === year) {
                    monthCols.push(item.col);
                }
            }
        }
        return monthCols;
    }
    // Getting holidays from HOLIDAY-sheet
    checkHolidays() {
        return new Promise((resolve, reject) => {
            this.doc.getInfo((error, info) => {
                for (const worksheet of info.worksheets) {
                    if (worksheet.title === "Holidays") {
                        worksheet.getCells({
                            "max-col": 1,
                            "min-col": 1,
                            "return-empty": false,
                        }, (err, arr) => {
                            if (err) {
                                return reject(err);
                            }
                            return resolve(arr);
                        });
                    }
                }
            });
        });
    }
    workingDates(datesWithoutWeekend, holidaysArr, second) {
        const arrDatesOfVacation = [];
        for (const item of holidaysArr) {
            const dates = item.value;
            const months = moment(dates).month();
            const years = moment(dates).year();
            if (second) {
                if (this.thisMonth === 0) {
                    if ((this.thisYear - 1) === years && 11 === months) {
                        arrDatesOfVacation.push(dates);
                    }
                }
                else {
                    if (this.thisYear === years && (this.thisMonth - 1) === months) {
                        arrDatesOfVacation.push(dates);
                    }
                }
            }
            else {
                if (this.thisYear === years && this.thisMonth === months) {
                    arrDatesOfVacation.push(dates);
                }
            }
        }
        for (const item of datesWithoutWeekend) {
            const date = moment(item.value, "MM-DD-YYYY").format("YYYY-MM-DD");
            for (const item2 of arrDatesOfVacation) {
                const vacationDate = item2.toString();
                if (vacationDate === date) {
                    const index = datesWithoutWeekend.indexOf(item);
                    if (index > -1) {
                        datesWithoutWeekend.splice(index, 1);
                    }
                }
            }
        }
        return datesWithoutWeekend;
    }
    // Finding row 20 with reported time by the staff
    findRowOfReportedTime() {
        return new Promise((resolve, reject) => {
            this.sheet.getCells({
                "max-col": 2,
                "min-col": 2,
                "min-row": 20,
                "return-empty": false,
            }, (err, allCells) => {
                if (err) {
                    return reject(err);
                }
                return resolve(allCells);
            });
        });
    }
    getRowNumberOfReportedTime(reportedTimeObj) {
        let rowNumber;
        for (const item of reportedTimeObj) {
            if (item.value === "Total rapporterad tid") {
                rowNumber = item.row;
            }
        }
        return rowNumber;
    }
    getTimeReported(row, monthSpan) {
        // New staff doesnt have the current month.
        if (monthSpan.length !== 0) {
            const maxCol = monthSpan[monthSpan.length - 1];
            return new Promise((resolve, reject) => {
                this.sheet.getCells({
                    "max-col": maxCol,
                    "max-row": row,
                    "min-col": monthSpan[0],
                    "min-row": row,
                    "return-empty": false,
                }, (err, arrHourCells) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(arrHourCells);
                });
            });
        }
        else {
            return ", du behöver inte fylla i tidsrapporten än!";
        }
    }
    checkTimeFilled(workingDates, arrHourCells) {
        if (typeof arrHourCells === "string") {
            const newStaffMessage = new sendMessage_1.default(this.name, arrHourCells);
            newStaffMessage.sendMessage();
        }
        else {
            let isFilled = true;
            const message = ", glöm ej att fylla i tidsrapporten! :scream:";
            const message2 = ", du har fyllt i tidsrapporten! YIHOOO! :sunglasses:";
            for (const item2 of workingDates) {
                for (const item of arrHourCells) {
                    if (item2.col === item.col) {
                        const timeInCol = parseInt(item.value, 0);
                        if (timeInCol === 0) {
                            isFilled = false;
                        }
                    }
                }
            }
            if (!isFilled) {
                const unfilledMessage = new sendMessage_1.default(this.name, message);
                unfilledMessage.sendMessage();
            }
            else {
                const filledMessage = new sendMessage_1.default(this.name, message2);
                filledMessage.sendMessage();
            }
        }
    }
}
exports.default = Spreadsheet;
//# sourceMappingURL=spreadsheet.js.map