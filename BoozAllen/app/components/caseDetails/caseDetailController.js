
(function () {
    'use strict';

    angular.module('riskCanvasApp')
        .controller('caseDetailCtrl',
        [
            "$state", "$scope", "$stateParams", "$window", "$http", "authenticationSvc", "ShareData", "globals",
            function ($state, $scope, $stateParams, $window, $http, authenticationSvc, shareData, globals) {
                // case details section
 $scope.reviewcaseSummary = true;
               $scope.analyzecaseSummary = true;
               $scope.conductcaseSummary = true;
               $scope.decisioncaseSummary = true;
                
                var relatedCasesAndAlertsColumnDefs = [

                    {
                        headerName: "", field: "title", width: 95, suppressMenu: 'true', cellRenderer: upperCaseNewValueHandler,
                        cellClass: 'rag-initial',
                        cellClassRules: {
                            'rag-green': function (params) { return params.data.riskScore < 33.334 },
                            'rag-amber': function (params) { return params.data.riskScore >= 33.334 && params.data.riskScore < 66.667 },
                            'rag-red': function (params) { return params.data.riskScore >= 66.667 }
                        }
                    },
                    {
                        headerName: "User Details", field: "", width: 1000, suppressMenu: 'true', cellClass: 'rag-entity', cellRenderer: function (params) {
                            return '<span><a style="cursor:pointer!important;"> <b>' + params.data.title + '</b> -' + params.data.id + '</a><br />' + params.data.accountType + ' - ' + params.data.accountNumber + '</span>';

                        }
                    },
                    {
                        headerName: "Created Date",
                        field: "openDate",
                        width: 175
                    },
                    {
                        headerName: "Closed Date",
                        field: "closedDate",
                        width: 175,
                        filter: 'number',
                        suppressMenu: 'true'
                    },
                    {
                        headerName: "Closed Deposition",
                        field: "closedDeposition",
                        width: 170,
                        filter: 'number',
                        suppressMenu: 'true'
                    },
                     {
                         headerName: "Assigned Analyst",
                         field: "assignedAnalystName",
                         width: 170,
                         filter: 'number',
                         suppressMenu: 'true'
                     }
                ];

                var alertedTransactionsColumnDefs = [

                  {
                      headerName: "", field: "accountHolderName", width: 80, suppressMenu: 'true', cellRenderer: upperCaseNewValueHandler,
                      cellClass: 'rag-initial',
                      cellClassRules: {
                          'rag-green': function (params) { return params.data.accountHolderRiskScore < 33.334 },
                          'rag-amber': function (params) { return params.data.accountHolderRiskScore >= 33.334 && params.data.accountHolderRiskScore < 66.667 },
                          'rag-red': function (params) { return params.data.accountHolderRiskScore >= 66.667 }
                      }
                  },
                  {
                      headerName: "Account Holder Details", field: "", width: 250, suppressMenu: 'true', cellClass: 'rag-entity', cellRenderer: function (params) {
                          return '<span><a style="cursor:pointer!important;"> <b>' + params.data.accountHolderName + '</b> -' + params.data.accountHolderAccNumber + '</a><br />' + params.data.holderTransferType + ' - ' + params.data.transactionDate + '</span>';

                      }
                  },
                     {
                         headerName: "", field: "beneficiaryName", width: 80, suppressMenu: 'true', cellRenderer: upperCaseNewValueHandler,
                         cellClass: 'rag-initial',
                         cellClassRules: {
                             'rag-green': function (params) { return params.data.beneficiaryRiskScore < 33.334 },
                             'rag-amber': function (params) { return params.data.beneficiaryRiskScore >= 33.334 && params.data.beneficiaryRiskScore < 66.667 },
                             'rag-red': function (params) { return params.data.beneficiaryRiskScore >= 66.667 }
                         }
                     },
                    {
                        headerName: "Beneficiary Details", field: "", width: 250, suppressMenu: 'true', cellClass: 'rag-entity', cellRenderer: function (params) {
                            return '<span><a style="cursor:pointer!important;"> <b>' + params.data.beneficiaryName + '</b> -' + params.data.beneficiaryAccNumber + '</a><br />' + params.data.beneficiaryTransferType + ' - ' + params.data.transactionDate + '</span>';

                        }
                    },
                  {
                      headerName: "Amount",
                      cellRenderer: function (params) {
                          return params.data.currency + " " + params.data.amount;
                      },
                      width: 130
                  },
                  {
                      headerName: "Branch No.",
                      field: "branch",
                      width: 100,
                      filter: 'number',
                      suppressMenu: 'true'
                  },
                  {
                      headerName: "Transaction Type",
                      field: "transactionType",
                      width: 150,
                      filter: 'number',
                      suppressMenu: 'true'
                  },
                   {
                       headerName: "Transaction Description",
                       field: "transactionDescription",
                       width: 200,
                       filter: 'number',
                       suppressMenu: 'true'
                   },
                     {
                         headerName: "Check No.",
                         field: "checkNumber",
                         width: 120,
                         filter: 'number',
                         suppressMenu: 'true'
                     },
                       {
                           headerName: "Check Description",
                           field: "checkDescription",
                           width: 170,
                           filter: 'number',
                           suppressMenu: 'true'
                       },
                        {
                            headerName: "Additional Info",
                            field: "additionalInfo",
                            width: 170,
                            filter: 'number',
                            suppressMenu: 'true'
                        }
                ];

                $scope.relatedCasesAndAlertsOptions = {
                    columnDefs: relatedCasesAndAlertsColumnDefs,
                    rowData: null,
                    headerHeight: 40 * globals.defaultVars.w / globals.defaultVars.winRef,
                    rowHeight: 80 * globals.defaultVars.w / globals.defaultVars.winRef ,
                    enableFilter: true,
                    enableSorting: true,
                    angularCompileRows: true
                };

                $scope.alertedTransactionsOptions = {
                    columnDefs: alertedTransactionsColumnDefs,
                    rowData: null,
                    headerHeight: 0.031 * angular.element(window).width(),
                    rowHeight: 0.0416 * angular.element(window).width(),
                    enableFilter: true,
                    enableSorting: true,
                    angularCompileRows: true
                };
                
                $scope.caseStatus = ["New","Q/A","Analysis", "Data Collection"];
                
                
                $scope.addEditSummary = function (event, type) {
                    if (type == 'Review') {
                        $scope.popuppage = 'Review';
                        if ($scope.ReviewSummaryData != null) {
                            $scope.summaryData = $scope.ReviewSummaryData;
                        }
                    } else if (type == 'Analyze') {
                        $scope.popuppage = 'Analyze';
                        if ($scope.AnalyzeSummaryData != null) {
                            $scope.summaryData = $scope.AnalyzeSummaryData;
                        }
                    } else if (type == 'Conduct') {
                        $scope.popuppage = 'Conduct';
                        if ($scope.ConductSummaryData != null) {
                            $scope.summaryData = $scope.ConductSummaryData;
                        }
                    }

                    angular.element('.addEditSummaryWindow').fadeIn();
                    var elem = event.currentTarget;
                    angular.element(elem).toggleClass('active');
                };

                $scope.closeaddEditSummaryPopup = function () {
                    $scope.addEditSummaryForm.$setPristine();
                    angular.element('.addEditSummaryWindow').fadeOut('fast');
                    $scope.summaryData = null;

                };

                $scope.saveSummary = function () {
                    if ($scope.addEditSummaryForm.$valid) {

                        if ($scope.summaryData == null || $scope.summaryData == undefined) $scope.summaryData = "";
                        if ($scope.popuppage == 'Review') {
                            $scope.ReviewSummaryData = $scope.summaryData;
                        } else if ($scope.popuppage == 'Analyze') {
                            $scope.AnalyzeSummaryData = $scope.summaryData;
                        } else if ($scope.popuppage == 'Conduct') {
                            $scope.ConductSummaryData = $scope.summaryData;
                        }
                        $scope.addEditSummaryForm.$setPristine();
                        $scope.closeaddEditSummaryPopup();
                    }
                };

                $scope.addEditCaseSummary = function (event, type) {
                    if (type == 'Review') {
                            $scope.ReviewSummaryData = $scope.ReviewSummaryData;
                            $scope.reviewcaseSummary = false;
                      
                    } else if (type == 'Analyze') {
                            $scope.AnalyzeSummaryData = $scope.AnalyzeSummaryData;
                            $scope.analyzecaseSummary = false;
                     
                    } else if (type == 'Conduct') {
                      
                            $scope.ConductSummaryData = $scope.ConductSummaryData;
                            $scope.conductcaseSummary = false;
                      
                    }

                };

                $scope.saveCaseSummary = function (type) {


                    if ($scope.ReviewSummaryData == null || $scope.ReviewSummaryData == undefined) $scope.ReviewSummaryData = "";
                    if ($scope.AnalyzeSummaryData == null || $scope.AnalyzeSummaryData == undefined) $scope.AnalyzeSummaryData = "";
                    if ($scope.ConductSummaryData == null || $scope.ConductSummaryData == undefined) $scope.ConductSummaryData = "";

                    if (type == 'Review') {
                        $scope.ReviewSummaryData = $scope.ReviewSummaryData;
                        $scope.reviewcaseSummary = true;
                    } else if (type == 'Analyze') {
                        $scope.AnalyzeSummaryData = $scope.AnalyzeSummaryData;
                        $scope.analyzecaseSummary = true;
                    } else if (type == 'Conduct') {
                        $scope.ConductSummaryData = $scope.ConductSummaryData;
                        $scope.conductcaseSummary = true;
                    }


                };

                $scope.addEditDecisionSummary = function (event) {
                        $scope.DecisionSummaryData = $scope.DecisionSummaryData;
                        $scope.decisioncaseSummary = false;
                };

                $scope.saveDecisionSummary = function () {
                    
                    if ($scope.DecisionSummaryData == null || $scope.DecisionSummaryData == undefined) $scope.DecisionSummaryData = "";
                     $scope.DecisionSummaryData = $scope.DecisionSummaryData;
                        $scope.decisioncaseSummary = true;
                   
                };

                //*** STARTED */Document, Notes and Task Section
                $scope.slideToggleSec = function (element) {
                    var elem = element.currentTarget;
                    angular.element(elem).closest('article').find('.toggleSec').slideToggle();
                    angular.element(elem).toggleClass('open');
                }

                $scope.openAddPopup = function (event, type) {
                    angular.element('.addPopup[data-type=' + type + ']').fadeToggle();
                    var elem = event.currentTarget;
                    angular.element(elem).toggleClass('active');
                };

                $scope.closePopup = function () {
                    angular.element('.addPopup').fadeOut();
                    angular.element('.docsFooter a').removeClass('active');

                    jQuery("#FileDesc").val('');
                    jQuery("#picFile").val('');
                    $scope.IsFileSelected = false;

                    jQuery("#NotesTitle").val('');
                    jQuery("#NotesData").val('');

                    jQuery("#Task").val('');
                    $scope.notesGridCellClicked = false;

                };



                function getContentType(fileExtention) {
                    var contentType = "";
                    switch (fileExtention) {
                        case "pdf":
                            contentType = 'data: application / pdf; base64,';
                            break;
                        case "csv":
                            contentType = 'data:application/vnd.ms-excel;base64,' + response.serializedContent;
                            break;
                        case "txt":
                            contentType = 'data:text/plain;base64,';
                            break;
                        case "png":
                        case "jpeg":
                        case "jpg":
                            contentType = 'data:image/jpeg;base64,';
                            break;
                        case "doc":
                            contentType = 'data:application/msword;base64,';
                            break;
                        case "docx":
                            contentType = 'data: application / vnd.openxmlformats - officedocument.wordprocessingml.document; base64,';
                            break;
                        case "xlsx":
                            contentType = 'data: application / vnd.openxmlformats - officedocument.spreadsheetml.sheet; base64,';
                            break;
                        default:
                    }
                    return contentType;
                }



                function isValidateHandler(params) {
                    var isValid = params.data.validated;
                    var rtnVal;
                    var paramVal = "'" + params.data.documentId + "'";
                    if (isValid) {
                        rtnVal = '<span style="display: inline-block"><div class="switch"><input id="cmn-toggle-' + params.data.documentId + '" class="cmn-toggle cmn-toggle-round" type="checkbox" ng-click="onDocValidationChange(' + paramVal + ')" checked><label for="cmn-toggle-' + params.data.documentId + '"></label></div></span>';
                    } else {
                        rtnVal = '<span style="display: inline-block"><div class="switch"><input id="cmn-toggle-' + params.data.documentId + '" class="cmn-toggle cmn-toggle-round" type="checkbox" ng-click="onDocValidationChange(' + paramVal + ')" ><label for="cmn-toggle-' + params.data.documentId + '"></label></div></span>';
                    }
                    // + '</span>';
                    return rtnVal;
                }

                function guid() {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                          .toString(16)
                          .substring(1);
                    }
                    //return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
                    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
                }

                function doumentCheckBoxHandler(params, idName) {
                    var value;
                    var paramVal;
                    if (idName === 'chkDocID') {
                        value = "'" + params.data.documentId + "'";
                        paramVal = "'" + params.data.documentId + "'";
                        return '<input type="checkbox" value=' + value + ' ng-click="DeleteDocument(' + paramVal + ')" />';
                    } else if (idName === 'chkTasksGridID') {
                        value = "'" + params.data.taskID + "'";
                        paramVal = "'" + params.data.taskID + "'";
                        return '<input type="checkbox" value=' + value + ' ng-click="DeleteTasks(' + paramVal + ')" />';
                    }
                    return '<span></span>';
                }


                $scope.onDocValidationChange = function (documentId) {
                    var array = $scope.DocumentCenterGrid.rowData;

                    for (var i = 0; i < array.length; i++) {
                        var fileName = array[i].documentId;
                        if (fileName === documentId.trim()) {
                            array[i].validated = !array[i].validated;
                            break;
                        }
                    }
                    $scope.DocumentCenterGrid.rowData = array;
                    $scope.DocumentCenterGrid.api.onNewRows();
                }


                /* Document, Notes, taks*/
                /*--------Common Function-----------------*/
                var getItemFromArray = function (array, value) {
                    for (var i = 0; i < array.length; i++) {
                        var fileName = array[i].documentName;
                        if (fileName === value.trim())
                            return array[i];
                    }
                }

                $scope.DownloadFile = function (fileName) {
                    fileName = fileName.trim();

                    var response = getItemFromArray($scope.DocumentCenterGrid.rowData, fileName);

                    var a = document.createElement('a');
                    var fileExt = fileName.split('.')[1];

                    a.href = getContentType(fileExt) + response.serializedContent;
                    a.target = '_blank';
                    a.download = fileName;

                    document.body.appendChild(a);
                    a.click();
                }

                var removeItemFromArray = function (array, value) {
                    var index = array.indexOf(value);
                    if (index === -1)
                        array.push(value);
                    else {
                        if (array.length <= 0)
                            return array;
                        array.splice(index, 1);
                    }
                    return array;
                }

                /*--------Load DocumentCenterGrid-----------------*/
                $scope.IsFileSelected = false;
                $scope.FileName = "";

                $scope.DocumentIDArray = [];
                $scope.DeleteDocument = function (selectedId) {
                    var array = $scope.DocumentIDArray;
                    var outArray = removeItemFromArray(array, selectedId);
                    $scope.DocumentIDArray = outArray;
                }
                
               

                $scope.RemoveDocument = function () {
                    var selectedRowArray = $scope.DocumentIDArray;
                    var notesGridArray = $scope.DocumentCenterGrid.rowData;

                    var newArrayForDcoument = [];
                    for (var i = 0; i < notesGridArray.length; i++) {
                        var idVal = parseInt(notesGridArray[i].ID);
                        var index = selectedRowArray.indexOf(idVal);
                        if (index === -1)
                            newArrayForDcoument.push(notesGridArray[i]);
                    }

                    $scope.DocumentIDArray = [];
                    $scope.DocumentCenterGrid.rowData = newArrayForDcoument;
                    $scope.DocumentCenterGrid.api.onNewRows();
                }

                $scope.file_changed = function (element) {
                    $scope.$apply(function () {
                        var fileUploaded = element.files[0];
                        //var fileExt = fileUploaded.name.split('.')[1];
                        //var fileExtArray = ['.pdf', '.docx', '.doc', '.txt', '.xlsx', '.png', '.jpeg', '.jpg', '.csv'];
                        //if (fileExtArray.indexOf(fileExtArray) == -1) {

                        //    return;
                        //}

                        var reader = new FileReader();
                        reader.onload = function () {
                            // handle onload
                            var fileData = reader.result;
                            $scope.UploaddedFileData = fileData.replace('data:application/pdf;base64,', '').replace('data:image/jpeg;base64,', '')
                            .replace('data:application/msword;base64,', '').replace('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,', '')
                            .replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', '').replace('data:text/plain;base64,', '')
                            .replace('data:application/vnd.ms-excel;base64,', '').replace('data:', '');
                        };
                        reader.readAsDataURL(fileUploaded);
                        $scope.UploaddedFile = fileUploaded;
                        $scope.IsFileSelected = true;
                        $scope.FileName = fileUploaded.name;
                    });
                };
               
                $scope.AddDocument = function (fileDesc) {
                    if (fileDesc == undefined || fileDesc === '')
                        return;
                    if ($scope.UploaddedFile.length <= 0)
                        return;
                    var userInfo = authenticationSvc.getUserInfo();
                    var files = $scope.UploaddedFile;
                    if (files != null) {
                        //var maxId = $scope.DocumentCenterGrid.rowData.length + 1;
                        var newGuidId = guid();
                        var fileName = files.name;
                        var fileData = $scope.UploaddedFileData;
                        var currentDate = new Date().toLocaleDateString();
                        var documentRecord = {
                            //"ID": maxId,
                            "documentName": fileName,
                            "serializedContent": fileData,
                            "uploadDate": currentDate,
                            "lastUpdated": currentDate,
                            "validated": false,
                            "uploadedBy": userInfo.UserName,
                            "shortDescription": fileDesc,
                            "screenId": "DETAILS-72ded2c2-c0aa-4a31-92fb-6b0487029a0f",
                            "entityId": "72ded2c2-c0aa-4a31-92fb-6b0487029a0f",
                            "documentId": newGuidId
                        }

                        $scope.DocumentCenterGrid.rowData.push(documentRecord);
                        $scope.DocumentCenterGrid.api.onNewRows();
                        $scope.closePopup();
                        $scope.UploaddedFile = [];
                        //$scope.FileName = '';
                        jQuery("#FileDesc").val('');
                        jQuery("#picFile").val('');
                        $scope.IsFileSelected = false;
                    }
                };


                var documentCenterGridColumnDefs = [
                    {
                        headerName: "FileName",
                        field: "",
                        width: 440 * globals.defaultVars.w / globals.defaultVars.winRef,
                        cellClass: 'rag-entity',
                        cellRenderer: function (params) {
                            var documentName = "' " + params.data.documentName + "'";
                            return '<span><b> <a ng-click="DownloadFile(' + documentName + ')"> ' + params.data.documentName + '</a> </b> <br />' + params.data.shortDescription + '-By ' + params.data.uploadedBy + '</span>';
                        }
                    },
                    {
                        headerName: "Upload Date",
                        width: 160 * globals.defaultVars.w / globals.defaultVars.winRef,
                        field: "uploadDate",
                        filter: 'date'

                    },
                    {
                        headerName: "Last Updated",
                        suppressMenu: 'true',
                        width: 160 * globals.defaultVars.w / globals.defaultVars.winRef,
                        field: "lastUpdated"
                    },
                    {
                        headerName: "Validated",
                        width: 140 * globals.defaultVars.w / globals.defaultVars.winRef,
                        field: "validated",
                        cellRenderer: function (params) { return isValidateHandler(params) }
                    },
                    {
                        headerName: "fileData",
                        field: "serializedContent",
                        hide: true
                    }
                ];

                $scope.DocumentCenterGrid = {
                    columnDefs: documentCenterGridColumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 50 * globals.defaultVars.w / globals.defaultVars.winRef,
                    rowHeight: 60 * globals.defaultVars.w / globals.defaultVars.winRef,
                    enableFilter: false,
                    enableSorting: false,
                    angularCompileRows: true
                };

                /*--------Load NotesGrid-----------------*/
                $scope.notesGridCellClicked = false;
                $scope.NotesIDArray = [];
                $scope.DeleteNotes = function (selectedId) {
                    var array = $scope.NotesIDArray;
                    var outArray = removeItemFromArray(array, selectedId);
                    $scope.NotesIDArray = outArray;
                }

                $scope.RemoveNotes = function () {
                    if ($scope.NotesIDArray.length < 0) {
                        return;
                    }
                    var selectedRowArray = $scope.NotesIDArray;
                    var notesGridArray = $scope.NotesGrid.rowData;

                    var newArrayForNotes = [];
                    for (var i = 0; i < notesGridArray.length; i++) {
                        var idVal = parseInt(notesGridArray[i].ID);
                        var index = selectedRowArray.indexOf(idVal);
                        if (index === -1)
                            newArrayForNotes.push(notesGridArray[i]);
                    }

                    $scope.NotesIDArray = [];
                    $scope.NotesGrid.rowData = newArrayForNotes;
                    $scope.NotesGrid.api.onNewRows();
                }

                /* Form Submit Method */
                $scope.AddNotes = function (notesTitle, notesData) {
                    if (notesTitle == undefined || notesTitle === '' || notesData == undefined || notesData === '')
                        return;
                    // var userInfo = authenticationSvc.getUserInfo();
                    var currentDate = new Date().toLocaleDateString();
                    //var maxId = $scope.NotesGrid.rowData.length + 1;
                    // var noteDesc = currentDate + " - By " + userInfo.UserName;
                    //var noteId = "note222" + maxId;
                    var newGuidId = guid();
                    var documentRecord = {
                        //"ID": maxId,
                        "noteID": newGuidId,
                        "title": notesTitle,
                        "createdDate": currentDate,
                        "userID": "2985e5a2-8405-4683-a5dd-d4d8cee6b90e",
                        "entityID": "72ded2c2-c0aa-4a31-92fb-6b0487029a0f",
                        "text": notesData,
                        "screenID": "DETAILS-72ded2c2-c0aa-4a31-92fb-6b0487029a0f"
                    }

                    $scope.NotesGrid.rowData.push(documentRecord);
                    $scope.NotesGrid.api.onNewRows();

                    $scope.closePopup();

                    jQuery("#NotesTitle").val('');
                    jQuery("#NotesData").val('');
                };

                $scope.showNotes = function ($event, notesId) {

                    notesId = notesId.trim();
                    var taskGridArray = $scope.NotesGrid.rowData;
                    var newArrayForTask = [];
                    var record;
                    for (var i = 0; i < taskGridArray.length; i++) {
                        var idVal = taskGridArray[i].noteID;

                        if (notesId === idVal) {
                            newArrayForTask.push(taskGridArray[i]);
                            record = taskGridArray[i];

                            jQuery("#NotesTitle").val(record.title);
                            jQuery("#NotesData").val(record.text);

                            this.addNewDocument($event, 'notes');
                            $scope.notesGridCellClicked = true;
                            break;
                        }
                    }
                }

                $scope.addPersona = function () {
                    if ($scope.PersonaForm.$valid) {
                        var jsonObj = $scope.cardDatas;
                        var cardData = {};
                        cardData["name"] = $scope.personaFirstName + " " + $scope.personaLastName;
                        cardData["active"] = true;
                        cardData["new"] = true;
                        cardData["source"] = "newly added";
                        cardData["phone"] = $scope.personaPhoneNo;
                        cardData["email"] = $scope.personaEmail;
                        cardData["address"] = $scope.personaStreet1 + " " + $scope.personaStreet2 + ", " + $scope.personaCity + ", " + $scope.personaState + " " + $scope.personaZipCode;
                        cardData["shortname"] = $scope.personaFirstName.substring(0, 1).toUpperCase() + $scope.personaLastName.substring(0, 1).toUpperCase();
                        cardData["score"] = 0;
                        cardData["id"] = $scope.personaId;
                        cardData["idtype"] = $scope.personaIdType;
                        cardData["country"] = $scope.personaCountry;
                        jsonObj.push(cardData);

                        $scope.cardDatas = jsonObj;
                        $scope.cardcount = $scope.cardDatas.length;
                        $scope.PersonaForm.$setPristine();
                        $scope.closePersonaPopup();
                    }
                };

                function noteGridDesc(params) {
                    var currentDate = params.data.createdDate;
                    var noteDesc = currentDate + " - By " + params.data.userID;
                    var noteId = "' " + params.data.noteID + "'";
                    return '<span><b> <a ng-click="showNotes($event,' + noteId + ')"> ' + params.data.title + '</a> </b>  <br / > ' + noteDesc + ' <br / > <p>' + params.data.text + '</p> </span>';
                }

                var notesGridColumnDefs = [
                    {
                        headerName: "",
                        width: 900 * globals.defaultVars.w / globals.defaultVars.winRef,
                        cellClass: 'rag-entity',
                        cellRenderer: function (params) {
                            return noteGridDesc(params);
                        }
                    }
                ];

                $scope.NotesGrid = {
                    columnDefs: notesGridColumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 0,
                    rowHeight: 120 * globals.defaultVars.w / globals.defaultVars.winRef,
                    enableFilter: false,
                    enableSorting: false,
                    angularCompileRows: true
                };

                /*--------Load TasksGrid-----------------*/

                var removeTaskFromArray = function (array, value) {
                    var index = array.indexOf(value);
                    if (index === -1)
                        array.push(value);
                    else {
                        if (array.length <= 0)
                            return array;
                        array.splice(index, 1);
                    }
                    return array;
                }

                $scope.TaskIDArray = [];

                $scope.CompletedTask = function () {
                    var selectedRowArray = $scope.TaskIDArray;
                    var taskGridArray = $scope.TasksGrid.rowData;
                    // var newArrayForTask = [];
                    for (var i = 0; i < taskGridArray.length; i++) {
                        var idVal = taskGridArray[i].taskID;
                        var index = selectedRowArray.indexOf(idVal);
                        if (index !== -1) {
                            taskGridArray[i].order = taskGridArray[i].completed === false ? 0 : taskGridArray[i].order;
                            taskGridArray[i].completed = !taskGridArray[i].completed;
                        }
                    }

                    $scope.TaskIDArray = [];
                    $scope.TasksGrid.rowData = taskGridArray;
                    $scope.TasksGrid.api.onNewRows();
                }


                $scope.DeleteTasks = function (selectedId) {
                    var array = $scope.TaskIDArray;
                    var outArray = removeTaskFromArray(array, selectedId);
                    $scope.TaskIDArray = outArray;
                }

                $scope.RemoveTask = function () {
                    var selectedRowArray = $scope.TaskIDArray;
                    var taskGridArray = $scope.TasksGrid.rowData;
                    var newArrayForTask = [];
                    for (var i = 0; i < taskGridArray.length; i++) {
                        var idVal = taskGridArray[i].taskID;
                        var index = selectedRowArray.indexOf(idVal);
                        if (index === -1)
                            newArrayForTask.push(taskGridArray[i]);
                    }

                    $scope.TaskIDArray = [];
                    $scope.TasksGrid.rowData = newArrayForTask;
                    $scope.TasksGrid.api.onNewRows();
                }

                /* Form Submit Method */
                $scope.AddTask = function (task) {
                    if (task == undefined || task === '')
                        return;
                    var currentDate = new Date().toLocaleDateString();
                    var newGuidId = guid();

                    var documentRecord = {
                        taskID: newGuidId,
                        task: task,
                        taskDate: currentDate,
                        order: 0,
                        completed: false
                    }
                    $scope.TasksGrid.rowData.push(documentRecord);
                    $scope.TasksGrid.api.onNewRows();

                    $scope.Task = '';
                    $scope.closePopup();
                };

                function tasksGrid(params) {
                    return '  <span class="taskRow"><b>' + params.data.task + '</b> </span>';
                }

                var tasksGridColumnDefs = [
                {
                    headerName: "taskID",
                    field: "taskID",
                    hide: true
                },
                { headerName: "order", field: "order", hide: true, sort: "desc" },
                {
                    headerName: "",
                    width: 800 * globals.defaultVars.w / globals.defaultVars.winRef,
                    cellClass: 'rag-entity',
                    cellClassRules: {
                        'rag-done': function (params) { return params.data.completed === true },
                        'rag-open': function (params) { return params.data.completed === false }
                    },
                    cellRenderer: function (params) {
                        return tasksGrid(params);
                    }
                },

                {
                    headerName: "",
                    width: 50 * globals.defaultVars.w / globals.defaultVars.winRef,
                    cellRenderer: function (params) { return doumentCheckBoxHandler(params, 'chkTasksGridID'); }
                }
                ];

                $scope.TasksGrid = {
                    columnDefs: tasksGridColumnDefs,
                    suppressHorizontalScroll: true,
                    headerHeight: 0,
                    rowHeight: 40 * globals.defaultVars.w / globals.defaultVars.winRef,
                    enableFilter: false,
                    enableSorting: false,
                    angularCompileRows: true,
                    groupHeaders: false
                };
                //*** ENDED */Document, Notes and Task Section

                function getAccountDetails(params) {

                    var result = "<span><b>" + params.data.accountType + "</b><br />Account Number - " + params.data.accountID + "</span>";
                    var assocdatas = params.data.accountBeneficiaries;
                    result += "</br><div style='background-color:#f9db22;height:20px;width;950px;'>";
                    for (var i = 0; i < assocdatas.length; i++) {
                        var split = assocdatas[i].split(" - ");
                        var shortname = split[0].split(" ");
                        result += "<b>" + split[0] + "(" + shortname[0].substring(0, 1) + shortname[1].substring(0, 1) + ")" + "</b>&nbsp;&nbsp;" + split[1] + "&nbsp;&nbsp;";
                    }
                    result += "</div>";
                    return result;
                }

                var columnDefs = [
                    {
                        headerName: "Account Details",
                        field: "",
                        width: 550,
                        cellRenderer: function(params) {
                            return getAccountDetails(params);
                        }
                    },
                    {
                        headerName: "Opening Date",
                        field: "accountOpenDate",
                        width: 200
                    },
                    {
                        headerName: "Relationship Manager",
                        field: "relationshipManager",
                        width: 200
                    }
                ];
                $scope.accountgridOptions = {
                    columnDefs: columnDefs,
                    rowData: null,
                    rowHeight: 70,
                    angularCompileRows: true

                };
                
                $scope.getInitials = function(name) {
                   var data = name.toUpperCase();
                   var spl = data.split(' ');
                   var finalVal = "";
                   for (var i = 0; i < spl.length; i++) {
                       if (i === 2) break;
                       finalVal += spl[i].substr(0, 1);
                   }
                   return finalVal;
               }

                function upperCaseNewValueHandler(params) {
                    var data = params.value.toUpperCase();
                    var spl = data.split(' ');
                    var finalVal = "";
                    for (var i = 0; i < spl.length; i++) {
                        if (i === 2) break;
                        finalVal += spl[i].substr(0, 1);
                    }
                    return '<span>'+finalVal+'</span>';
                }

                function shortNewValueHandler(title) {
                    var data = title.toUpperCase();
                    var spl = data.split(' ');
                    var finalVal = "";
                    for (var i = 0; i < spl.length; i++) {
                        if (i === 2) break;
                        finalVal += spl[i].substr(0, 1);
                    }
                    return finalVal;
                }

                function pageLoad() {
                    var data = $scope.caseDataObject;
                    $scope.caseDetailgridOptions = data;
        $scope.selectedCaseStatus = $scope.caseDetailgridOptions.caseStatus;
                    var relatedCasesAndAlertsDataArray = [];
                    var rowData;
                    angular.forEach(data, function (value, key) {
                        rowData = value;
                        if (key === 'relatedCases') {
                            angular.forEach(rowData, function (values) {
                                this.push({
                                    "id": values.id, "title": values.caseTitle,
                                    "item": "Cases", "accountType": values.accountType,
                                    "accountNumber": values.accountNumber, "openDate": values.caseOpenDate,
                                    "closedDate": values.caseClosedDate, "closedDeposition": values.caseClosedDeposition, "assignedAnalystName": values.assignedAnalystName,
                                    "riskScore": values.entity.riskDNA.entityRiskScore
                                });
                            }, relatedCasesAndAlertsDataArray);
                        } else if (key === 'relatedAlerts') {
                            angular.forEach(rowData, function (values) {
                                this.push({
                                    "id": values.id, "title": values.alertTitle,
                                    "item": "Alerts", "accountType": values.accountType,
                                    "accountNumber": values.accountNumber, "openDate": values.alertOpenDate,
                                    "closedDate": values.alertClosedDate, "closedDeposition": values.alertClosedDeposition, "assignedAnalystName": values.assignedAnalytstName,
                                    "riskScore": values.entity.riskDNA.entityRiskScore
                                });
                            }, relatedCasesAndAlertsDataArray);
                        }
                    });

                    $scope.relatedCasesAndAlertsOptions.rowData = relatedCasesAndAlertsDataArray;
                    $scope.relatedCasesAndAlertsOptions.api.onNewRows();

                    $scope.alertedTransactionsOptions.rowData = data.alertTransactions;
                    $scope.alertedTransactionsOptions.api.onNewRows();

                    var caseInititalData = {};
                    caseInititalData["shortname"] = shortNewValueHandler(data.caseTitle);
                    caseInititalData["score"] = data.entity.riskDNA.entityRiskScore;
                    caseInititalData["risktype"] = caseInititalData["score"] <= 33.33 ? 'LOW RISK'
                        : caseInititalData["score"] > 33.33 && caseInititalData["score"] <= 66.66
                        ? 'MEDIUM RISK' : 'HIGH RISK';

                    $scope.caseInititalDataS = caseInititalData;

                    //$scope.entityDetail = res.data.person;
                    $scope.TasksGrid.rowData = $scope.caseDataObject.caseTasks;
                    $scope.TasksGrid.api.onNewRows();

                    $scope.NotesGrid.rowData = $scope.caseDataObject.caseNotes;
                    $scope.NotesGrid.api.onNewRows();

                    $scope.DocumentCenterGrid.rowData = $scope.caseDataObject.caseDocuments;
                    $scope.DocumentCenterGrid.api.onNewRows();

                    $scope.accountgridOptions.rowData = $scope.caseDataObject.cdd;
                    $scope.accountgridOptions.api.onNewRows();
                }

                $scope.toggle = function (selVal) {
                    $scope.caseDetailgridOptions.caseClosedDeposition = selVal;

                }
                $scope.slideToggleCase = function(ev) {
                    var el = ev.currentTarget;
                    angular.element(el).parents('header').next('.caseToggleSection').slideToggle();
                    angular.element(el).toggleClass('open');
                }
                $scope.ExportToExcel = function () {

                    alasql('SELECT transactionDate	AS [Transaction Date], transactionType AS [Transaction Type],	currency AS Currency,	amount AS Amount,	' +
                        'branch AS Branch,	checkNumber AS [Check Number],	checkDescription AS [Check Description],	additionalInfo AS [Additional Info],	' +
                        'accountHolderName AS [Account HolderName],	accountHolderAccNumber AS [Account Holder Account Number],	holderTransferType AS [Holder Transfer Type],	' +
                        'beneficiaryName AS [Beneficiary Name],	beneficiaryAccNumber AS [Beneficiary Account Number],	beneficiaryTransferType AS [BeneficiaryTransferType],	' +
                        'transactionDescription AS [Transaction Description] INTO XLSX("report.xlsx",{headers:true}) FROM ?', [$scope.alertedTransactionsOptions.rowData]);
                };
                
                function loadData(param) {
                    if (param !== "postback") {
                        $http.get("../../../sampleJson/caseObject.json")
                            .then(function (res) {
                                $scope.caseDataObject = res.data;
                                pageLoad();

                            });
                    } else {
                        pageLoad();
                    }
                }

                loadData("");
            }
        ]);
})();
