define(["jquery","realtimePages","helpers","dataTables","mustache","libs/jquery.form","text!templates/builders.mustache"],function(e,t,n,r,i,s,o){var u,a=undefined;return u={init:function(){a=u.dataTableInit(e(".builders-table"));var r=t.defaultRealtimeFunctions();r.builders=u.realtimeFunctionsProcessBuilders,t.initRealtime(r);var i=e(".dataTables_wrapper .top");window.location.search!=""&&n.codeBaseBranchOverview(i)},realtimeFunctionsProcessBuilders:function(e){a.fnClearTable();try{a.fnAddData(e.builders)}catch(t){}},dataTableInit:function(t){var s={};return s.aoColumns=[{mData:null},{mData:null},{mData:null},{mData:null},{mData:null,bSortable:!1}],s.aoColumnDefs=[{aTargets:[0],sClass:"txt-align-left",mRender:function(t,r,s){var u=n.codebasesFromURL({}),a=[];e.each(u,function(e,t){a.push(encodeURIComponent(t)+"="+encodeURIComponent(u[t]))});var f=a.join("&");return i.render(o,{name:s.name,friendly_name:s.friendly_name,url:s.url,builderParam:f})}},{aTargets:[1],sClass:"txt-align-left",mRender:function(e,t,n){var r=!1;return(n.pendingBuilds===undefined||n.pendingBuilds==0)&&(n.currentBuilds===undefined||n.currentBuilds==0)&&(r=!0),i.render(o,{showNoJobs:r,pendingBuilds:n.pendingBuilds,currentBuilds:n.currentBuilds,builderName:n.name,projects:n.project})},fnCreatedCell:function(t,r,i){i.currentBuilds!=undefined&&n.delegateToProgressBar(e(t).find(".percent-outer-js"))}},{aTargets:[2],sClass:"txt-align-left last-build-js",mRender:function(e,t,n){return i.render(o,{showLatestBuild:!0,latestBuild:n.latestBuild})},fnCreatedCell:function(t,r,i){if(i.latestBuild!=undefined){n.startCounterTimeago(e(t).find(".last-run"),i.latestBuild.times[1]);var s=n.getTime(i.latestBuild.times[0],i.latestBuild.times[1]).trim();e(t).find(".small-txt").html("("+s+")"),e(t).find(".hidden-date-js").html(i.latestBuild.times[1])}}},{aTargets:[3],mRender:function(e,t,n){return i.render(o,{showStatus:!0,latestBuild:n.latestBuild})},fnCreatedCell:function(t,n,r){var i=r.latestBuild===undefined?"":r.latestBuild;e(t).removeClass().addClass(i.results_text)}},{aTargets:[4],mRender:function(e,t,n){var r=location.protocol+"//"+location.host;return i.render(o,{customBuild:!0,builderUrlShow:r,project:n.project,builderName:n.name})}}],r.initTable(t,s)}},u});