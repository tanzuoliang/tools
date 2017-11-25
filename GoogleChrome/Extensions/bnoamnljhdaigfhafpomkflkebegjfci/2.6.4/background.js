function onStartupThunder(info, tab)
{
        //InvokeThunder(info.linkUrl,info.pageUrl);
        //var port = chrome.extension.connect({name: "CMD_DOWNLOAD_BY_THUNDER"});
        var port = chrome.tabs.connect(tab.id);
        port.postMessage({url:info.linkUrl,referUrl:info.pageUrl});
}
var title = chrome.i18n.getMessage("context_title");
chrome.contextMenus.create({type: "normal",title: title,contexts:["link"],onclick:onStartupThunder});

var g_thunderPluginId = "xunlei_com_thunder_helper_plugin_d462f475-c18e-46be-bd10-327458d045bd";
var plugin = document.getElementById(g_thunderPluginId);
var g_isBrowserDetectEnabled = plugin.IsBrowserDetectEnabled();
var downloadsActiveSites = ['baidu.com'];
function checkIfDownloadsActive(url){
        var len = downloadsActiveSites.length;
        for(var i=0;i<len;i++){
                if(url.indexOf(downloadsActiveSites[i]) !== -1){
                        return true;
                }
        }
        return false;
}
if(g_isBrowserDetectEnabled && chrome.downloads){
        var filenames = {};
        chrome.downloads.onDeterminingFilename.addListener(function(item, suggest){
                if(item.filename.length && !filenames.hasOwnProperty(item.id)){
                        filenames[item.id] = item.filename;
                }
                /*todo: Error in response handler for downloadsInternal.determineFilename: Invalid downloadId*/
                suggest();
                return true;
        });
        chrome.downloads.onCreated.addListener(function(item){
                if(checkIfDownloadsActive(item.referrer)){
                
                        if(item.state == 'complete' || item.state == 'interrupted'){
                                // 此api的一个坑，首次安装会将下载列表已下载过的东西全部下一遍
                                return;
                        }
                        // 取消chrome默认下载
                        chrome.downloads.cancel(item.id);

                        // 删除下载记录，有时默认下载会先执行，因为异步，防止出现默认下载框
                        chrome.downloads.erase({id:item.id}, function (ids){});

                        // 关闭chrome新建下载留存的tab
                        chrome.tabs.query({url:item.url}, function(tabArray){
                                if (tabArray[0]){
                                        chrome.tabs.remove(tabArray[0].id);
                                }
                        });
                        // 获取引用页的cookie
                        chrome.tabs.query({url: item.referrer}, function(tabArray){
                                if(tabArray[0]){
                                        chrome.tabs.sendMessage(tabArray[0].id, {name: 'getCookie'}, function(response){
                                                var realCookie = '';
                                                if(response && response.cookie){
                                                        realCookie = response.cookie;
                                                }
                                                if(filenames.hasOwnProperty(item.id)){
                                                        plugin.Download(item.url, item.referrer, realCookie, filenames[item.id]);
                                                }else{
                                                        plugin.Download(item.url, item.referrer, realCookie);
                                                }
                                        });
                                }else{
                                        if(filenames.hasOwnProperty(item.id)){
                                                plugin.Download(item.url, item.referrer, '', filenames[item.id]);
                                        }else{
                                                plugin.Download(item.url, item.referrer, '');
                                        }
                                }
                        });
                }
        });
}
