/*global define, Handlebars*/
define(['jquery', 'realtimePages', 'helpers', 'dataTables', 'handlebars', 'extend-moment',
    'libs/jquery.form', 'text!templates/builderdetail.handlebars', 'timeElements', 'rtGenericTable', 'popup'],
    function ($, realtimePages, helpers, dt, hb, extendMoment, form, builderdetail, timeElements, rtTable, popup) {
        
        var rtBuilderDetail,
            $tbCurrentBuildsTable,
            $tbPendingBuildsTable,
            $tbBuildsTable,
            $tbSlavesTable,
            builderdetailHandle = Handlebars.compile(builderdetail);

        rtBuilderDetail = {
            init: function () {
                $tbCurrentBuildsTable = rtBuilderDetail.currentBuildsTableInit($('#rtCurrentBuildsTable'));
                $tbPendingBuildsTable = rtBuilderDetail.pendingBuildsTableInit($('#rtPendingBuildsTable'));
                $tbBuildsTable = rtTable.table.buildTableInit($('#rtBuildsTable'), false, helpers.urlHasCodebases());
                $tbSlavesTable = rtBuilderDetail.slavesTableInit($('#rtSlavesTable'));

                var realtimeFunctions = realtimePages.defaultRealtimeFunctions();
                realtimeFunctions.project = rtBuilderDetail.rtfProcessCurrentBuilds;
                realtimeFunctions.pending_builds = rtBuilderDetail.rtfProcessPendingBuilds;
                realtimeFunctions.builds = rtBuilderDetail.rtfProcessBuilds;
                realtimeFunctions.slaves = rtBuilderDetail.rtfProcessSlaves;

                realtimePages.initRealtime(realtimeFunctions);

                helpers.selectBuildsAction($tbPendingBuildsTable,'','/buildqueue/_selected/cancelselected', 'cancelselected=');

                //Setup run build
                popup.initRunBuild($(".custom-build"));

                // insert codebase and branch
                if (window.location.search !== '') {
                    // Parse the url and insert current codebases and branches
                    helpers.codeBaseBranchOverview($('#brancOverViewCont'));
                }
            },
            rtfProcessCurrentBuilds: function (data) {
                timeElements.clearTimeObjects($tbCurrentBuildsTable);
                $tbCurrentBuildsTable.fnClearTable();

                try {
                    if (data.currentBuilds !== undefined) {
                        $tbCurrentBuildsTable.fnAddData(data.currentBuilds);
                        timeElements.updateTimeObjects();
                    }

                    timeElements.updateTimeObjects();
                } catch (err) {
                }
            },
            rtfProcessPendingBuilds: function (data) {
                rtTable.table.rtfGenericTableProcess($tbPendingBuildsTable, data);
            },
            rtfProcessSlaves: function (data) {
                data = helpers.objectPropertiesToArray(data);
                rtTable.table.rtfGenericTableProcess($tbSlavesTable, data);
            },
            rtfProcessBuilds: function (data) {
                rtTable.table.rtfGenericTableProcess($tbBuildsTable, data);
            },
            currentBuildsTableInit: function ($tableElem) {
                var options = {};

                options.oLanguage = {
                    "sEmptyTable": "No current builds"
                };

                options.aoColumns = [
                    { "mData": null, "sTitle": "#", "sWidth": "10%"  },
                    { "mData": null, "sTitle": "Current build", "sWidth": "30%" },
                    { "mData": null, "sTitle": "Revision", "sWidth": "35%" },
                    { "mData": null, "sTitle": "Author", "sWidth": "25%", "sClass": "txt-align-right"}
                ];

                options.aoColumnDefs = [
                    rtTable.cell.buildID(0),
                    rtTable.cell.buildProgress(1, true),
                    rtTable.cell.revision(2, "sourceStamps", helpers.urlHasCodebases()),
                    {
                        "aTargets": [ 3 ],
                        "sClass": "txt-align-left",
                        "mRender": function (data, type, full) {
                            var author = 'N/A';
                            if (full.properties !== undefined) {
                                $.each(full.properties, function (i, prop) {
                                    if (prop[0] === "owner") {
                                        author = prop[1];
                                    }
                                });
                            }
                            return author;
                        }
                    }
                ];

                return dt.initTable($tableElem, options);
            },
            pendingBuildsTableInit: function ($tableElem) {
                var options = {};

                options.oLanguage = {
                    "sEmptyTable": "No pending builds"
                };

                options.aoColumns = [
                    { "mData": null, "sWidth": "30%" },
                    { "mData": null, "sWidth": "30%" },
                    { "mData": null, "sWidth": "35%" },
                    { "mData": null, "sWidth": "5%" }
                ];

                options.aoColumnDefs = [
                    {
                        "aTargets": [ 0 ],
                        "sClass": "txt-align-left",
                        "mRender": function (data, type, full) {
                            return extendMoment.getDateFormatted(full.submittedAt);
                        }
                    },
                    {
                        "aTargets": [ 1 ],
                        "sClass": "txt-align-left",
                        "mRender": function () {
                            return builderdetailHandle({pendingBuildWait: true});
                        },
                        "fnCreatedCell": function (nTd, sData, oData) {
                            timeElements.addElapsedElem($(nTd).find('.waiting-time-js'), oData.submittedAt);
                        }
                    },
                    rtTable.cell.revision(2, "sources", helpers.urlHasCodebases()),
                    {
                        "aTargets": [ 3 ],
                        "sClass": "txt-align-right",
                        "mRender": function (data, type, full) {
                            return builderdetailHandle({removeBuildSelector: true, data: full});
                        }
                    }
                ];

                return dt.initTable($tableElem, options);
            },
            slavesTableInit: function ($tableElem) {
                var options = {};

                options.oLanguage = {
                    "sEmptyTable": "No slaves attached"
                };

                options.aoColumns = [
                    { "mData": null, "sWidth": "50%" },
                    { "mData": null, "sWidth": "50%" }
                ];

                options.aoColumnDefs = [
                    rtTable.cell.slaveName(0, "friendly_name", "url"),
                    rtTable.cell.slaveStatus(1)
                ];

                return dt.initTable($tableElem, options);
            }
        };

        return rtBuilderDetail;
    });