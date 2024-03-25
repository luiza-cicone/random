!function(){"use strict";const TWO_SECONDS_50_PERCENT_VIEW="twoSecondsFiftyPercentView",TRACKED_VIEW="omidTrackView",EventNames=["impression","loaded","geometryChange","sessionStart","video","start","sessionError","sessionFinish","media","firstQuartile","midpoint","thirdQuartile","complete","pause","resume","bufferStart","bufferFinish","skipped","volumeChange","playerStateChange","adUserInteraction","stateChange"];function getOmidGlobal(){if(void 0!==omidGlobal&&omidGlobal)return omidGlobal;if("undefined"!=typeof global&&global)return global;if("undefined"!=typeof window&&window)return window;if("undefined"!=typeof globalThis&&globalThis)return globalThis;var e=Function("return this")();if(e)return e;throw new Error("Could not determine global object context.")}var omidGlobal=getOmidGlobal();class RetailMediaEventSender{constructor(e){this.verificationClient=e,this.isInitialized_=!1}initialize(e,i){if(i){var t=JSON.parse(i);if("beacons"in t){for(var s in this.eventBeacons_=new Map,t.beacons)this.eventBeacons_.set(s,t.beacons[s]);this.isInitialized_=!0,this.sendEvent(TRACKED_VIEW,e)}}}sendEvent(e,i){this.isInitialized_?this.eventBeacons_.has(e)&&(e=this.eventBeacons_.get(e))&&this.sendBeaconToBbt(e):console.error("OMID event sender is not initialized properly. Discarding event.")}xhr(e){const i=new XMLHttpRequest;i.open("POST",e,!0),i.setRequestHeader("Content-Type","text/plain;charset=UTF-8"),i.send()}sendBeacon(e){return navigator&&navigator.sendBeacon&&navigator.sendBeacon(e)}sendBeaconToBbt(i){try{this.verificationClient.sendUrl(i);var e=omidGlobal.window.omidNative;throw new Error("A - "+e)}catch(e){this.verificationClient.sendUrl(i+("&error="+encodeURIComponent(e.toString())))}}sendUrlWithImg_(e,i,t){const s=omidGlobal.parent.window.document.createElement("img");s.width=1,s.height=1,s.style.display="none",s.src=e+"&source=image",i&&s.addEventListener("load",function(){return i()}),t&&s.addEventListener("error",function(){return t()}),omidGlobal.frames.document.body.appendChild(s)}}class Communication{constructor(e=void 0){this.to=e,this.onMessage,this.communicationType_="NONE"}sendMessage(e,i){}handleMessage(e,i){this.onMessage&&this.onMessage(e,i)}serialize(e){return JSON.stringify(e)}deserialize(e){return JSON.parse(e)}isDirectCommunication(){return"DIRECT"===this.communicationType_}isCrossOrigin(){}}class InternalMessage{constructor(e,i,t,s){this.guid=e,this.method=i,this.version=t,this.args=s}static isValidSerializedMessage(e){return!!e&&"string"==typeof e.omid_message_guid&&"string"==typeof e.omid_message_method&&"string"==typeof e.omid_message_version}static deserialize(e){return new InternalMessage(e.omid_message_guid,e.omid_message_method,e.omid_message_version,e.omid_message_args)}serialize(){const e={omid_message_guid:this.guid,omid_message_method:this.method,omid_message_version:this.version};return void 0!==this.args&&(e.omid_message_args=this.args),e}}function error(...e){executeLog(()=>{throw new Error("Could not complete the test successfully - ")},()=>console.error(...e))}function executeLog(e,i){jasmine&&"undefined"!=typeof jasmine?e():"undefined"!=typeof console&&console&&i()}const Version="1.3.36-dev";function assertTruthyString(e,i){if(!i)throw new Error(`Value for ${e} is undefined, null or blank.`);if("string"!=typeof i&&!(i instanceof String))throw new Error(`Value for ${e} is not a string.`);if(""===i.trim())throw new Error(`Value for ${e} is empty string.`)}function assertNumber(e,i){if(null==i)throw new Error(e+" must not be null or undefined.");if("number"!=typeof i||isNaN(i))throw new Error(`Value for ${e} is not a number`)}function assertFunction(e,i){if(!i)throw new Error(e+" must be truthy.")}function assertPositiveNumber(e,i){if(assertNumber(e,i),i<0)throw new Error(e+" must be a positive number.")}const SEMVER_DIGITS_NUMBER=3;function isValidVersion(e){return/\d+\.\d+\.\d+(-.*)?/.test(e)}function versionGreaterOrEqual(e,i){var t=e.split("-")[0].split("."),s=i.split("-")[0].split(".");for(let e=0;e<SEMVER_DIGITS_NUMBER;e++){var n=parseInt(t[e],10),r=parseInt(s[e],10);if(r<n)return 1;if(n<r)return}return 1}const ARGS_NOT_SERIALIZED_VERSION="1.0.3";function serializeMessageArgs(e,i){return isValidVersion(e)&&versionGreaterOrEqual(e,ARGS_NOT_SERIALIZED_VERSION)?i:JSON.stringify(i)}function deserializeMessageArgs(e,i){return isValidVersion(e)&&versionGreaterOrEqual(e,ARGS_NOT_SERIALIZED_VERSION)?null!=(e=i)?e:[]:i&&"string"==typeof i?JSON.parse(i):[]}function generateGuid(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,i=>{{i="y"===i;let e=16*Math.random()|0;return(i?3&e|8:e).toString(16)}})}function getPrefixedVerificationServiceMethod(e){return getPrefixedMethod(e,"VerificationService.")}function getPrefixedMethod(e,i){return i+e}function isValidWindow(e){return e&&e.top}function isCrossOrigin(e){if(e!==omidGlobal)try{if(void 0===e.location.hostname)return!0;if(isSameOriginForIE(e));}catch(e){return!0}return!1}function isSameOriginForIE(e){return""===e.x||""!==e.x}function resolveGlobalContext(e){return isValidWindow(e=void 0===e&&"undefined"!=typeof window&&window?window:e)?e:omidGlobal}function resolveTopWindowContext(e){return isValidWindow(e)?e.top:omidGlobal}function isTopWindowAccessible(e){var i;try{return!(null==(i=null==e?void 0:e.top)||!i.location.href)}catch(e){return!1}}class DirectCommunication extends Communication{constructor(e){super(e),this.communicationType_="DIRECT",this.handleExportedMessage=DirectCommunication.prototype.handleExportedMessage.bind(this)}sendMessage(e,i=this.to){if(!i)throw new Error("Message destination must be defined at construction time or when sending the message.");i.handleExportedMessage(e.serialize(),this)}handleExportedMessage(e,i){InternalMessage.isValidSerializedMessage(e)&&this.handleMessage(InternalMessage.deserialize(e),i)}isCrossOrigin(){return!1}}class PostMessageCommunication extends Communication{static isCompatibleContext(e){return Boolean(e&&e.postMessage)}constructor(e,i){super(i),this.communicationType_="POST_MESSAGE",e.addEventListener("message",e=>{var i;"object"==typeof e.data&&(i=e.data,InternalMessage.isValidSerializedMessage(i)&&(i=InternalMessage.deserialize(i),e.source&&this.handleMessage(i,e.source)))})}sendMessage(e,i=this.to){if(!i)throw new Error("Message destination must be defined at construction time or when sending the message.");i.postMessage(e.serialize(),"*")}isCrossOrigin(){return!this.to||isCrossOrigin(this.to)}}const OMID_PRESENT_FRAME_NAME="omid_v1_present";function isOmidPresent(e){try{return null!=e&&e.frames?!!e.frames[OMID_PRESENT_FRAME_NAME]:!1}catch(e){return!1}}const EXPORTED_VERIFICATION_COMMUNICATION_NAME=["omid","v1_VerificationServiceCommunication"],EXPORTED_SERVICE_WINDOW_NAME=["omidVerificationProperties","serviceWindow"];function getValueForKeypath(e,i){return i.reduce((e,i)=>e&&e[i],e)}function startServiceCommunication(e,i,t,s){if(!isCrossOrigin(i))try{var n=getValueForKeypath(i,t);if(n)return new DirectCommunication(n)}catch(e){}return s(i)?new PostMessageCommunication(e,i):null}function startServiceCommunicationFromCandidates(e,i,t,s){for(const r of i){var n=startServiceCommunication(e,r,t,s);if(n)return n}return null}function startVerificationServiceCommunication(e,i=isOmidPresent){const t=[];var s=getValueForKeypath(e,EXPORTED_SERVICE_WINDOW_NAME);return s&&t.push(s),t.push(resolveTopWindowContext(e)),startServiceCommunicationFromCandidates(e,t,EXPORTED_VERIFICATION_COMMUNICATION_NAME,i)}const VERIFICATION_CLIENT_VERSION=Version;function getThirdPartyOmid(){var e=omidGlobal.omid3p;return e&&"function"==typeof e.registerSessionObserver&&"function"==typeof e.addEventListener?e:null}class VerificationClient{constructor(e){var e=e||startVerificationServiceCommunication(resolveGlobalContext()),e=(e&&(this.communication=e),this.communication?this.communication.onMessage=this.handleMessage_.bind(this):(e=getThirdPartyOmid())&&(this.omid3p=e),this.remoteTimeouts_=0,this.remoteIntervals_=0,this.callbackMap_={},this.imgCache_=[],omidGlobal.omidVerificationProperties);this.injectionId_=e?e.injectionId:void 0}isSupported(){return Boolean(this.communication||this.omid3p)}injectionSource(){var e=omidGlobal.omidVerificationProperties;if(e&&e.injectionSource)return e.injectionSource}registerSessionObserver(e,i){assertFunction("functionToExecute",e),this.omid3p?this.omid3p.registerSessionObserver(e,i,this.injectionId_):this.sendMessage_("addSessionListener",e,i,this.injectionId_)}addEventListener(e,i){assertTruthyString("eventType",e),assertFunction("functionToExecute",i),this.omid3p?this.omid3p.addEventListener(e,i):this.sendMessage_("addEventListener",i,e)}sendUrl(e,i=void 0,t=void 0){assertTruthyString("url",e),omidGlobal.document?this.sendUrlWithImg_(e,i,t):this.sendMessage_("sendUrl",e=>{e&&i?i():!e&&t&&t()},e)}sendUrlWithImg_(e,i,t){const s=omidGlobal.document.createElement("img");this.imgCache_.push(s);var n=e=>{this.imgCache_.indexOf(s),this.imgCache_.splice(0,1),e&&e()};s.addEventListener("load",n.bind(this,i)),s.addEventListener("error",n.bind(this,t)),s.src=e}injectJavaScriptResource(t,s,n){assertTruthyString("url",t),omidGlobal.document?this.injectJavascriptResourceUrlInDom_(t,s,n):this.sendMessage_("injectJavaScriptResource",(e,i)=>{e?(this.evaluateJavaScript_(i,t),s()):(error("Service failed to load JavaScript resource."),n())},t)}injectJavascriptResourceUrlInDom_(e,i,t){const s=omidGlobal.document,n=s.body,r=s.createElement("script");r.onload=()=>i(),r.onerror=()=>t(),r.src=e,r.type="application/javascript",n.appendChild(r)}evaluateJavaScript_(javaScript,url){try{eval(javaScript)}catch(error){error(`Error evaluating the JavaScript resource from "${url}".`)}}setTimeout(e,i){if(assertFunction("functionToExecute",e),assertPositiveNumber("timeInMillis",i),this.hasTimeoutMethods_())return omidGlobal.setTimeout(e,i);var t=this.remoteTimeouts_++;return this.sendMessage_("setTimeout",e,t,i),t}clearTimeout(e){assertPositiveNumber("timeoutId",e),this.hasTimeoutMethods_()?omidGlobal.clearTimeout(e):this.sendOneWayMessage_("clearTimeout",e)}setInterval(e,i){if(assertFunction("functionToExecute",e),assertPositiveNumber("timeInMillis",i),this.hasIntervalMethods_())return omidGlobal.setInterval(e,i);var t=this.remoteIntervals_++;return this.sendMessage_("setInterval",e,t,i),t}clearInterval(e){assertPositiveNumber("intervalId",e),this.hasIntervalMethods_()?omidGlobal.clearInterval(e):this.sendOneWayMessage_("clearInterval",e)}hasTimeoutMethods_(){return"function"==typeof omidGlobal.setTimeout&&"function"==typeof omidGlobal.clearTimeout}hasIntervalMethods_(){return"function"==typeof omidGlobal.setInterval&&"function"==typeof omidGlobal.clearInterval}handleMessage_(e){var i,{method:e,guid:t,args:s}=e;"response"===e&&this.callbackMap_[t]&&(i=deserializeMessageArgs(VERIFICATION_CLIENT_VERSION,null!=s?s:void 0),this.callbackMap_[t].apply(this,i)),"error"===e&&window.console&&error(s)}sendOneWayMessage_(e,...i){this.sendMessage_(e,...i)}sendMessage_(e,i,...t){var s;this.communication&&(s=generateGuid(),i&&(this.callbackMap_[s]=i),i=new InternalMessage(s,getPrefixedVerificationServiceMethod(e),VERIFICATION_CLIENT_VERSION,serializeMessageArgs(VERIFICATION_CLIENT_VERSION,t)),this.communication.sendMessage(i))}}class TwoSeconds50PercentViewability{constructor(e){this.eventSender_=e,this.eventCompleted_=!1,this.isPlaying_=!1}callback(e){if(!this.eventCompleted_){switch(e.type){case"impression":case"geometryChange":this.isViewable_=!!(e.data.adView&&50<=e.data.adView.percentageInView);break;case"start":case"resume":this.isPlaying_=!0;break;case"pause":case"sessionFinish":case"complete":this.isPlaying_=!1;break;default:return}this.isPlaying_&&this.isViewable_?(this.startViewability(),this.eventTimeStamp_=e.timestamp+2e3):this.stopViewability()}}stopViewability(){this.timeoutId&&(window.clearTimeout(this.timeoutId),this.timeoutId=void 0)}startViewability(){this.timeoutId||(this.timeoutId=window.setTimeout(this.sendEvent.bind(this),2e3))}sendEvent(){this.eventSender_.sendEvent(TWO_SECONDS_50_PERCENT_VIEW,this.eventTimeStamp_),this.eventCompleted_=!0,this.stopViewability()}}class Quartiles100PercentViewability{constructor(e){this.eventSender_=e,this.isViewable_=!1}callback(e){switch(e.type){case"impression":case"geometryChange":this.isViewable_=!!e.data.adView&&100==e.data.adView.percentageInView;break;case"start":case"firstQuartile":case"midpoint":case"thirdQuartile":case"complete":this.isViewable_&&this.eventSender_.sendEvent(e.type,e.timestamp);break;default:return}}}class Trackers{constructor(e){this.eventsCallbacks=[],this.twoSeconds50PercentViewabilityInstance=new TwoSeconds50PercentViewability(e),this.quartiles100PercentViewabilityInstance=new Quartiles100PercentViewability(e),this.eventsCallbacks.push(e=>this.twoSeconds50PercentViewabilityInstance.callback(e)),this.eventsCallbacks.push(e=>this.quartiles100PercentViewabilityInstance.callback(e))}callback(i){this.eventsCallbacks.forEach(e=>e(i))}}class ValidationVerificationClient{constructor(e,i,t){this.verificationClient_=e,this.eventSender_=i;e=this.verificationClient_.isSupported();this.logMessage_("OmidSupported["+e+"]",(new Date).getTime()),e&&(this.verificationClient_.registerSessionObserver(e=>this.sessionObserverCallback_(e),t),EventNames.filter(e=>"media"!==e&&"video"!==e).forEach(e=>this.verificationClient_.addEventListener(e,e=>this.omidEventListenerCallback_(e))))}logMessage_(e,i){"string"!=typeof e&&e.hasOwnProperty("type")&&"sessionStart"==e.type&&(e.data.context.friendlyToTop=isTopWindowAccessible(resolveGlobalContext()),this.resolveCriteoValidationVerificationScript(i,e.data.verificationParameters))}omidEventListenerCallback_(e){var i;this.logMessage_(e,e.timestamp),null!=(i=this.criteoTrackers_)&&i.callback(e)}sessionObserverCallback_(e){this.logMessage_(e,e.timestamp)}resolveCriteoValidationVerificationScript(e,i){this.eventSender_.initialize(e,i),this.criteoTrackers_=new Trackers(this.eventSender_)}}const v=new VerificationClient;new ValidationVerificationClient(v,new RetailMediaEventSender(v),"iabtechlab.com-omid")}();
