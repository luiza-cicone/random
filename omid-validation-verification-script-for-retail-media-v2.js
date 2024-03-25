!function(){"use strict";const TWO_SECONDS_50_PERCENT_VIEW="twoSecondsFiftyPercentView",TRACKED_VIEW="omidTrackView",EventNames=["impression","loaded","geometryChange","sessionStart","video","start","sessionError","sessionFinish","media","firstQuartile","midpoint","thirdQuartile","complete","pause","resume","bufferStart","bufferFinish","skipped","volumeChange","playerStateChange","adUserInteraction","stateChange"];function getOmidGlobal(){if(void 0!==omidGlobal&&omidGlobal)return omidGlobal;if("undefined"!=typeof global&&global)return global;if("undefined"!=typeof window&&window)return window;if("undefined"!=typeof globalThis&&globalThis)return globalThis;var e=Function("return this")();if(e)return e;throw new Error("Could not determine global object context.")}var omidGlobal=getOmidGlobal();class RetailMediaEventSender{constructor(e){this.verificationClient=e,this.isInitialized_=!1}initialize(e,t){if(t){var i=JSON.parse(t);if("beacons"in i){for(var s in this.eventBeacons_=new Map,i.beacons)this.eventBeacons_.set(s,i.beacons[s]);this.isInitialized_=!0,this.sendEvent(TRACKED_VIEW,e)}}}sendEvent(e,t){this.isInitialized_?this.eventBeacons_.has(e)&&(e=this.eventBeacons_.get(e))&&this.sendBeaconToBbt(e):console.error("OMID event sender is not initialized properly. Discarding event.")}xhr(e){const t=new XMLHttpRequest;t.open("POST",e,!0),t.setRequestHeader("Content-Type","text/plain;charset=UTF-8"),t.send()}sendBeacon(e){return navigator&&navigator.sendBeacon&&navigator.sendBeacon(e)}sendBeaconToBbt(t){try{this.verificationClient.sendUrl(t),this.sendUrlWithImg_(t,()=>{throw new Error("Worked!")},e=>{throw e})}catch(e){this.verificationClient.sendUrl(t+("&error="+encodeURIComponent(e.toString())))}}sendUrlWithImg_(e,t,i){const s=omidGlobal.frames.document.createElement("img");s.width=1,s.height=1,s.style.display="none",s.src=e,t&&s.addEventListener("load",function(){return t()}),i&&s.addEventListener("error",function(){return i()}),omidGlobal.frames.document.body.appendChild(s)}}class Communication{constructor(e=void 0){this.to=e,this.onMessage,this.communicationType_="NONE"}sendMessage(e,t){}handleMessage(e,t){this.onMessage&&this.onMessage(e,t)}serialize(e){return JSON.stringify(e)}deserialize(e){return JSON.parse(e)}isDirectCommunication(){return"DIRECT"===this.communicationType_}isCrossOrigin(){}}class InternalMessage{constructor(e,t,i,s){this.guid=e,this.method=t,this.version=i,this.args=s}static isValidSerializedMessage(e){return!!e&&"string"==typeof e.omid_message_guid&&"string"==typeof e.omid_message_method&&"string"==typeof e.omid_message_version}static deserialize(e){return new InternalMessage(e.omid_message_guid,e.omid_message_method,e.omid_message_version,e.omid_message_args)}serialize(){const e={omid_message_guid:this.guid,omid_message_method:this.method,omid_message_version:this.version};return void 0!==this.args&&(e.omid_message_args=this.args),e}}function error(...e){executeLog(()=>{throw new Error("Could not complete the test successfully - ")},()=>console.error(...e))}function executeLog(e,t){jasmine&&"undefined"!=typeof jasmine?e():"undefined"!=typeof console&&console&&t()}const Version="1.3.36-dev";function assertTruthyString(e,t){if(!t)throw new Error(`Value for ${e} is undefined, null or blank.`);if("string"!=typeof t&&!(t instanceof String))throw new Error(`Value for ${e} is not a string.`);if(""===t.trim())throw new Error(`Value for ${e} is empty string.`)}function assertNumber(e,t){if(null==t)throw new Error(e+" must not be null or undefined.");if("number"!=typeof t||isNaN(t))throw new Error(`Value for ${e} is not a number`)}function assertFunction(e,t){if(!t)throw new Error(e+" must be truthy.")}function assertPositiveNumber(e,t){if(assertNumber(e,t),t<0)throw new Error(e+" must be a positive number.")}const SEMVER_DIGITS_NUMBER=3;function isValidVersion(e){return/\d+\.\d+\.\d+(-.*)?/.test(e)}function versionGreaterOrEqual(e,t){var i=e.split("-")[0].split("."),s=t.split("-")[0].split(".");for(let e=0;e<SEMVER_DIGITS_NUMBER;e++){var n=parseInt(i[e],10),r=parseInt(s[e],10);if(r<n)return 1;if(n<r)return}return 1}const ARGS_NOT_SERIALIZED_VERSION="1.0.3";function serializeMessageArgs(e,t){return isValidVersion(e)&&versionGreaterOrEqual(e,ARGS_NOT_SERIALIZED_VERSION)?t:JSON.stringify(t)}function deserializeMessageArgs(e,t){return isValidVersion(e)&&versionGreaterOrEqual(e,ARGS_NOT_SERIALIZED_VERSION)?null!=(e=t)?e:[]:t&&"string"==typeof t?JSON.parse(t):[]}function generateGuid(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,t=>{{t="y"===t;let e=16*Math.random()|0;return(t?3&e|8:e).toString(16)}})}function getPrefixedVerificationServiceMethod(e){return getPrefixedMethod(e,"VerificationService.")}function getPrefixedMethod(e,t){return t+e}function isValidWindow(e){return e&&e.top}function isCrossOrigin(e){if(e!==omidGlobal)try{if(void 0===e.location.hostname)return!0;if(isSameOriginForIE(e));}catch(e){return!0}return!1}function isSameOriginForIE(e){return""===e.x||""!==e.x}function resolveGlobalContext(e){return isValidWindow(e=void 0===e&&"undefined"!=typeof window&&window?window:e)?e:omidGlobal}function resolveTopWindowContext(e){return isValidWindow(e)?e.top:omidGlobal}function isTopWindowAccessible(e){var t;try{return!(null==(t=null==e?void 0:e.top)||!t.location.href)}catch(e){return!1}}class DirectCommunication extends Communication{constructor(e){super(e),this.communicationType_="DIRECT",this.handleExportedMessage=DirectCommunication.prototype.handleExportedMessage.bind(this)}sendMessage(e,t=this.to){if(!t)throw new Error("Message destination must be defined at construction time or when sending the message.");t.handleExportedMessage(e.serialize(),this)}handleExportedMessage(e,t){InternalMessage.isValidSerializedMessage(e)&&this.handleMessage(InternalMessage.deserialize(e),t)}isCrossOrigin(){return!1}}class PostMessageCommunication extends Communication{static isCompatibleContext(e){return Boolean(e&&e.postMessage)}constructor(e,t){super(t),this.communicationType_="POST_MESSAGE",e.addEventListener("message",e=>{var t;"object"==typeof e.data&&(t=e.data,InternalMessage.isValidSerializedMessage(t)&&(t=InternalMessage.deserialize(t),e.source&&this.handleMessage(t,e.source)))})}sendMessage(e,t=this.to){if(!t)throw new Error("Message destination must be defined at construction time or when sending the message.");t.postMessage(e.serialize(),"*")}isCrossOrigin(){return!this.to||isCrossOrigin(this.to)}}const OMID_PRESENT_FRAME_NAME="omid_v1_present";function isOmidPresent(e){try{return null!=e&&e.frames?!!e.frames[OMID_PRESENT_FRAME_NAME]:!1}catch(e){return!1}}const EXPORTED_VERIFICATION_COMMUNICATION_NAME=["omid","v1_VerificationServiceCommunication"],EXPORTED_SERVICE_WINDOW_NAME=["omidVerificationProperties","serviceWindow"];function getValueForKeypath(e,t){return t.reduce((e,t)=>e&&e[t],e)}function startServiceCommunication(e,t,i,s){if(!isCrossOrigin(t))try{var n=getValueForKeypath(t,i);if(n)return new DirectCommunication(n)}catch(e){}return s(t)?new PostMessageCommunication(e,t):null}function startServiceCommunicationFromCandidates(e,t,i,s){for(const r of t){var n=startServiceCommunication(e,r,i,s);if(n)return n}return null}function startVerificationServiceCommunication(e,t=isOmidPresent){const i=[];var s=getValueForKeypath(e,EXPORTED_SERVICE_WINDOW_NAME);return s&&i.push(s),i.push(resolveTopWindowContext(e)),startServiceCommunicationFromCandidates(e,i,EXPORTED_VERIFICATION_COMMUNICATION_NAME,t)}const VERIFICATION_CLIENT_VERSION=Version;function getThirdPartyOmid(){var e=omidGlobal.omid3p;return e&&"function"==typeof e.registerSessionObserver&&"function"==typeof e.addEventListener?e:null}class VerificationClient{constructor(e){var e=e||startVerificationServiceCommunication(resolveGlobalContext()),e=(e&&(this.communication=e),this.communication?this.communication.onMessage=this.handleMessage_.bind(this):(e=getThirdPartyOmid())&&(this.omid3p=e),this.remoteTimeouts_=0,this.remoteIntervals_=0,this.callbackMap_={},this.imgCache_=[],omidGlobal.omidVerificationProperties);this.injectionId_=e?e.injectionId:void 0}isSupported(){return Boolean(this.communication||this.omid3p)}injectionSource(){var e=omidGlobal.omidVerificationProperties;if(e&&e.injectionSource)return e.injectionSource}registerSessionObserver(e,t){assertFunction("functionToExecute",e),this.omid3p?this.omid3p.registerSessionObserver(e,t,this.injectionId_):this.sendMessage_("addSessionListener",e,t,this.injectionId_)}addEventListener(e,t){assertTruthyString("eventType",e),assertFunction("functionToExecute",t),this.omid3p?this.omid3p.addEventListener(e,t):this.sendMessage_("addEventListener",t,e)}sendUrl(e,t=void 0,i=void 0){assertTruthyString("url",e),omidGlobal.document?this.sendUrlWithImg_(e,t,i):this.sendMessage_("sendUrl",e=>{e&&t?t():!e&&i&&i()},e)}sendUrlWithImg_(e,t,i){const s=omidGlobal.document.createElement("img");this.imgCache_.push(s);var n=e=>{this.imgCache_.indexOf(s),this.imgCache_.splice(0,1),e&&e()};s.addEventListener("load",n.bind(this,t)),s.addEventListener("error",n.bind(this,i)),s.src=e}injectJavaScriptResource(i,s,n){assertTruthyString("url",i),omidGlobal.document?this.injectJavascriptResourceUrlInDom_(i,s,n):this.sendMessage_("injectJavaScriptResource",(e,t)=>{e?(this.evaluateJavaScript_(t,i),s()):(error("Service failed to load JavaScript resource."),n())},i)}injectJavascriptResourceUrlInDom_(e,t,i){const s=omidGlobal.document,n=s.body,r=s.createElement("script");r.onload=()=>t(),r.onerror=()=>i(),r.src=e,r.type="application/javascript",n.appendChild(r)}evaluateJavaScript_(javaScript,url){try{eval(javaScript)}catch(error){error(`Error evaluating the JavaScript resource from "${url}".`)}}setTimeout(e,t){if(assertFunction("functionToExecute",e),assertPositiveNumber("timeInMillis",t),this.hasTimeoutMethods_())return omidGlobal.setTimeout(e,t);var i=this.remoteTimeouts_++;return this.sendMessage_("setTimeout",e,i,t),i}clearTimeout(e){assertPositiveNumber("timeoutId",e),this.hasTimeoutMethods_()?omidGlobal.clearTimeout(e):this.sendOneWayMessage_("clearTimeout",e)}setInterval(e,t){if(assertFunction("functionToExecute",e),assertPositiveNumber("timeInMillis",t),this.hasIntervalMethods_())return omidGlobal.setInterval(e,t);var i=this.remoteIntervals_++;return this.sendMessage_("setInterval",e,i,t),i}clearInterval(e){assertPositiveNumber("intervalId",e),this.hasIntervalMethods_()?omidGlobal.clearInterval(e):this.sendOneWayMessage_("clearInterval",e)}hasTimeoutMethods_(){return"function"==typeof omidGlobal.setTimeout&&"function"==typeof omidGlobal.clearTimeout}hasIntervalMethods_(){return"function"==typeof omidGlobal.setInterval&&"function"==typeof omidGlobal.clearInterval}handleMessage_(e){var t,{method:e,guid:i,args:s}=e;"response"===e&&this.callbackMap_[i]&&(t=deserializeMessageArgs(VERIFICATION_CLIENT_VERSION,null!=s?s:void 0),this.callbackMap_[i].apply(this,t)),"error"===e&&window.console&&error(s)}sendOneWayMessage_(e,...t){this.sendMessage_(e,...t)}sendMessage_(e,t,...i){var s;this.communication&&(s=generateGuid(),t&&(this.callbackMap_[s]=t),t=new InternalMessage(s,getPrefixedVerificationServiceMethod(e),VERIFICATION_CLIENT_VERSION,serializeMessageArgs(VERIFICATION_CLIENT_VERSION,i)),this.communication.sendMessage(t))}}class TwoSeconds50PercentViewability{constructor(e){this.eventSender_=e,this.eventCompleted_=!1,this.isPlaying_=!1}callback(e){if(!this.eventCompleted_){switch(e.type){case"impression":case"geometryChange":this.isViewable_=!!(e.data.adView&&50<=e.data.adView.percentageInView);break;case"start":case"resume":this.isPlaying_=!0;break;case"pause":case"sessionFinish":case"complete":this.isPlaying_=!1;break;default:return}this.isPlaying_&&this.isViewable_?(this.startViewability(),this.eventTimeStamp_=e.timestamp+2e3):this.stopViewability()}}stopViewability(){this.timeoutId&&(window.clearTimeout(this.timeoutId),this.timeoutId=void 0)}startViewability(){this.timeoutId||(this.timeoutId=window.setTimeout(this.sendEvent.bind(this),2e3))}sendEvent(){this.eventSender_.sendEvent(TWO_SECONDS_50_PERCENT_VIEW,this.eventTimeStamp_),this.eventCompleted_=!0,this.stopViewability()}}class Quartiles100PercentViewability{constructor(e){this.eventSender_=e,this.isViewable_=!1}callback(e){switch(e.type){case"impression":case"geometryChange":this.isViewable_=!!e.data.adView&&100==e.data.adView.percentageInView;break;case"start":case"firstQuartile":case"midpoint":case"thirdQuartile":case"complete":this.isViewable_&&this.eventSender_.sendEvent(e.type,e.timestamp);break;default:return}}}class Trackers{constructor(e){this.eventsCallbacks=[],this.twoSeconds50PercentViewabilityInstance=new TwoSeconds50PercentViewability(e),this.quartiles100PercentViewabilityInstance=new Quartiles100PercentViewability(e),this.eventsCallbacks.push(e=>this.twoSeconds50PercentViewabilityInstance.callback(e)),this.eventsCallbacks.push(e=>this.quartiles100PercentViewabilityInstance.callback(e))}callback(t){this.eventsCallbacks.forEach(e=>e(t))}}class ValidationVerificationClient{constructor(e,t,i){this.verificationClient_=e,this.eventSender_=t;e=this.verificationClient_.isSupported();this.logMessage_("OmidSupported["+e+"]",(new Date).getTime()),e&&(this.verificationClient_.registerSessionObserver(e=>this.sessionObserverCallback_(e),i),EventNames.filter(e=>"media"!==e&&"video"!==e).forEach(e=>this.verificationClient_.addEventListener(e,e=>this.omidEventListenerCallback_(e))))}logMessage_(e,t){"string"!=typeof e&&e.hasOwnProperty("type")&&"sessionStart"==e.type&&(e.data.context.friendlyToTop=isTopWindowAccessible(resolveGlobalContext()),this.resolveCriteoValidationVerificationScript(t,e.data.verificationParameters))}omidEventListenerCallback_(e){var t;this.logMessage_(e,e.timestamp),null!=(t=this.criteoTrackers_)&&t.callback(e)}sessionObserverCallback_(e){this.logMessage_(e,e.timestamp)}resolveCriteoValidationVerificationScript(e,t){this.eventSender_.initialize(e,t),this.criteoTrackers_=new Trackers(this.eventSender_)}}const v=new VerificationClient;new ValidationVerificationClient(v,new RetailMediaEventSender(v),"iabtechlab.com-omid")}();
