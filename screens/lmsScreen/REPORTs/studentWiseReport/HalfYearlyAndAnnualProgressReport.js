import { Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useState } from 'react'
import { GlobleData } from '../../../../Store'
import { SWATheam } from '../../../../constant/ConstentValue'
import { ScrollView } from 'react-native-gesture-handler'
import Loader from '../../../common/Loader'
import RNPrint from 'react-native-print'

const getGrade = (marks) => {
  if (marks === "" || marks === null || marks === undefined || isNaN(marks)) return "";
  const m = Number(marks);
  if (m <= 100 && m >= 91) return 'A1';
  if (m <= 90 && m >= 81) return 'A2';
  if (m <= 80 && m >= 71) return 'B1';
  if (m <= 70 && m >= 61) return 'B2';
  if (m <= 60 && m >= 51) return 'C1';
  if (m <= 50 && m >= 41) return 'C2';
  if (m <= 40 && m >= 33) return 'D';
  if (m <= 32 && m > 0) return 'E';
  if (m === 0) return 'E';
  return '';
};

const formatDateOfBirth = (dob) => {
  if (!dob || dob === '-' || dob === 'null' || dob === 'undefined') return '-';
  const str = String(dob).trim();
  if (!str) return '-';

  // Case 1: Already DD-MM-YYYY (e.g. 26-10-2026)
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
    return str;
  }

  // Case 2: DD/MM/YYYY -> DD-MM-YYYY (e.g. 26/10/2026 -> 26-10-2026)
  if (/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(str)) {
    const parts = str.split('/');
    const d = parts[0].padStart(2, '0');
    const m = parts[1].padStart(2, '0');
    const y = parts[2];
    return `${d}-${m}-${y}`;
  }

  // Case 3: YYYY-MM-DD or YYYY/MM/DD (e.g. 2026-10-26 or 2026/10/26 -> 26-10-2026)
  const ymdMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const y = ymdMatch[1];
    const m = ymdMatch[2].padStart(2, '0');
    const d = ymdMatch[3].padStart(2, '0');
    return `${d}-${m}-${y}`;
  }

  // Case 4: DD-MM-YY or DD/MM/YY (2-digit year)
  const dmyShortMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2})$/);
  if (dmyShortMatch) {
    const d = dmyShortMatch[1].padStart(2, '0');
    const m = dmyShortMatch[2].padStart(2, '0');
    const yy = dmyShortMatch[3];
    const fullYear = Number(yy) > 30 ? `19${yy}` : `20${yy}`;
    return `${d}-${m}-${fullYear}`;
  }

  // Case 5: Parse with Date object (handles ISO strings like "2026-10-26T00:00:00.000Z")
  const parsedDate = new Date(str);
  if (!isNaN(parsedDate.getTime())) {
    const d = String(parsedDate.getDate()).padStart(2, '0');
    const m = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const y = parsedDate.getFullYear();
    return `${d}-${m}-${y}`;
  }

  return str;
};

const HalfYearlyAndAnnualProgressReport = ({ reportData, reportSubIconID, testType, userType, selectedIcon }) => {

  const { userData } = useContext(GlobleData)
  const [photoError, setPhotoError] = useState(false)

  const indicatorsList = []
  const disciplineIndicatorList = []
  let subjectMarksList = [];
  let anualReportData = []

  const isAnnual = (reportSubIconID == 63 && testType == 5) || (userType == 5 && selectedIcon == 106);

  if (isAnnual) {
    const halfYearAssigned = reportData?.data?.halfYearData?.data?.assignedSubjects || [];
    const halfYearReport = reportData?.data?.halfYearData?.data?.reportData || [];
    halfYearAssigned.forEach((item) => {
      let index2 = halfYearReport.findIndex((res) => res.subjectID == item.subjectID);
      if (index2 == -1) {
        subjectMarksList.push(item)
      } else {
        subjectMarksList.push(halfYearReport[index2])
      }
    })

    const annualAssigned = reportData?.data?.assignedSubjects || [];
    const annualReport = reportData?.data?.reportData || [];
    annualAssigned.forEach((item) => {
      let index2 = annualReport.findIndex((res) => res.subjectID == item.subjectID);
      if (index2 == -1) {
        anualReportData.push(item)
      } else {
        anualReportData.push(annualReport[index2])
      }
    })
  } else {
    const assigned = reportData?.data?.assignedSubjects || [];
    const rep = reportData?.data?.reportData || [];
    assigned.forEach((item) => {
      let index2 = rep.findIndex((res) => res.subjectID == item.subjectID);
      if (index2 == -1) {
        subjectMarksList.push(item)
      } else {
        subjectMarksList.push(rep[index2])
      }
    })
  }

  // Calculate totals and overall marks
  let totalObtainMarks = 0;
  let grandsTotalMarks = 0;
  let hasAnyMarks = false;

  if (isAnnual) {
    subjectMarksList.forEach((item, index) => {
      const pt1 = item?.subjectMarks?.periodicTest?.obtainedMarks;
      const nb1 = item?.subjectMarks?.noteBookMarks;
      const sea1 = item?.subjectMarks?.seaMarks;
      const hy1 = item?.subjectMarks?.halfYearlyMarks?.obtainedMarks;

      const annualItem = anualReportData[index];
      const pt2 = annualItem?.subjectMarks?.periodicTest?.obtainedMarks;
      const nb2 = annualItem?.subjectMarks?.noteBookMarks;
      const sea2 = annualItem?.subjectMarks?.seaMarks;
      const t2m = annualItem?.subjectMarks?.term2YearlyMarks?.obtainedMarks;

      if (pt1 != null || nb1 != null || sea1 != null || hy1 != null ||
        pt2 != null || nb2 != null || sea2 != null || t2m != null) {
        hasAnyMarks = true;
      }

      const t1 = (Number(pt1) || 0) + (Number(nb1) || 0) + (Number(sea1) || 0) + (Number(hy1) || 0);
      const t2 = (Number(pt2) || 0) + (Number(nb2) || 0) + (Number(sea2) || 0) + (Number(t2m) || 0);

      const gTotal = Math.round((t1 + t2) / 2);
      grandsTotalMarks += gTotal;
      totalObtainMarks += t1;
    });
  } else {
    subjectMarksList.forEach((item) => {
      const pt = item?.subjectMarks?.periodicTest?.obtainedMarks;
      const nb = item?.subjectMarks?.noteBookMarks;
      const sea = item?.subjectMarks?.seaMarks;
      const hy = item?.subjectMarks?.halfYearlyMarks?.obtainedMarks;

      if (pt != null || nb != null || sea != null || hy != null) {
        hasAnyMarks = true;
      }

      const t = (Number(pt) || 0) + (Number(nb) || 0) + (Number(sea) || 0) + (Number(hy) || 0);
      totalObtainMarks += t;
    });
  }

  const subjectsCount = reportData?.data?.reportData?.length > 0
    ? reportData.data.reportData.length
    : (subjectMarksList.length || reportData?.data?.assignedSubjects?.length || 0);

  const totalMarks = subjectsCount * 100;
  const finalObtainedMarks = isAnnual ? grandsTotalMarks : totalObtainMarks;
  const percentage = totalMarks > 0 ? Math.round((finalObtainedMarks * 100) / totalMarks) : 0;
  const GlobleGrade = totalMarks > 0 ? getGrade(percentage) : "-";

  const displayOverall = hasAnyMarks && totalMarks > 0 ? `${finalObtainedMarks}/${totalMarks}` : "-";
  const displayPercentage = hasAnyMarks && totalMarks > 0 ? `${percentage}%` : "-";
  const displayGrade = hasAnyMarks && totalMarks > 0 ? GlobleGrade : "-";

  const studentData = reportData?.data?.studentData || {};
  const studentPhoto = userData?.data?.profilePath ||
    studentData?.profileImage ||
    studentData?.studentPhoto ||
    studentData?.photo ||
    studentData?.profilePic ||
    studentData?.image ||
    null;


  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrintAndShare = async () => {
    try {
      setIsPrinting(true);
      const mainTheme = userData?.data?.colors?.mainTheme || '#0d7377';
      const liteTheme = userData?.data?.colors?.liteTheme || '#e8f4f4';

      const schoolName = reportData?.data?.schoolData?.schoolName || '';
      const affiliatedBy = reportData?.data?.schoolData?.affiliatedBy || '';
      const diceCode = reportData?.data?.schoolData?.diceCode || '';
      const schoolAddress = [
        reportData?.data?.schoolData?.city,
        reportData?.data?.schoolData?.state,
        reportData?.data?.schoolData?.country,
      ].filter(Boolean).join(', ') + (reportData?.data?.schoolData?.pinCode ? ` - ${reportData.data.schoolData.pinCode}` : '');
      const schoolID = reportData?.data?.schoolData?.schoolID || '';
      const admissionNo = studentData?.admissionNo || '';
      const fullName = [studentData?.firstName, studentData?.middleName, studentData?.lastName].filter(Boolean).join(' ') || '-';
      const motherName = studentData?.motherName || '-';
      const fatherName = studentData?.fatherName || '-';
      const dob = formatDateOfBirth(studentData?.dateOfBirth || studentData?.dob);
      const stuAddress = studentData?.address || '-';
      const session = reportData?.data?.session || '';
      const className = (studentData?.class ? studentData.class : '') + (studentData?.section ? `-${studentData.section}` : '');

      const reportTitle = isAnnual ? 'ANNUAL PROGRESS REPORT' : 'HALF YEARLY PROGRESS REPORT';

      let scholasticRowsHTML = '';
      if (isAnnual) {
        scholasticRowsHTML = subjectMarksList.map((item, index) => {
          const pt1 = item?.subjectMarks?.periodicTest?.obtainedMarks ?? '';
          const nb1 = item?.subjectMarks?.noteBookMarks ?? '';
          const sea1 = item?.subjectMarks?.seaMarks ?? '';
          const hy1 = item?.subjectMarks?.halfYearlyMarks?.obtainedMarks ?? '';
          const hasT1 = pt1 !== '' || nb1 !== '' || sea1 !== '' || hy1 !== '';
          const t1Total = hasT1 ? (Number(pt1) || 0) + (Number(nb1) || 0) + (Number(sea1) || 0) + (Number(hy1) || 0) : '';

          const annualItem = anualReportData[index];
          const pt2 = annualItem?.subjectMarks?.periodicTest?.obtainedMarks ?? '';
          const nb2 = annualItem?.subjectMarks?.noteBookMarks ?? '';
          const sea2 = annualItem?.subjectMarks?.seaMarks ?? '';
          const t2m = annualItem?.subjectMarks?.term2YearlyMarks?.obtainedMarks ?? '';
          const hasT2 = pt2 !== '' || nb2 !== '' || sea2 !== '' || t2m !== '';
          const t2Total = hasT2 ? (Number(pt2) || 0) + (Number(nb2) || 0) + (Number(sea2) || 0) + (Number(t2m) || 0) : '';

          let gTotal = '';
          let grade = '';
          if (hasT1 || hasT2) {
            gTotal = Math.round(((Number(t1Total) || 0) + (Number(t2Total) || 0)) / 2);
            grade = getGrade(gTotal);
          }

          return `
            <tr>
              <td style="text-align: left; font-weight: 500;">${item.subjectName || ''}</td>
              <td>${pt1}</td>
              <td>${nb1}</td>
              <td>${sea1}</td>
              <td>${hy1}</td>
              <td style="font-weight: 600;">${t1Total}</td>
              <td>${pt2}</td>
              <td>${nb2}</td>
              <td>${sea2}</td>
              <td>${t2m}</td>
              <td style="font-weight: 600;">${t2Total}</td>
              <td style="font-weight: 700;">${gTotal}</td>
              <td style="font-weight: 700;">${grade}</td>
            </tr>
          `;
        }).join('');
      } else {
        scholasticRowsHTML = subjectMarksList.map((item) => {
          const pt = item?.subjectMarks?.periodicTest?.obtainedMarks ?? '';
          const nb = item?.subjectMarks?.noteBookMarks ?? '';
          const sea = item?.subjectMarks?.seaMarks ?? '';
          const hy = item?.subjectMarks?.halfYearlyMarks?.obtainedMarks ?? '';
          const hasMarks = pt !== '' || nb !== '' || sea !== '' || hy !== '';
          const tTotal = hasMarks ? (Number(pt) || 0) + (Number(nb) || 0) + (Number(sea) || 0) + (Number(hy) || 0) : '';
          const grade = hasMarks ? getGrade(tTotal) : '';

          return `
            <tr>
              <td style="text-align: left; font-weight: 500;">${item.subjectName || ''}</td>
              <td>${pt}</td>
              <td>${nb}</td>
              <td>${sea}</td>
              <td>${hy}</td>
              <td style="font-weight: 700;">${tTotal}</td>
              <td style="font-weight: 700;">${grade}</td>
            </tr>
          `;
        }).join('');
      }

      let coScholasticHTML = '';
      if (indicatorsList && indicatorsList.length > 0) {
        const rows = indicatorsList.map((val) => {
          let subList = [];
          if (val?.subIndicators) {
            Object.keys(val.subIndicators).forEach(k => subList.push(val.subIndicators[k]));
          }
          const subNames = subList.length > 0 ? subList.map(s => s.subIndicatorName).join('<br/>') : '-';
          const subMarks = subList.length > 0 ? subList.map(s => s.subIndicatorMarks).join('<br/>') : (val.mainIndicatorMarks || '-');

          return `
            <tr>
              <td style="text-align: left; font-weight: 500;">${val.mainIndicatorName || ''}</td>
              <td style="text-align: left;">${subNames}</td>
              <td>${subMarks}</td>
            </tr>
          `;
        }).join('');

        coScholasticHTML = `
          <div style="margin-top: 15px;">
            <div style="background-color: ${mainTheme}; color: #fff; padding: 6px 10px; font-weight: bold; text-align: center; text-transform: uppercase;">
              CO-SCHOLASTIC AREA
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%;">Indicator</th>
                  <th style="width: 45%;">Sub-Indicator</th>
                  <th style="width: 25%;">Marks / Grade</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `;
      }

      let disciplineHTML = '';
      if (disciplineIndicatorList && disciplineIndicatorList.length > 0) {
        const rows = disciplineIndicatorList.map((val) => {
          let subList = [];
          if (val?.subIndicators) {
            Object.keys(val.subIndicators).forEach(k => subList.push(val.subIndicators[k]));
          }
          const subNames = subList.length > 0 ? subList.map(s => s.subIndicatorName).join('<br/>') : '-';
          const subMarks = subList.length > 0 ? subList.map(s => s.subIndicatorMarks).join('<br/>') : (val.mainIndicatorMarks || '-');

          return `
            <tr>
              <td style="text-align: left; font-weight: 500;">${val.mainIndicatorName || ''}</td>
              <td style="text-align: left;">${subNames}</td>
              <td>${subMarks}</td>
            </tr>
          `;
        }).join('');

        disciplineHTML = `
          <div style="margin-top: 15px;">
            <div style="background-color: ${mainTheme}; color: #fff; padding: 6px 10px; font-weight: bold; text-align: center; text-transform: uppercase;">
              DISCIPLINE
            </div>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%;">Indicator</th>
                  <th style="width: 45%;">Sub-Indicator</th>
                  <th style="width: 25%;">Marks / Grade</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        `;
      }

      const photoImgHTML = (studentPhoto && !photoError)
        ? `<img src="${studentPhoto}" style="width: 80px; height: 100px; object-fit: cover; border-radius: 4px; border: 1.5px solid ${mainTheme};" />`
        : `<div style="width: 80px; height: 100px; border-radius: 4px; border: 1.5px solid ${mainTheme}; background-color: #eee; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #777; text-align: center;">Photo</div>`;

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8" />
          <title>${reportTitle}</title>
          <style>
            @page {
              size: A4;
              margin: 12mm 10mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
              color: #1a1a1a;
              font-size: 11px;
              margin: 0;
              padding: 0;
            }
            .header-box {
              text-align: center;
              border-bottom: 2px solid ${mainTheme};
              padding-bottom: 8px;
              margin-bottom: 10px;
            }
            .school-name {
              font-size: 18px;
              font-weight: bold;
              color: ${mainTheme};
              text-transform: uppercase;
              margin: 4px 0;
            }
            .sub-text {
              font-size: 11px;
              color: #444;
              margin: 2px 0;
            }
            .badge-bar {
              display: flex;
              justify-content: space-between;
              background-color: ${liteTheme};
              padding: 6px 12px;
              font-weight: 600;
              font-size: 11px;
              margin-bottom: 10px;
              border-radius: 4px;
            }
            .student-section {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              background-color: #fff;
              border: 1px solid #ddd;
              padding: 8px;
              border-radius: 4px;
            }
            .student-details {
              flex: 1;
            }
            .detail-row {
              display: flex;
              margin-bottom: 4px;
              font-size: 11px;
            }
            .detail-label {
              width: 120px;
              font-weight: 600;
              color: #333;
            }
            .detail-val {
              flex: 1;
              color: #111;
            }
            .section-title {
              background-color: ${mainTheme};
              color: #fff;
              padding: 6px 10px;
              font-weight: bold;
              text-align: center;
              font-size: 11px;
              text-transform: uppercase;
              border-radius: 3px 3px 0 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            th, td {
              border: 1px solid #b0bec5;
              padding: 5px 4px;
              text-align: center;
              font-size: 10px;
            }
            th {
              background-color: ${mainTheme};
              color: #fff;
              font-weight: 600;
            }
            .summary-bar {
              display: flex;
              justify-content: space-around;
              background-color: ${liteTheme};
              padding: 8px;
              margin-top: 10px;
              border-radius: 4px;
              border: 1px solid #cfd8dc;
            }
            .summary-item {
              text-align: center;
            }
            .summary-title {
              font-size: 10px;
              font-weight: bold;
              color: ${mainTheme};
              text-transform: uppercase;
            }
            .summary-val {
              font-size: 13px;
              font-weight: bold;
              color: #222;
              margin-top: 2px;
            }
            .scale-table {
              font-size: 9.5px;
              margin-top: 8px;
              background-color: #fafafa;
              border: 1px solid #e0e0e0;
              padding: 6px 10px;
              border-radius: 4px;
            }
            .footer-sig {
              display: flex;
              justify-content: space-between;
              margin-top: 25px;
              padding-top: 15px;
              border-top: 1px dashed #999;
              font-weight: 600;
              font-size: 11px;
            }
          </style>
        </head>
        <body>
          <div class="header-box">
            <div class="school-name">${schoolName}</div>
            <div class="sub-text">${affiliatedBy}</div>
            <div class="sub-text">Dise Code: ${diceCode}</div>
            <div class="sub-text">${schoolAddress}</div>
          </div>

          <div class="badge-bar">
            <span>${reportTitle} (${session})</span>
            <span>Class: ${className}</span>
          </div>

          <div class="student-section">
            <div class="student-details">
              <div class="detail-row"><span class="detail-label">Admission No:</span><span class="detail-val">${admissionNo}</span></div>
              <div class="detail-row"><span class="detail-label">SWA Code:</span><span class="detail-val">${schoolID}</span></div>
              <div class="detail-row"><span class="detail-label">Student Name:</span><span class="detail-val"><b>${fullName}</b></span></div>
              <div class="detail-row"><span class="detail-label">Mother's Name:</span><span class="detail-val">${motherName}</span></div>
              <div class="detail-row"><span class="detail-label">Father's Name:</span><span class="detail-val">${fatherName}</span></div>
              <div class="detail-row"><span class="detail-label">Date of Birth:</span><span class="detail-val">${dob}</span></div>
              <div class="detail-row"><span class="detail-label">Address:</span><span class="detail-val">${stuAddress}</span></div>
            </div>
            <div>
              ${photoImgHTML}
            </div>
          </div>

          <div class="section-title">ACADEMIC PERFORMANCE : SCHOLASTIC AREA</div>
          ${isAnnual ? `
            <table>
              <thead>
                <tr>
                  <th rowspan="2" style="width: 18%;">Subject</th>
                  <th colspan="5">TERM - I (100 Marks)</th>
                  <th colspan="5">TERM - II (100 Marks)</th>
                  <th colspan="2">OVERALL T1(50)+T2(50)</th>
                </tr>
                <tr>
                  <th>PT(10)</th>
                  <th>NB(5)</th>
                  <th>SEA(5)</th>
                  <th>HY(80)</th>
                  <th>Total</th>
                  <th>PT(10)</th>
                  <th>NB(5)</th>
                  <th>SEA(5)</th>
                  <th>Annual(80)</th>
                  <th>Total</th>
                  <th>Grand Total</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                ${scholasticRowsHTML}
              </tbody>
            </table>
          ` : `
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">Subject</th>
                  <th>Periodic Test (10)</th>
                  <th>NoteBook (5)</th>
                  <th>SEA (5)</th>
                  <th>Half Yearly (80)</th>
                  <th>Total (100)</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                ${scholasticRowsHTML}
              </tbody>
            </table>
          `}

          <div class="summary-bar">
            <div class="summary-item">
              <div class="summary-title">Overall Marks</div>
              <div class="summary-val">${displayOverall}</div>
            </div>
            <div class="summary-item">
              <div class="summary-title">Percentage</div>
              <div class="summary-val">${displayPercentage}</div>
            </div>
            <div class="summary-item">
              <div class="summary-title">Grade</div>
              <div class="summary-val">${displayGrade}</div>
            </div>
          </div>

          <div class="scale-table">
            <b>8 Point Grading Scale:</b>
            A1 (91%-100%), A2 (81%-90%), B1 (71%-80%), B2 (61%-70%), C1 (51%-60%), C2 (41%-50%), D (33%-40%), E (32% or below)
          </div>

          ${coScholasticHTML}
          ${disciplineHTML}

          <div class="footer-sig">
            <div>Attendance: _________</div>
            <div>Remarks: ____________</div>
            <div>Class Teacher: _________</div>
            <div>Principal: _________</div>
          </div>
        </body>
        </html>
      `;

      await RNPrint.print({
        html: htmlContent,
      });
    } catch (error) {
      console.log('Error printing/sharing report:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  const indicatorData = reportData?.data?.scholasticIndicator?.indicatorDetails
  if (indicatorData != undefined) {
    Object.keys(indicatorData).forEach(function (key, index) {
      indicatorsList.push(indicatorData[key])
    })
  }
  const disciplineIndicator = reportData?.data?.disciplineIndicator?.indicatorDetails
  if (disciplineIndicator != undefined) {
    Object.keys(disciplineIndicator).forEach(function (key, index) {
      disciplineIndicatorList.push(disciplineIndicator[key])
    })
  }
  return (
    <View style={{ flex: 1, width: '100%' }}>
      {subjectMarksList[0] == undefined ?
        <Loader /> :
        <ScrollView>
          {/* Top Action Bar for Print & Share */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: userData.data.colors.liteTheme,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderBottomWidth: 0.8,
            borderColor: userData.data.colors.mainTheme,
          }}>
            <Text style={{ fontWeight: '700', color: SWATheam.SwaBlack, fontSize: 13 }}>
              Progress Report Card
            </Text>
            <TouchableOpacity
              onPress={handlePrintAndShare}
              disabled={isPrinting}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: userData.data.colors.mainTheme,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 6,
              }}>
              {isPrinting ? (
                <ActivityIndicator size="small" color={SWATheam.SwaWhite} style={{ marginRight: 6 }} />
              ) : null}
              <Text style={{ color: SWATheam.SwaWhite, fontWeight: '700', fontSize: 12 }}>
                {isPrinting ? 'Preparing...' : 'Print & Share'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ borderBottomWidth: .7, borderColor: userData.data.colors.mainTheme, paddingBottom: 10, }}>
            <Image source={require('../../../assets/SW_Logo.png')} style={{ width: 80, height: 80, alignSelf: 'center', marginBottom: 5, borderColor: userData.data.colors.mainTheme, }} />
            <Text style={{ textAlign: 'center', fontWeight: '700', textTransform: 'uppercase', fontSize: 18, color: userData.data.colors.mainTheme, marginBottom: 10 }}>{reportData.data.schoolData.schoolName}</Text>
            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportData.data.schoolData.affiliatedBy}</Text>
            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>Dise Code : {reportData.data.schoolData.diceCode}</Text>
            <Text style={{ textAlign: 'center', color: SWATheam.SwaBlack }}>{reportData.data.schoolData.city + ' ' + reportData.data.schoolData.state + ' ' + reportData.data.schoolData.country + '-' + reportData.data.schoolData.pinCode}</Text>
          </View>

          <View style={{ flexDirection: "row", backgroundColor: userData.data.colors.liteTheme, padding: 10 }}>
            <View style={{ width: "50%", display: "flex", flexDirection: "row" }}>
              <Text style={{ width: 90, fontWeight: '500' }}>SWA Code:</Text>
              <Text style={{ flex: 1, alignItems: 'center', fontWeight: '500' }}>{reportData.data.schoolData.schoolID}</Text>
            </View>
            <View style={{ width: "50%", display: "flex", flexDirection: "row" }}>
              <Text style={{ width: 110, fontWeight: '500' }}>Admission No:</Text>
              <Text style={{ flex: 1, alignItems: 'center', fontWeight: '500' }}>{reportData.data.studentData.admissionNo}</Text>
            </View>

          </View>






          <View style={{ padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1, paddingRight: 10 }}>
                <View style={{ marginTop: 4, flexDirection: 'row' }}>
                  <View style={{ width: 110 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Name:</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: SWATheam.SwaBlack }}>
                      {[
                        studentData?.firstName,
                        studentData?.middleName,
                        studentData?.lastName
                      ].filter(name => name != null && name !== '').join(' ') || '-'}
                    </Text>
                  </View>
                </View>

                <View style={{ marginTop: 6, flexDirection: 'row' }}>
                  <View style={{ width: 110 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Mother's Name:</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: SWATheam.SwaBlack }}>{studentData?.motherName || '-'}</Text>
                  </View>
                </View>

                <View style={{ marginTop: 6, flexDirection: 'row' }}>
                  <View style={{ width: 110 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Father's Name:</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: SWATheam.SwaBlack }}>{studentData?.fatherName || '-'}</Text>
                  </View>
                </View>

                <View style={{ marginTop: 6, flexDirection: 'row' }}>
                  <View style={{ width: 110 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Date of Birth:</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: SWATheam.SwaBlack }}>{formatDateOfBirth(studentData?.dateOfBirth || studentData?.dob)}</Text>
                  </View>
                </View>

                <View style={{ marginTop: 6, flexDirection: 'row' }}>
                  <View style={{ width: 110 }}>
                    <Text style={{ color: SWATheam.SwaBlack, fontWeight: '500' }}>Address:</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: SWATheam.SwaBlack }}>{studentData?.address || '-'}</Text>
                  </View>
                </View>
              </View>

              {/* Student Profile Photo Frame */}
              <View style={{
                width: 85,
                height: 105,
                borderRadius: 6,
                borderWidth: 1.5,
                borderColor: userData?.data?.colors?.mainTheme || SWATheam.SwaBlue,
                backgroundColor: SWATheam.SwaWhite,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.15,
                shadowRadius: 2,
                elevation: 2,
              }}>
                <Image
                  source={
                    studentPhoto && !photoError
                      ? { uri: studentPhoto }
                      : require('../../../assets/defaultUser.png')
                  }
                  onError={() => setPhotoError(true)}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </View>
            </View>
          </View>
          <View style={{ backgroundColor: userData.data.colors.liteTheme, paddign: 10, marginTop: 10 }}>
            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center', paddingVertical: 10, fontWeight: '700' }}>ACADEMIC PERFORMANCE : SCHOLASTIC AREA</Text>
            <ScrollView horizontal>
              {(reportSubIconID == 63 && testType == 5) || (userType == 5 && selectedIcon == 106) ?
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{}}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, padding: 10 }}>SCHOLASTIC AREA</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, borderTopWidth: 1, borderColor: SWATheam.SwaWhite, padding: 10, width: 150 }}>
                        <Text style={{ color: SWATheam.SwaWhite }}>Sujbects</Text>
                      </View>
                    </View>
                    <View style={{ borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite }}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textAlign: 'center', padding: 10 }}>TERM - I (100 Marks)</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row' }}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Periodic Test (10)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>NoteBook (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>SEA (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Half Yearly (80)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Total (100)</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite }}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textAlign: 'center', padding: 10 }}>TERM - II (100 Marks)</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row' }}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Periodic Test (10)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>NoteBook (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>SEA (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Annualy (80)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Total (100)</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{}}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, padding: 10, textAlign: 'center' }}>OVERALL T1(50) + T2(50)</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row' }}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Grand Total</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Grade</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {subjectMarksList.map((item, index) => {
                    const pt1 = item?.subjectMarks?.periodicTest?.obtainedMarks;
                    const nb1 = item?.subjectMarks?.noteBookMarks;
                    const sea1 = item?.subjectMarks?.seaMarks;
                    const hy1 = item?.subjectMarks?.halfYearlyMarks?.obtainedMarks;
                    const hasT1 = pt1 != null || nb1 != null || sea1 != null || hy1 != null;
                    const t1Total = (Number(pt1) || 0) + (Number(nb1) || 0) + (Number(sea1) || 0) + (Number(hy1) || 0);
                    const obtainedMarks = hasT1 ? t1Total : "";

                    const annualItem = anualReportData[index];
                    const pt2 = annualItem?.subjectMarks?.periodicTest?.obtainedMarks;
                    const nb2 = annualItem?.subjectMarks?.noteBookMarks;
                    const sea2 = annualItem?.subjectMarks?.seaMarks;
                    const t2m = annualItem?.subjectMarks?.term2YearlyMarks?.obtainedMarks;
                    const hasT2 = pt2 != null || nb2 != null || sea2 != null || t2m != null;
                    const t2Total = (Number(pt2) || 0) + (Number(nb2) || 0) + (Number(sea2) || 0) + (Number(t2m) || 0);
                    const annualObtainMarks = hasT2 ? t2Total : "";

                    let grandTotal = "";
                    let grade = "";
                    if (hasT1 || hasT2) {
                      grandTotal = Math.round((t1Total + t2Total) / 2);
                      grade = getGrade(grandTotal);
                    }






                    return (
                      <View style={{ flexDirection: 'row' }} key={index}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaBlack }}>{item.subjectName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.periodicTest?.obtainedMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.noteBookMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.seaMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item.subjectMarks?.halfYearlyMarks?.obtainedMarks}</Text>
                          </View>
                        </View>

                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{obtainedMarks}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{anualReportData[index]?.subjectMarks?.periodicTest?.obtainedMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{anualReportData[index]?.subjectMarks?.noteBookMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{anualReportData[index]?.subjectMarks?.seaMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{anualReportData[index]?.subjectMarks?.term2YearlyMarks?.obtainedMarks}</Text>
                          </View>
                        </View>

                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{annualObtainMarks}</Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{grandTotal == 0 ? "" : grandTotal}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{grade}</Text>
                          </View>
                        </View>
                      </View>
                    )
                  })}
                </View>

                :
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{}}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, padding: 10 }}>SCHOLASTIC AREA</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, borderTopWidth: 1, borderColor: SWATheam.SwaWhite, padding: 10, width: 150 }}>
                        <Text style={{ color: SWATheam.SwaWhite }}>Sujbect</Text>
                      </View>
                    </View>
                    <View style={{}}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textAlign: 'center', padding: 10 }}>Half Yearly (100 Marks)</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row' }}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Periodic Test (10)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>NoteBook (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>SEA (5)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Half Yearly (80)</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{}}>
                      <Text style={{ backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, padding: 10, textAlign: 'center' }}>OVERALL</Text>
                      <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row' }}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Total (100)</Text>
                        </View>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaWhite, textAlign: 'center' }}>Grade</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* datapart */}
                  {subjectMarksList.map((item, index) => {
                    const pt = item?.subjectMarks?.periodicTest?.obtainedMarks;
                    const nb = item?.subjectMarks?.noteBookMarks;
                    const sea = item?.subjectMarks?.seaMarks;
                    const hy = item?.subjectMarks?.halfYearlyMarks?.obtainedMarks;
                    const hasMarks = pt != null || nb != null || sea != null || hy != null;
                    const tTotal = (Number(pt) || 0) + (Number(nb) || 0) + (Number(sea) || 0) + (Number(hy) || 0);
                    const obtainedMarks = hasMarks ? tTotal : "";
                    const grade = hasMarks ? getGrade(tTotal) : "";




                    return (
                      <View style={{ flexDirection: 'row' }} key={index}>
                        <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                          <Text style={{ color: SWATheam.SwaBlack }}>{item.subjectName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', }}>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.periodicTest?.obtainedMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.noteBookMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item?.subjectMarks?.seaMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{item.subjectMarks?.halfYearlyMarks?.obtainedMarks}</Text>
                          </View>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{obtainedMarks}</Text>
                          </View>
                          <View style={{ padding: 10, borderWidth: .7, borderColor: SWATheam.SwaWhite, width: 150 }}>
                            <Text style={{ color: SWATheam.SwaBlack, textAlign: 'center' }}>{grade}</Text>
                          </View>
                        </View>

                      </View>
                    )
                  })}
                  {/* datapart */}
                </View>
              }
            </ScrollView>
          </View>
          <View style={{ padding: 10 }}>
            <Text style={{ color: SWATheam.SwaBlack, fontWeight: '700', marginVertical: 6 }}>8 Point Grading Scale:</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', width: '38%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>A1</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(91%-100%),</Text>
              </View>
              <View style={{ flexDirection: 'row', width: '58%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>A2</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(81%-90%), </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', width: '38%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>B1</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(71%-80%),</Text>
              </View>
              <View style={{ flexDirection: 'row', width: '58%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>B2</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(61%-70%),</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', width: '38%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>C1</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(51%-60%),</Text>
              </View>
              <View style={{ flexDirection: 'row', width: '58%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>C2</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(41%-50%),</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', width: '38%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>D</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(33%-40%),</Text>
              </View>
              <View style={{ flexDirection: 'row', width: '58%' }}>
                <Text style={{ width: 30, color: SWATheam.SwaBlack, fontWeight: '500' }}>E</Text>
                <Text style={{ flex: 1, color: SWATheam.SwaBlack }}>(32% or below - Needs Improvement)</Text>
              </View>
            </View>
          </View>
          <ScrollView horizontal>
            <View style={{ backgroundColor: userData.data.colors.liteTheme, paddingHorizontal: 10, paddingVertical: 4, flexDirection: 'row', justifyContent: 'space-between', }}>
              <View style={{ width: 250, flexDirection: 'row', marginVertical: 4 }}>
                <Text style={{ padding: 10, width: '60%', backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Overall</Text>
                <Text style={{ padding: 10, width: '40%', backgroundColor: SWATheam.SwaWhite, color: SWATheam.SwaBlack }}>{displayOverall}</Text>
              </View>
              <View style={{ width: 250, flexDirection: 'row', marginVertical: 4 }}>
                <Text style={{ padding: 10, width: '60%', backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Percentage</Text>
                <Text style={{ padding: 10, width: '40%', backgroundColor: SWATheam.SwaWhite, color: SWATheam.SwaBlack }}>{displayPercentage}</Text>
              </View>
              <View style={{ width: 250, flexDirection: 'row', marginVertical: 4 }}>
                <Text style={{ padding: 10, width: '60%', backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Grade</Text>
                <Text style={{ padding: 10, width: '40%', backgroundColor: SWATheam.SwaWhite, color: SWATheam.SwaBlack }}>{displayGrade}</Text>
              </View>
              <View style={{ width: 250, flexDirection: 'row', marginVertical: 4 }}>
                <Text style={{ padding: 10, width: '60%', backgroundColor: userData.data.colors.mainTheme, color: SWATheam.SwaWhite, textTransform: 'uppercase' }}>Rank</Text>
                <Text style={{ padding: 10, width: '40%', backgroundColor: SWATheam.SwaWhite, color: SWATheam.SwaBlack }}></Text>
              </View>

            </View>

          </ScrollView>

          <View style={styles.container}>

            <View style={{ padding: 6, flexDirection: "row" }}>
              <View style={{ width: "50%", paddingVertical: 6 }}>
                <Text>Attendance:</Text>
              </View>
              <View style={{ width: "50%", paddingVertical: 6 }}>
                <Text>Remarks:</Text>
              </View>
            </View>
            <View style={{ padding: 6, flexDirection: "row" }}>
              <View style={{ width: "50%", paddingVertical: 6 }}>
                <Text>Date:</Text>
              </View>
              <View style={{ width: "50%", paddingVertical: 6 }}>
                <Text>Class Teacher:</Text>
              </View>
            </View>
            <View style={{ padding: 6, flexDirection: "row" }}>
              <View style={{ width: "50%", paddingVertical: 6 }}>
                <Text>Principal:</Text>
              </View>

            </View>




          </View>



          {indicatorsList[0] != undefined ?
            <View>
              <View style={{ backgroundColor: userData.data.colors.mainTheme, padding: 10 }}>
                <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: '500' }}>CO-SCHOLASTIC AREA</Text>
              </View>
              <ScrollView horizontal>
                <View>
                  <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row', borderTopWidth: 1, borderColor: SWATheam.SwaWhite }}>
                    <Text style={{ width: 200, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Indicator</Text>
                    <Text style={{ width: 300, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Sub-Indicator</Text>
                    <Text style={{ width: 200, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Marks</Text>
                  </View>
                  {indicatorsList.map((value, keys) => {
                    let subIndicator = []
                    if (value?.subIndicators != undefined) {
                      Object.keys(value.subIndicators || {}).forEach(function (key, index) {
                        subIndicator.push(value.subIndicators[key])
                      })
                    }
                    return (
                      <View style={{ flexDirection: 'row', }} key={value.mainIndicatorID}>
                        <View style={{ width: 200, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                          <Text style={{ color: SWATheam.SwaBlack }}>{value.mainIndicatorName != null ? value.mainIndicatorName : null}</Text>
                        </View>
                        <View style={{ width: 300, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                          {subIndicator[0] != undefined ?
                            <>
                              {subIndicator.map((value2, keys2) => {
                                return (
                                  <Text style={{ color: SWATheam.SwaBlack }} key={keys2}>{value2.subIndicatorName}</Text>
                                )
                              })}
                            </> : null
                          }
                        </View>
                        <View style={{ width: 200, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                          {subIndicator[0] != undefined ?
                            <>
                              {subIndicator.map((value3, keys3) => {
                                return (
                                  <Text style={{ color: SWATheam.SwaBlack }} key={keys3}>{value3.subIndicatorMarks}</Text>)
                              })}
                            </> :
                            <Text style={{ color: SWATheam.SwaBlack }}>{value.mainIndicatorMarks}</Text>
                          }
                        </View>
                      </View>
                    )
                  })}
                </View>
              </ScrollView>
            </View> : null
          }

          {disciplineIndicatorList[0] != undefined ?
            <View style={{ marginTop: 20 }}>
              <View style={{ backgroundColor: userData.data.colors.mainTheme, padding: 10 }}>
                <Text style={{ textAlign: 'center', color: SWATheam.SwaWhite, fontWeight: '500' }}>DISCIPLINE</Text>
              </View>
              <ScrollView horizontal>
                <View>
                  <View style={{ backgroundColor: userData.data.colors.mainTheme, flexDirection: 'row', borderTopWidth: 1, borderColor: SWATheam.SwaWhite }}>
                    <Text style={{ width: 200, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Indicator</Text>
                    <Text style={{ width: 300, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Sub-Indicator</Text>
                    <Text style={{ width: 200, padding: 10, textAlign: 'center', borderRightWidth: 1, borderLeftWidth: 1, borderColor: SWATheam.SwaWhite, color: SWATheam.SwaWhite }}>Marks</Text>
                  </View>
                  {disciplineIndicatorList[0] == undefined ?
                    <Loader /> :
                    <>
                      {disciplineIndicatorList.map((value, keys) => {

                        let subIndicator = []

                        if (value?.subIndicators != undefined) {
                          Object.keys(value.subIndicators).forEach(function (key, index) {
                            subIndicator.push(value.subIndicators[key])
                          })
                        }



                        return (
                          <View style={{ flexDirection: 'row', }} key={value.mainIndicatorID}>
                            <View style={{ width: 200, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                              <Text style={{ color: SWATheam.SwaBlack }}>{value.mainIndicatorName != null ? value.mainIndicatorName : null}</Text>
                            </View>
                            <View style={{ width: 300, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                              {subIndicator[0] != undefined ?
                                <>
                                  {subIndicator.map((value2, keys2) => {
                                    return (
                                      <Text style={{ color: SWATheam.SwaBlack }} key={keys2}>{value2.subIndicatorName}</Text>
                                    )
                                  })}

                                </> : null
                              }
                            </View>
                            <View style={{ width: 200, padding: 10, borderWidth: 1, borderColor: SWATheam.SwaGray }}>
                              {subIndicator[0] != undefined ?
                                <>
                                  {subIndicator.map((value3, keys3) => {
                                    return (
                                      <Text style={{ color: SWATheam.SwaBlack }} key={keys3}>{value3.subIndicatorMarks}</Text>
                                    )
                                  })}

                                </> : null
                              }
                            </View>
                          </View>
                        )
                      })}
                    </>

                  }
                </View>
              </ScrollView>
            </View> : null

          }

          {/* Bottom Action Button for Print & Share / Save as PDF */}
          <View style={{ padding: 15, alignItems: 'center', marginVertical: 10 }}>
            <TouchableOpacity
              onPress={handlePrintAndShare}
              disabled={isPrinting}
              style={{
                backgroundColor: userData.data.colors.mainTheme,
                paddingVertical: 10,
                paddingHorizontal: 24,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 3,
                elevation: 3,
              }}>
              {isPrinting ? (
                <ActivityIndicator size="small" color={SWATheam.SwaWhite} style={{ marginRight: 8 }} />
              ) : null}
              <Text style={{ color: SWATheam.SwaWhite, fontWeight: 'bold', fontSize: 14 }}>
                {isPrinting ? 'Preparing Report...' : 'Print & Save / Share Report'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      }

    </View>
  )
}

export default HalfYearlyAndAnnualProgressReport

const styles = StyleSheet.create({


})