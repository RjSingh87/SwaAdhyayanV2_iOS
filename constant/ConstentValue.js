// export const baseURL = 'https://swaadhyayan.com/lmsv2/api/';
export const baseURL = 'https://swaadhyayan.com/school1/api/';
export const assetsPath = 'https://swaadhyayan.com/data/'
export const token = "=4WY5FWeoRWYhd3c";
export const teacherId = 1;
export const studentId = 2;
export const apiRoot = Object.freeze({
    appLogin: 'appLogin',
    appDashboard: 'appDashboard',
    appSubIcons: 'appSubIcons',
    getClassList: 'getClassList',
    getSectionList: "getSectionList",
    getSubjectList: "getSubjectList",
    getBooksList: "getBooksList",
    getLearningToolsList: "getLearningToolsList",
    getModuleActivityData: "getModuleActivityData",
    getLearningRightToolsList: "getLearningRightToolsList",
    getFilePathAccToLearningType: "getFilePathAccToLearningType",
    septModules: "septModules",
    septQuestions: "septQuestions",
    septAttempt: "septAttempt",
    reportSEPT: "reportSEPT",
    timeTable: "timeTable",
    getTeachersListApp: "getTeachersListApp",
    assignTimeTableToTeacherApp: "assignTimeTableToTeacherApp",
    subjectsTimeTableApp: "subjectsTimeTableApp",
    deAssignTeacherTimeTableApp: "deAssignTeacherTimeTableApp",
    updateProfilePhoto: "updateProfilePhoto",
    getProfileData: "getProfileData",
    updateProfileData: "updateProfileData",
    swaGamesSubjectForSchool: "swaGamesSubjectForSchool",
    getAppSwaGamesLink: "getAppSwaGamesLink",
    trmLessonPlanOfClass: "trmLessonPlanOfClass",
    getNcertSubjectOfClass: "getNcertSubjectOfClass",
    ncertBookAccToSubject: "ncertBookAccToSubject",
    getChapterOfNcertBook: "getChapterOfNcertBook",
    getNcertExamQuestion: "getNcertExamQuestion",
    submitNcertExamAttempt: "submitNcertExamAttempt",
    studentNcertViewReport: "studentNcertViewReport",
    studentAllNcertAttemptReport: "studentAllNcertAttemptReport",
    getChildIcons: "getChildIcons",
    getClassesAccToReport: "getClassesAccToReport",
    getStudentsData: "getStudentsData",
    consolidatedSeptReport: "consolidatedSeptReport",
    overAllClassAnalysisReport: "overAllClassAnalysisReport",
    studentCbseSafalList: "studentCbseSafalList",
    getSafalExamQuestion: "getSafalExamQuestion",
    safalViewAttemptExamReport: "safalViewAttemptExamReport",
    safalViewAllAttemptExamReport: "safalViewAllAttemptExamReport",
    getConpitativeExamList: "getConpitativeExamList",
    submitSafalExamAttempt: "submitSafalExamAttempt",
    // report//
    allSubjectsProficiencyReport: "allSubjectsProficiencyReport",
    classWisePercentageReport: "classWisePercentageReport",
    getAssessmentReportData: "getAssessmentReportData",
    subjectAndAssessmentGradingReport: "subjectAndAssessmentGradingReport",
    subjectWiseStudentComparisonReport: "subjectWiseStudentComparisonReport",
    allSubjectStudentComparisonReport: "allSubjectStudentComparisonReport",
    assessmentWiseStudentReport: "assessmentWiseStudentReport",
    getSubjectWiseDifficultyAnalysis: "getSubjectWiseDifficultyAnalysis",
    getAssessmentWiseSubjectReport: "getAssessmentWiseSubjectReport",
    getSubjectWiseComprehensiveReport: "getSubjectWiseComprehensiveReport",
    getHalfYearlyReports: "getHalfYearlyReports",
    getAnnualReport: "getAnnualReport",
    defaultExamList: "defaultExamList",
    classAssessmentWiseSubjectReport: "classAssessmentWiseSubjectReport",
    assessmentReportListSubjectWise: "assessmentReportListSubjectWise",
    chapterWiseStudentAssessmentReport: "chapterWiseStudentAssessmentReport",
    assessmentReportListSubjectWise: "assessmentReportListSubjectWise",
    analyticalReportSubjectWise: "analyticalReportSubjectWise",
    // report//
    // assessment //
    getAssessClassList: "getAssessClassList",
    getSectionList: "getSectionList",
    getSubjectList: "getSubjectList",
    getBooksList: "getBooksList",
    getBookChapterList: "getBookChapterList",
    getQuestionTypeList: "getQuestionTypeList",
    getQuestionLavelList: "getQuestionLavelList",
    getAssessmentNameList: "getAssessmentNameList",
    getGeneratedAssessQuestion: "getGeneratedAssessQuestion",
    generateAndViewAssessment: "generateAndViewAssessment",
    assignAssessmentToStudents: "assignAssessmentToStudents",
    downloadPdf: "downloadPdf",
    // auto assessment//
    submitAutoAssessMarksWise: "submitAutoAssessMarksWise",
    submitAutoAssessTypeWise: "submitAutoAssessTypeWise",
    autoAssessmentGenerateQuest: "autoAssessmentGenerateQuest",
    // auto assessment//

    // assessment attempt //
    getGeneratedAssessmentList: "getGeneratedAssessmentList",
    viewResult: "viewResult",
    // assessment attempt //
    // assessment by bharat //
    getDifficultyLevels: "getDifficultyLevels",
    getActivityType: "getActivityType",
    getTnFValue: "getTnFValue",
    getQuestionFor: "getQuestionFor",
    getMarksUptoTen: "getMarksUptoTen",
    addBulkQuestions: "addBulkQuestions",
    saveQuestionManually: "saveQuestionManually",
    getAssessmentList: "getAssessmentList",
    getStudentListWithAssessment: "getStudentListWithAssessment",
    viewAssessmentResult: "viewAssessmentResult",
    viewAssessmentReport: "viewAssessmentReport",
    getAssessmentList: "getAssessmentList",
    deleteAssessment: "deleteAssessment",
    declareAssessmentResult: "declareAssessmentResult",
    assignAssessmentToStudents: "assignAssessmentToStudents",
    getSectionForReAssign: "getSectionForReAssign",
    downloadAssPdf: "downloadAssPdf",
    checkOfflineList: "checkOfflineList",
    saveDescMarks: "saveDescMarks",
    checkDescSheets: "checkDescSheets",

    // assessment by bharat //
    // assessment //
    // swaSharing//
    getSharedPostApp: "getSharedPostApp",
    getSharedPostApp: "getSharedPostApp",
    getAppPostLikeCount: "getAppPostLikeCount",
    getPostCommentsApp: "getPostCommentsApp",
    togglePostLikeDislikeApp: "togglePostLikeDislikeApp",
    getAppSharingGroup: "getAppSharingGroup",
    createAppSharingGroup: "createAppSharingGroup",
    viewMembersAppSharingGroup: "viewMembersAppSharingGroup",
    removeMemberFromSharingGroupApp: "removeMemberFromSharingGroupApp",
    addCommentOnPostApp: "addCommentOnPostApp",
    deleteSharedPostApp: "deleteSharedPostApp",
    addMembersToSharingGroupApp: "addMembersToSharingGroupApp",
    deleteAppSharingGroup: "deleteAppSharingGroup",
    savePostVisitApp: "savePostVisitApp",
    addAllUsersToGroup: "addAllUsersToGroup",
    getAddedMembersInGroup: "getAddedMembersInGroup",
    removeAllSelectedFromGroup: "removeAllSelectedFromGroup",
    editAppSharingGroup: "editAppSharingGroup",
    sharePostApp: "sharePostApp",
    removeAllUsersFromGroup: "removeAllUsersFromGroup",
    // swaSharing//
    appVersion: 'appVersion',
    contact_us: "contact_us",
    // marks Entry//
    getAssessmentData: "getAssessmentData",
    studentListForAssessMarksEntry: "studentListForAssessMarksEntry",
    coScholasticIndicatorSave: "coScholasticIndicatorSave",
    getIndicatorList: "getIndicatorList",
    saveAppSubIndicator: "saveAppSubIndicator",
    deleteAppIndicator: "deleteAppIndicator",
    editIndicatorNSubIndicator: "editIndicatorNSubIndicator",
    deleteSubIndicator: "deleteSubIndicator",
    getIndicatorDataForMarks: "getIndicatorDataForMarks",
    saveSingleIndicatorMarks: "saveSingleIndicatorMarks",
    getStudentForNotebookMarksEntry: "getStudentForNotebookMarksEntry",
    saveAllNotebookSeaMarks: "saveAllNotebookSeaMarks",
    getSubjectAddedBySchool: "getSubjectAddedBySchool",
    getStudentDataForMarksEntry: "getStudentDataForMarksEntry",
    getSchoolSubjectMarks: "getSchoolSubjectMarks",
    getStudentListWithSubjectMarks: "getStudentListWithSubjectMarks", //new
    saveSubjectMarksEntry: "saveSubjectMarksEntry",
    // marks Entry//
    // attendance//
    getAttendanceTeacherStatus: "getAttendanceTeacherStatus",
    getAttendanceStatusClassSectionDayWise: "getAttendanceStatusClassSectionDayWise",
    getPeriodicAttendanceWithStudentList: "getPeriodicAttendanceWithStudentList",
    markPeriodicAttendance: "markPeriodicAttendance",
    getMonthlyAttendanceSummary: "getMonthlyAttendanceSummary",
    getStudentAttendanceDateWise: "getStudentAttendanceDateWise",
    markMonthlyAttendance: "markMonthlyAttendance",
    // attendance//

    // asstesmentAttempt //
    getAssessmentQuestion: "getAssessmentQuestion",
    saveSingleAssessMarks: "saveSingleAssessMarks",
    submitAssessment: "submitAssessment",
    uploadDescExamImage: "uploadDescExamImage",
    deleteDescExamImage: "deleteDescExamImage",

    // asstesmentAttempt//

    // homework//
    createHomework: "createHomework",
    getCreatedHomework: "getCreatedHomework",
    assignHomework: "assignHomework",
    deleteSavedHomework: "deleteSavedHomework",
    getCreatedHomework: "getCreatedHomework",
    deAssignHomework: "deAssignHomework",
    getSubmittedHomeworkTeacher: "getSubmittedHomeworkTeacher",
    checkHomework: "checkHomework",
    getSubmittedHomeworkTeacher: "getSubmittedHomeworkTeacher",
    getStudentsForCertificate: "getStudentsForCertificate",
    getStudentReportData: "getStudentReportData",
    getIssuedCertificate: "getIssuedCertificate",
    getCertificatePdf: "getCertificatePdf",
    deleteCertificate: "deleteCertificate",
    getStudentsForCertificate: "getStudentsForCertificate",
    awardType: "awardType",
    getMonths: "getMonths",
    issueCertificate: "issueCertificate",
    // student //
    getCreatedHomeworkStudent: "getCreatedHomeworkStudent",
    submitHomework: "submitHomework",
    getCreatedHomeworkStudent: "getCreatedHomeworkStudent",
    getCheckedHomeworkStudent: "getCheckedHomeworkStudent",
    getAwardedCertificateStudent: "getAwardedCertificateStudent",
    getCertificatePdf: "getCertificatePdf",
    // homework//
    // LiveClass//
    getStudentListForLiveClass: "getStudentListForLiveClass",
    saveLiveClasses: "saveLiveClasses",
    liveClassesList: "liveClassesList",
    deleteLiveClass: "deleteLiveClass",
    // LiveClass//
    getSafalSubjectAccToClass: "getSafalSubjectAccToClass",
    getAllSafalLessonPlan: "getAllSafalLessonPlan"



});
export const SWATheam = {
    SwaBlue: '#1455CD',
    SwaRed: '#E84143',
    SwaGreen: "#3CB043",
    SwaLightBlue: "#C9CEE2",
    SwaBorder: '#DBE3F0',
    SwaBlack: '#000',
    SwaGray: '#808080',
    SwaLightGray: '#eaeaea',
    SwaWhite: '#fff'
}
export const UserTheam = {
    UserDark: '#0C8781',
    UserLight: '#0E9E97',
    UserExLight: '#DEF2F1',
    UserBorder: '#ABDEDB'
}