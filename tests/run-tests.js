#!/usr/bin/env node

/**
 * סקריפט להרצת בדיקות ויצירת דוח תוצאות
 * 
 * סקריפט זה מריץ את כל הבדיקות במערכת ומייצר דוח תוצאות מפורט
 * הדוח כולל מידע על בדיקות שעברו, נכשלו או עברו חלקית
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// צבעים לפלט
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
};

// פונקציה להדפסת כותרת
function printHeader(text) {
  console.log('\n' + colors.bright + colors.cyan + '='.repeat(80) + colors.reset);
  console.log(colors.bright + colors.cyan + ' ' + text + colors.reset);
  console.log(colors.bright + colors.cyan + '='.repeat(80) + colors.reset + '\n');
}

// פונקציה להדפסת תת-כותרת
function printSubHeader(text) {
  console.log('\n' + colors.bright + colors.yellow + '-'.repeat(60) + colors.reset);
  console.log(colors.bright + colors.yellow + ' ' + text + colors.reset);
  console.log(colors.bright + colors.yellow + '-'.repeat(60) + colors.reset + '\n');
}

// פונקציה להדפסת הודעת הצלחה
function printSuccess(text) {
  console.log(colors.green + '✓ ' + text + colors.reset);
}

// פונקציה להדפסת הודעת כישלון
function printFailure(text) {
  console.log(colors.red + '✗ ' + text + colors.reset);
}

// פונקציה להדפסת הודעת אזהרה
function printWarning(text) {
  console.log(colors.yellow + '⚠ ' + text + colors.reset);
}

// פונקציה להדפסת מידע
function printInfo(text) {
  console.log(colors.blue + 'ℹ ' + text + colors.reset);
}

// יצירת תיקיית דוחות אם לא קיימת
const reportsDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir);
}

// שם קובץ הדוח
const reportFileName = `test-report-${new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '')}.txt`;
const reportFilePath = path.join(reportsDir, reportFileName);

// פתיחת קובץ הדוח לכתיבה
const reportStream = fs.createWriteStream(reportFilePath);

// פונקציה לכתיבה לקובץ הדוח
function writeToReport(text) {
  reportStream.write(text + '\n');
}

// הדפסת כותרת ראשית
printHeader('הרצת בדיקות למערכת ניהול ומעקב לתרומות דם');
writeToReport('דוח בדיקות למערכת ניהול ומעקב לתרומות דם');
writeToReport('='.repeat(50));
writeToReport(`תאריך: ${new Date().toLocaleString('he-IL')}`);
writeToReport('='.repeat(50) + '\n');

// רשימת קבצי הבדיקות
const testFiles = [
  'compatibility.test.js',
  'goals.test.js',
  'notifications.test.js'
];

// סיכום תוצאות
const summary = {
  total: testFiles.length,
  passed: 0,
  failed: 0,
  partial: 0
};

// הרצת כל קבצי הבדיקות
testFiles.forEach((testFile, index) => {
  printSubHeader(`הרצת בדיקות: ${testFile} (${index + 1}/${testFiles.length})`);
  writeToReport(`\nבדיקה: ${testFile}`);
  writeToReport('-'.repeat(30));
  
  try {
    // הרצת הבדיקה
    const output = execSync(`npx jest ${testFile} --json`, { encoding: 'utf8' });
    const result = JSON.parse(output);
    
    // חישוב סטטיסטיקות
    const totalTests = result.numTotalTests;
    const passedTests = result.numPassedTests;
    const failedTests = result.numFailedTests;
    const pendingTests = result.numPendingTests;
    
    // הדפסת תוצאות
    if (failedTests === 0) {
      printSuccess(`כל הבדיקות עברו בהצלחה (${passedTests}/${totalTests})`);
      writeToReport(`סטטוס: עבר בהצלחה`);
      writeToReport(`בדיקות שעברו: ${passedTests}/${totalTests}`);
      summary.passed++;
    } else if (passedTests === 0) {
      printFailure(`כל הבדיקות נכשלו (${failedTests}/${totalTests})`);
      writeToReport(`סטטוס: נכשל`);
      writeToReport(`בדיקות שנכשלו: ${failedTests}/${totalTests}`);
      summary.failed++;
    } else {
      printWarning(`חלק מהבדיקות נכשלו (עברו: ${passedTests}, נכשלו: ${failedTests}, סה"כ: ${totalTests})`);
      writeToReport(`סטטוס: עבר חלקית`);
      writeToReport(`בדיקות שעברו: ${passedTests}/${totalTests}`);
      writeToReport(`בדיקות שנכשלו: ${failedTests}/${totalTests}`);
      summary.partial++;
    }
    
    // הדפסת פרטי שגיאות אם יש
    if (failedTests > 0 && result.testResults[0].assertionResults) {
      const failedTestDetails = result.testResults[0].assertionResults
        .filter(test => test.status === 'failed')
        .map(test => ({
          name: test.title,
          message: test.failureMessages.join('\n')
        }));
      
      printInfo(`פירוט שגיאות:`);
      writeToReport(`\nפירוט שגיאות:`);
      
      failedTestDetails.forEach(test => {
        console.log(colors.red + `  - ${test.name}` + colors.reset);
        writeToReport(`  - ${test.name}`);
      });
    }
    
  } catch (error) {
    printFailure(`שגיאה בהרצת הבדיקות: ${error.message}`);
    writeToReport(`סטטוס: שגיאה`);
    writeToReport(`פירוט השגיאה: ${error.message}`);
    summary.failed++;
  }
});

// הדפסת סיכום
printHeader('סיכום תוצאות הבדיקות');
writeToReport('\nסיכום תוצאות הבדיקות');
writeToReport('='.repeat(30));

printSuccess(`בדיקות שעברו בהצלחה: ${summary.passed}/${summary.total}`);
printFailure(`בדיקות שנכשלו: ${summary.failed}/${summary.total}`);
printWarning(`בדיקות שעברו חלקית: ${summary.partial}/${summary.total}`);

writeToReport(`בדיקות שעברו בהצלחה: ${summary.passed}/${summary.total}`);
writeToReport(`בדיקות שנכשלו: ${summary.failed}/${summary.total}`);
writeToReport(`בדיקות שעברו חלקית: ${summary.partial}/${summary.total}`);

// סגירת קובץ הדוח
reportStream.end();

printInfo(`\nדוח הבדיקות נשמר בקובץ: ${reportFilePath}`);

// קביעת קוד היציאה בהתאם לתוצאות
process.exit(summary.failed > 0 ? 1 : 0); 