var YDOM=YAHOO.util.Dom;
var YEVENT=YAHOO.util.Event;
var YELEMENT=YAHOO.util.Element;
var YANIM=YAHOO.util.Anim;
var YCALENDAR=YAHOO.widget.Calendar;
var YSLIDER=YAHOO.widget.Slider;
YSLIDER.prototype.verifyOffset=function(_1){
var _2=YAHOO.util.Dom.getXY(this.getEl());
if(_2){
if(isNaN(this.baselinePos[0])){
this.setThumbCenterPoint();
this.thumb.startOffset=this.thumb.getOffsetFromParent(_2);
}
if(_2[0]!=this.baselinePos[0]||_2[1]!=this.baselinePos[1]){
this.thumb.resetConstraints();
this.baselinePos=_2;
return false;
}
}
return true;
};
function FSForm(id){
this.id=id;
this.scriptRequestCounter=1;
this.lastPage=1;
this.checks=[];
this.logicFields=[];
this.calculations=[];
this.calcFields=[];
this.init=function(){
for(var i=0;i<this.logicFields.length;i++){
var id=this.logicFields[i];
var _6=this.getFieldsByName("field"+id);
for(var j=0;j<_6.length;j++){
var _8=_6[j];
var _9=_8.type.toLowerCase();
var _a=_9=="radio"||_9=="checkbox"?"click":"change";
YEVENT.addListener(_8,_a,(function(id){
return function(){
this.checkLogic(id);
};
})(id),this,true);
}
this.checkLogic(id);
}
for(var i=0;i<this.calcFields.length;i++){
var id=this.calcFields[i];
var _6=this.getFieldsByName("field"+id);
for(var j=0;j<_6.length;j++){
var _8=_6[j];
var _9=_8.type.toLowerCase();
var _a=_9=="radio"||_9=="checkbox"?"click":"change";
YEVENT.addListener(_8,_a,(function(id){
return function(){
this.updateCalculations(id);
};
})(id),this,true);
}
var _d=YDOM.get("field"+id+"_othervalue");
if(_d){
YEVENT.addListener(_d,"change",(function(id,_f){
return function(){
YDOM.get("field"+id+"_other").checked=_f.value!="";
this.updateCalculations(id);
};
})(id,_d),this,true);
}
}
var _6=YDOM.getElementsByClassName("fsOtherField","input");
for(var i=0;i<_6.length;i++){
var _8=_6[i];
YEVENT.addListener(_8,"change",function(e){
var _11=YEVENT.getTarget(e);
var id=_11.id.split("_");
YDOM.get(id[0]+"_other").checked=YDOM.get(_11).value!="";
},this,true);
}
var _6=YDOM.getElementsByClassName("fsField");
for(var i=0;i<_6.length;i++){
var _8=_6[i];
YEVENT.addListener(_8,"focus",function(e){
var _14=YEVENT.getTarget(e);
this.focus(_14,true);
},this,true);
YEVENT.addListener(_8,"blur",function(e){
var _16=YEVENT.getTarget(e);
this.focus(_16,false);
},this,true);
}
var els=YDOM.getElementsByClassName("fsCallout","div");
for(var i=0;i<els.length;i++){
var el=els[i];
YDOM.setStyle(el,"opacity",0);
FSUtil.hide(el);
}
for(var i=0;i<this.calculations.length;i++){
var _19=this.calculations[i];
this.evalCalculation(_19);
}
var _1a=YDOM.getElementsByClassName("fsCalendar","div");
for(var i=0;i<_1a.length;i++){
var div=_1a[i];
var id=div.id.match(/(\d+)/);
id=id[1];
var _1c=YDOM.get("field"+id+"Y").options;
var _1d=parseInt(_1c[1].value,10);
var _1e=parseInt(_1c[_1c.length-1].value,10);
var _1f=new Date().getFullYear();
if(_1d<100){
_1d+=_1d>_1f-2000?1900:2000;
}
if(_1e<100){
_1e+=2000;
}
var _20=new YCALENDAR(div.id,div.id,{mindate:"1/1/"+_1d,maxdate:"12/31/"+_1e});
_20.render();
YEVENT.addListener(div.id+"Link","click",_20.show,_20,true);
_20.beforeShowEvent.subscribe(this.calendarShow,_20,true);
_20.selectEvent.subscribe(this.calendarSelect,_20,true);
}
var _21=YDOM.getElementsByClassName("fsTextAreaMaxLength","textarea");
for(var i=0;i<_21.length;i++){
var _22=_21[i];
var id=_22.id.match(/(\d+)/);
id=id[1];
var _23=YDOM.get("fsCounter"+id);
var _24=parseInt(_23.innerHTML);
if(_24>0){
YEVENT.addListener(_22,"keyup",(function(id,_26){
return function(){
this.textareaCharLimiter(id,_26);
};
})(id,_24),this,true);
YDOM.setStyle(_22.id,"paddingBottom","24px");
_23.innerHTML="";
FSUtil.show(_23);
}
}
var _27=YDOM.getElementsByClassName("fsMatrixOnePerColumn","table");
for(var i=0;i<_27.length;i++){
var _28=_27[i].getElementsByTagName("input");
for(var j=0;j<_28.length;j++){
var _9=_28[j].type.toLowerCase();
if(_9=="radio"||_9=="checkbox"){
YEVENT.addListener(_28[j],"click",(function(id){
return function(){
this.checkMatrixOnePerColumn(id);
};
})(_28[j].id),this,true);
}
}
}
var _2a=YDOM.getElementsByClassName("fsSlider","input");
for(var i=0;i<_2a.length;i++){
var _2b=this.getNumberProperties(_2a[i]);
if(!isNaN(_2b.min)&&!isNaN(_2b.max)){
var _2c=YSLIDER.getHorizSlider(_2a[i].id+"-sliderbg",_2a[i].id+"-sliderthumb",0,100);
_2c._fsobj=this;
_2c._fsnumber=_2b;
_2c._fsfield=_2a[i];
_2c._fsshow=YDOM.get(_2a[i].id+"-slidervalue");
var _2d=_2a[i].value!=""?parseFloat(_2a[i].value):_2b.min;
if(isNaN(_2d)){
_2d=_2b.min;
}
if(!/msie/i.test(navigator.userAgent)||/opera/i.test(navigator.userAgent)){
var _2e=Math.round((_2d-_2b.min)/(_2b.max-_2b.min)*100);
_2c.setValue(_2e,false,true,true);
}
if(!isNaN(_2b.decimals)){
_2d=_2d.toFixed(_2b.decimals);
}
_2a[i].value=_2d;
_2c._fsshow.innerHTML=_2d;
_2c.subscribe("change",function(_2f){
var _30=((_2f/100)*(this._fsnumber.max-this._fsnumber.min))+this._fsnumber.min;
_30=isNaN(this._fsnumber.decimals)?Math.round(_30):_30.toFixed(this._fsnumber.decimals);
if(_30==-0){
_30=0;
}
this._fsfield.value=_30;
this._fsshow.innerHTML=_30;
var id=this._fsfield.id.match(/(\d+)/);
id=id[1];
if(FSUtil.arrayIndexOf(this._fsobj.calcFields,id)>=0){
this._fsobj.updateCalculations(id);
}
},_2c,true);
}
}
var _28=[];
var _32=["fsFormatEmail","fsFormatPhoneUS","fsFormatPhoneUK","fsFormatPhoneAU","fsFormatPhoneXX","fsFormatZipUS","fsFormatZipCA","fsFormatZipUK","fsFormatZipAU","fsFormatNumber","fsFormatCreditCard"];
for(var _33=0;_33<_32.length;_33++){
_28=_28.concat(YDOM.getElementsByClassName(_32[_33],"input"));
}
for(var i=0;i<_28.length;i++){
this.checkFormat(_28[i]);
YEVENT.addListener(_28[i],"change",(function(_34){
return function(){
this.checkFormat(_34);
};
})(_28[i]),this,true);
}
this.updateProgress(1);
this.fitTableWidths(1);
if(!this.checkFreeLink()){
return;
}
};
this.getFieldContainer=function(_35){
var _36=_35;
while(_36&&_36.tagName.toLowerCase()!="body"){
if(YDOM.hasClass(_36,"fsFieldCell")){
return _36;
}
_36=_36.parentNode;
}
return;
};
this.focus=function(_37,_38){
if(/MSIE 6/i.test(navigator.userAgent)){
return;
}
var _39=this.getFieldContainer(_37);
if(!_39){
return;
}
if(_38){
YDOM.addClass(_39,"fsFieldFocused");
this.showCallout(_39,true);
}else{
YDOM.removeClass(_39,"fsFieldFocused");
this.showCallout(_39,false);
}
};
this.showCallout=function(_3a,_3b){
var _3c=this.getFieldContainer(_3a);
var _3d=YDOM.getElementsByClassName("fsCallout","div",_3c);
if(!_3d.length){
return;
}
var _3e=_3d[0];
if(_3b){
var _3f=YDOM.getXY(_3a);
var _40=FSUtil.getHeight(_3a);
var _41=FSUtil.getWidth(_3a);
YDOM.setStyle(_3e,"opacity",0);
YDOM.setStyle(_3e,"top",(_3f[1])+_40+"px");
YDOM.setStyle(_3e,"left",(_3f[0]+50)+"px");
YDOM.setStyle(_3e,"marginTop","25px");
FSUtil.show(_3e);
var _42=new YAHOO.util.Anim(_3e,{marginTop:{to:0},opacity:{to:1}},0.5,YAHOO.util.Easing.easeOut);
_42.animate();
}else{
var _42=new YAHOO.util.Anim(_3e,{opacity:{to:0}},0.5,YAHOO.util.Easing.easeOut);
_42.onComplete.subscribe(function(){
FSUtil.hide(_3e);
});
_42.animate();
}
};
this.fadeCallout=function(_43){
var _44=15;
var _45=20;
var _46=YDOM.hasClass(_43,"fsCalloutShowing");
var _47=YDOM.getStyle(_43,"opacity");
var _48=YDOM.getStyle(_43,"marginTop").split("px")[0];
var _49=this;
if(_46){
_47+=(1/_44);
_48-=(25/_44);
if(_47>=1){
_47=1;
}else{
setTimeout(function(){
_49.fadeCallout(_43);
},_45);
}
if(_48<=0){
_48=0;
}
}else{
_47-=(1/_44);
if(_47<=0){
_47=0;
FSUtil.hide(_43);
}else{
setTimeout(function(){
_49.fadeCallout(_43);
},_45);
}
}
YDOM.setStyle(_43,"opacity",_47);
YDOM.setStyle(_43,"margin-top",_48+"px");
};
this.checkRequired=function(_4a){
this.clearError(_4a);
var _4b=false;
var _4c=[];
var _4d=YDOM.getElementsByClassName("fsField","","fsPage"+this.id+"-"+_4a);
for(var i=0;i<_4d.length;i++){
var _4f=_4d[i];
if(this.fieldIsVisible(_4f)&&FSUtil.arrayIndexOf(_4c,_4f.id)==-1){
var _50=true;
if(YDOM.hasClass(_4f,"fsRequired")){
_50=this.checkValue(_4f);
if(!_50){
_4b=true;
if(YDOM.hasClass(_4f,"fsFieldAddress")){
var id=_4f.id.split("-");
id=id[0];
_4c.push(id+"-zip");
}
}
}
if(_50&&YDOM.hasClass(_4f,"fsUpload")){
_50=this.checkUpload(_4f);
if(!_50){
_4b=true;
}
}
if(_50){
_50=this.checkFormat(_4f);
if(!_50){
_4b=true;
}
}
}
}
if(_4b){
this.showError(YDOM.get("requiredFieldsError")?YDOM.get("requiredFieldsError").innerHTML:"Please fill in a valid value for all required fields");
return false;
}
return true;
};
this.checkValue=function(_52){
var bad=false;
switch(_52.type.toLowerCase()){
case "text":
case "password":
case "textarea":
case "file":
if(YDOM.hasClass(_52,"fsFieldName")){
var id=_52.id.split("-");
id=id[0];
bad=!YDOM.get(id+"-first").value.match(/\S/)||!YDOM.get(id+"-last").value.match(/\S/);
}else{
if(YDOM.hasClass(_52,"fsFieldAddress")){
var id=_52.id.split("-");
id=id[0];
bad=!YDOM.get(id+"-address").value.match(/\S/)||!YDOM.get(id+"-city").value.match(/\S/)||!YDOM.get(id+"-zip").value.match(/\S/);
if(!bad){
var _55=YDOM.get(id+"-state");
if(_55.type.toLowerCase()=="select-one"){
bad=!_55.options[_55.selectedIndex].value.match(/\S/);
}else{
bad=!_55.value.match(/\S/);
}
}
if(!bad){
var _56=YDOM.get(id+"-country");
if(_56&&!_56.options[_56.selectedIndex].value.match(/\S/)){
bad=true;
}
}
}else{
bad=!_52.value.match(/\S/);
}
}
break;
case "select-one":
bad=!_52.options[_52.selectedIndex].value.match(/\S/);
break;
case "select-multiple":
bad=true;
var _57=_52.options;
for(var j=0;j<_57.length;j++){
if(_57[j].selected&&_57[j].value.match(/\S/)){
bad=false;
}
}
break;
case "radio":
case "checkbox":
bad=true;
var _59=document.getElementsByName(_52.name);
for(var j=0;j<_59.length;j++){
if(_59[j].checked){
bad=false;
}
}
break;
}
if(bad){
this.highlightField(_52,true);
}
return !bad;
};
this.checkFormat=function(_5a){
var _5b=false;
if(_5a.value!=""){
if(YDOM.hasClass(_5a,"fsFormatEmail")){
_5b=true;
if(!_5a.value.match(/^\s*\S+\@[\w\-\.]+\.\w+\s*$/)){
this.highlightField(_5a,true);
return false;
}
}else{
if(YDOM.hasClass(_5a,"fsFormatPhoneUS")||YDOM.hasClass(_5a,"fsFormatPhoneUK")||YDOM.hasClass(_5a,"fsFormatPhoneAU")){
_5b=true;
var val=_5a.value.toLowerCase().replace(/[^\dx]/g,"");
var ext="";
if(val.indexOf("x")>=0){
var _5e=val.split("x");
val=_5e[0];
ext=_5e[1];
}
if(val.charAt(0)=="1"){
val=val.substr(1,val.length-1);
}
if(YDOM.hasClass(_5a,"fsFormatPhoneUS")){
if(val.length!=10){
this.highlightField(_5a,true);
return false;
}
_5a.value="("+val.substr(0,3)+") "+val.substr(3,3)+"-"+val.substr(6,4);
}else{
if(YDOM.hasClass(_5a,"fsFormatPhoneUK")){
if(val.substr(0,2)=="44"){
val=val.substr(2,val.length-2);
if(val.charAt(0)!="0"){
val="0"+val;
}
}
if(val.charAt(0)!="0"||(val.length!=10&&val.length!=11)){
this.highlightField(_5a,true);
return false;
}
if((val.charAt(1)=="1"&&(val.charAt(2)=="1"||val.charAt(3)=="1"))||(val.charAt(1)=="8")){
_5a.value=val.substr(0,4)+" "+val.substr(4,3)+" "+val.substr(7,val.length-7);
}else{
if(val.charAt(1)=="2"||val.charAt(1)=="3"||val.charAt(1)=="5"){
_5a.value=val.substr(0,3)+" "+val.substr(3,4)+" "+val.substr(7,val.length-7);
}else{
_5a.value=val.substr(0,5)+" "+val.substr(5,val.length-5);
}
}
}else{
if(YDOM.hasClass(_5a,"fsFormatPhoneAU")){
if(val.substr(0,2)=="61"){
val=val.substr(2,val.length-2);
if(val.charAt(0)!="0"){
val="0"+val;
}
}
if(val.charAt(0)!="0"||val.length!=10){
this.highlightField(_5a,true);
return false;
}
_5a.value="("+val.substr(0,2)+") "+val.substr(2,4)+" "+val.substr(6,4);
}
}
}
if(ext.length){
_5a.value+=" x"+ext;
}
}else{
if(YDOM.hasClass(_5a,"fsFormatPhoneXX")){
_5b=true;
if(!/\d{3,}/.test(_5a.value)){
this.highlightField(_5a,true);
return false;
}
}else{
if(YDOM.hasClass(_5a,"fsFormatZipUS")){
_5b=true;
var val=_5a.value.replace(/^\s+/,"").replace(/\s+$/,"");
if(!val.match(/^\d{5}(?:\-\d{4})?$/)){
this.highlightField(_5a,true);
return false;
}
_5a.value=val;
}else{
if(YDOM.hasClass(_5a,"fsFormatZipCA")){
_5b=true;
var val=_5a.value.replace(/^\s+/,"").replace(/\s+$/,"").replace(/\s{2,}/," ").toUpperCase();
if(val.length==6&&!val.match(/\s/)){
val=val.substr(0,3)+" "+val.substr(3,3);
}
if(!val.match(/^[A-Z]\d[A-Z] \d[A-Z]\d$/)){
this.highlightField(_5a,true);
return false;
}
_5a.value=val;
}else{
if(YDOM.hasClass(_5a,"fsFormatZipUK")){
_5b=true;
var val=_5a.value.replace(/^\s+/,"").replace(/\s+$/,"").replace(/\s{2,}/," ").toUpperCase();
if(!val.match(/\s/)){
val=val.substr(0,val.length-3)+" "+val.substr(val.length-3,3);
}
if(!val.match(/^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/)){
this.highlightField(_5a,true);
return false;
}
_5a.value=val;
}else{
if(YDOM.hasClass(_5a,"fsFormatZipAU")){
_5b=true;
var val=_5a.value.replace(/^\s+/,"").replace(/\s+$/,"").toUpperCase();
if(!val.match(/^\d{4}$/)){
this.highlightField(_5a,true);
return false;
}
_5a.value=val;
}else{
if(YDOM.hasClass(_5a,"fsFormatNumber")){
_5b=true;
var val=parseFloat(_5a.value.replace(/[^\d\.\-]/g,""));
if(isNaN(val)){
this.highlightField(_5a,true);
return false;
}
var _5f=this.getNumberProperties(_5a);
if(!isNaN(_5f.min)&&val<_5f.min){
this.highlightField(_5a,true);
return false;
}
if(!isNaN(_5f.max)&&val>_5f.max){
this.highlightField(_5a,true);
return false;
}
if(!isNaN(_5f.decimals)){
val=val.toFixed(_5f.decimals);
}
_5a.value=val;
}else{
if(YDOM.hasClass(_5a,"fsFormatCreditCard")){
_5b=true;
var val=_5a.value.replace(/\D/g,"");
var _60=0;
var _61=1;
for(var i=val.length-1;i>=0;i--){
var _63=parseInt(val.charAt(i))*_61;
_60+=(_63>9)?_63-9:_63;
_61=_61==1?2:1;
}
if(_60%10!=0){
this.highlightField(_5a,true);
return false;
}
if(val.match(/^4/)){
if(!YDOM.hasClass(_5a,"fsFormatCreditCardVisa")||(val.length!=13&&val.length!=16)){
this.highlightField(_5a,true);
return false;
}
}else{
if(val.match(/^(?:51|52|53|54|55)/)){
if(!YDOM.hasClass(_5a,"fsFormatCreditCardMasterCard")||val.length!=16){
this.highlightField(_5a,true);
return false;
}
}else{
if(val.match(/^(?:6011|622|64|65)/)){
if(!YDOM.hasClass(_5a,"fsFormatCreditCardDiscover")||val.length!=16){
this.highlightField(_5a,true);
return false;
}
}else{
if(val.match(/^(?:34|37)/)){
if(!YDOM.hasClass(_5a,"fsFormatCreditCardAmex")||val.length!=15){
this.highlightField(_5a,true);
return false;
}
}else{
if(val.match(/^(?:300|301|302|303|304|305|36|54|55)/)){
if(!YDOM.hasClass(_5a,"fsFormatCreditCardDiners")||(val.length!=14&&val.length!=16)){
this.highlightField(_5a,true);
return false;
}
}else{
if(val.match(/^35/)){
if(!YDOM.hasClass(_5a,"fsFormatCreditCardJCB")||val.length!=16){
this.highlightField(_5a,true);
return false;
}
}else{
this.highlightField(_5a,true);
return false;
}
}
}
}
}
}
_5a.value=val;
}
}
}
}
}
}
}
}
}
}
if(_5b){
this.highlightField(_5a,false);
}
return true;
};
this.checkUpload=function(_64){
var _65=true;
var _66=[];
var _67=_64.className.split(/\s+/);
for(var j=0;j<_67.length;j++){
var _69=_67[j];
if(/^uploadTypes-/.test(_69)){
var m=_69.split("-");
_66=m[1].split(",");
}
}
for(var j=0;j<_66.length;j++){
_66[j]=_66[j].toLowerCase();
}
if(FSUtil.arrayIndexOf(_66,"*")<0&&_64&&_64.value!=""&&this.fieldIsVisible(_64)){
var ext=_64.value.match(/\.(\w+)$/);
_65=ext&&FSUtil.arrayIndexOf(_66,ext[1].toLowerCase())>=0?true:false;
if(!_65){
this.highlightField(_64,true);
var msg=YDOM.get("fileTypeAlert")?YDOM.get("fileTypeAlert").innerHTML:"You must upload one of the following file types for the selected field:";
alert(msg+_66.join(", "));
}
}
return _65;
};
this.showError=function(_6d){
var _6e=document.createElement("div");
_6e.id="fsError"+this.id;
_6e.className="fsError";
_6e.innerHTML=_6d;
YDOM.insertBefore(_6e,"fsForm"+this.id);
FSUtil.scrollTo("fsError");
};
this.clearError=function(_6f){
var _70=YDOM.getElementsByClassName("fsRequired","","fsPage"+this.id+"-"+_6f);
for(var i=0;i<_70.length;i++){
this.highlightField(_70[i],0);
}
var _70=YDOM.getElementsByClassName("fsUpload","input","fsPage"+this.id+"-"+_6f);
for(var i=0;i<_70.length;i++){
this.highlightField(_70[i],0);
}
var _72=YDOM.get("fsError"+this.id);
if(_72){
_72.parentNode.removeChild(_72);
}
};
this.highlightField=function(_73,on){
var _75=this.getFieldContainer(_73);
if(on){
YDOM.addClass(_75,"fsValidationError");
}else{
YDOM.removeClass(_75,"fsValidationError");
}
};
this.checkSelected=function(_76,_77){
var _78=false;
var _79=document.getElementsByName(_76);
if(!_79.length){
_79=document.getElementsByName(_76+"[]");
}
for(var i=0;i<_79.length;i++){
var _7b=_79[i];
if(_7b.type=="checkbox"||_7b.type=="radio"){
if(_7b.checked&&_7b.value==_77){
_78=true;
}
}else{
if(_7b.type=="select-one"){
_78=_7b.options[_7b.selectedIndex].value==_77?true:false;
}else{
if(_7b.type=="select-multiple"){
var _7c=_7b.options;
for(var j=0;j<_7c.length;j++){
var _7e=_7c[j];
if(_7e.selected&&_7e.value==_77){
_78=true;
}
}
}
}
}
}
return _78;
};
this.checkLogic=function(id){
for(var i=0;i<this.checks.length;i++){
var _81=this.checks[i];
if(FSUtil.arrayIndexOf(_81.fields,id)>=0){
var _82=_81.bool=="AND"?true:false;
for(var j=0;j<_81.checks.length;j++){
var _84=_81.checks[j];
var _85=this.checkSelected("field"+_84.field,_84.option);
if(_84.condition=="!="){
_85=!_85;
}
if(_81.bool=="AND"){
_82=_82?_85:false;
}else{
_82=_82?true:_85;
}
}
var _86=YDOM.get("fsCell"+_81.target);
if(YDOM.hasClass(_86,"fsSectionCell")){
_86=YDOM.get("fsSection"+_81.target);
}
if(_82){
if(_81.action=="Show"){
this.showFields(_86);
}else{
this.hideFields(_86);
}
}else{
if(_81.action=="Show"){
this.hideFields(_86);
}else{
this.showFields(_86);
}
}
}
}
};
this.showFields=function(_87){
var _88=["input","textarea","select"];
for(var i=0;i<_88.length;i++){
var _8a=_87.getElementsByTagName(_88[i]);
for(var j=0;j<_8a.length;j++){
var _8c=_8a[j];
if(_8c.type!="file"){
_8c.disabled=false;
}
}
}
if(_87.tagName.toLowerCase()=="table"){
if(!FSUtil.visible(_87)){
FSUtil.show(_87);
this.updateTablePositionClasses(_87);
}
}else{
YDOM.removeClass(_87,"fsHiddenCell");
FSUtil.show(YDOM.getAncestorByTagName(_87,"tr"));
var _8d=YDOM.getAncestorByTagName(_87,"table");
if(!FSUtil.visible(_8d)){
FSUtil.show(_8d);
this.updateTablePositionClasses(_8d);
}
var _8e=YDOM.getElementsByClassName("fsMatrix","table",_87);
for(var _8f=0;_8f<_8e.length;_8f++){
var _90=_8e[_8f].getElementsByTagName("td");
for(var _91=0;_91<_90.length;_91++){
YDOM.removeClass(_90[_91],"fsHiddenCell");
}
}
}
};
this.hideFields=function(_92){
if(_92.tagName.toLowerCase()=="table"){
if(FSUtil.visible(_92)){
FSUtil.hide(_92);
this.updateTablePositionClasses(_92);
}
}else{
YDOM.addClass(_92,"fsHiddenCell");
var _93=YDOM.getAncestorByTagName(_92,"tr");
var _94=YDOM.getElementsByClassName("fsFieldCell","td",_93);
var _95=false;
if(_94.length==1){
_95=true;
}else{
var _96=YDOM.getElementsByClassName("fsHiddenCell","td",_93);
if(_96.length==_94.length){
_95=true;
}
}
if(_95){
FSUtil.hide(_93);
var _97=YDOM.getAncestorByTagName(_92,"table");
var _98=YDOM.getElementsByClassName("fsFieldRow","tr",_97);
var _99=false;
for(var i=0;i<_98.length;i++){
if(FSUtil.visible(_98[i])){
_99=true;
break;
}
}
if(!_99&&FSUtil.visible(_97)){
FSUtil.hide(_97);
this.updateTablePositionClasses(_97);
}
}
}
var _9b=["input","textarea","select"];
for(var i=0;i<_9b.length;i++){
var _9c=_92.getElementsByTagName(_9b[i]);
for(var j=0;j<_9c.length;j++){
var _9e=_9c[j];
if(_9e.type!="file"){
_9e.disabled=true;
}
}
}
};
this.updateTablePositionClasses=function(_9f){
var _a0=YDOM.getAncestorByTagName(_9f,"div");
if(!YDOM.hasClass(_a0,"fsPage")){
return;
}
var _a1=YDOM.getElementsByClassName("fsSection","table",_a0);
var _a2=-1;
var _a3=-1;
for(var i=0;i<_a1.length;i++){
if(FSUtil.visible(_a1[i])){
if(_a2<0){
_a2=i;
YDOM.addClass(_a1[i],"fsFirstSection");
YDOM.removeClass(_a1[i],"fsMiddleSection");
YDOM.removeClass(_a1[i],"fsLastSection");
}else{
YDOM.addClass(_a1[i],"fsMiddleSection");
YDOM.removeClass(_a1[i],"fsFirstSection");
YDOM.removeClass(_a1[i],"fsLastSection");
}
YDOM.removeClass(_a1[_a3],"fsSingleSection");
_a3=i;
}
}
if(_a3>=0){
YDOM.removeClass(_a1[_a3],"fsMiddleSection");
if(_a3==_a2){
YDOM.addClass(_a1[_a3],"fsSingleSection");
YDOM.removeClass(_a1[_a3],"fsFirstSection");
YDOM.removeClass(_a1[_a3],"fsLastSection");
}else{
YDOM.addClass(_a1[_a3],"fsLastSection");
YDOM.removeClass(_a1[_a3],"fsFirstSection");
}
}
};
this.updateCalculations=function(id){
for(var i=0;i<this.calculations.length;i++){
var _a7=this.calculations[i];
if(FSUtil.arrayIndexOf(_a7.fields,id)>=0){
this.evalCalculation(_a7);
}
}
};
this.evalCalculation=function(_a8){
var _a9=_a8.equation;
var _aa="";
for(var i=0;i<_a8.fields.length;i++){
var id=_a8.fields[i];
var _ad=new RegExp("\\["+id+"\\]","g");
var val=0;
var _af=this.getFieldsByName("field"+id);
for(var j=0;j<_af.length;j++){
var _b1=_af[j];
var _b2;
switch(_b1.type.toLowerCase()){
case "radio":
case "checkbox":
if(_b1.value=="Other"&&YDOM.get(_b1.id+"value")){
_b2=YDOM.get(_b1.id+"value").value;
}else{
_b2=_b1.value;
}
var v=this.getNumber(_b2);
if(_b1.checked&&!isNaN(v)){
val+=v;
}
break;
case "select-multiple":
var _b4=_b1.options;
for(var k=0;k<_b4.length;k++){
var v=this.getNumber(_b4[k].value);
if(_b4[k].selected&&!isNaN(v)){
_b2=_b4[k].value;
val+=v;
}
}
break;
default:
_b2=YDOM.get(_b1).value;
var v=this.getNumber(YDOM.get(_b1).value);
if(!isNaN(v)){
val=v;
}
}
if(_b2&&_b2.indexOf("$")!=-1){
_aa="$";
}
}
_a9=_a9.replace(_ad,val);
}
var _b6=0;
try{
_b6=eval(_a9);
}
catch(e){
}
var _b1=YDOM.get("field"+_a8.target);
if(YDOM.hasClass(_b1,"fsFormatNumber")){
_b1.value=_b6;
this.checkFormat(_b1);
}else{
_b1.value=_aa+_b6.toFixed(2);
}
this.updateCalculations(_a8.target);
};
this.getNumber=function(str){
if(!str){
return;
}
if(str.indexOf(" == ")!=-1){
var _b8=str.split(" == ");
str=_b8[1];
}
return parseFloat(str.replace(/[^\d\.\-]/g,""));
};
this.previousPage=function(_b9){
var _ba=YDOM.get("fsPage"+this.id+"-"+_b9);
if(!_ba){
return;
}
if(_b9<=1){
return;
}
var _bb=_b9-1;
while(!this.pageIsVisible(_bb)&&_bb>1){
_bb--;
}
var _bc=YDOM.get("fsPage"+this.id+"-"+_bb);
FSUtil.hide(_ba);
FSUtil.show(_bc);
this.updateProgress(_bb);
this.clearError(_b9);
FSUtil.hide("fsSubmit"+this.id);
FSUtil.scrollTo(_bc);
this.fitTableWidths(_bb);
};
this.nextPage=function(_bd){
var _be=YDOM.get("fsPage"+this.id+"-"+_bd);
if(!_be){
return;
}
if(_bd>=this.lastPage){
return;
}
if(this.checkRequired(_bd)){
var _bf=_bd+1;
while(!this.pageIsVisible(_bf)&&_bf<this.lastPage){
_bf++;
}
this.updateProgress(_bf);
var _c0=YDOM.get("fsPage"+this.id+"-"+_bf);
FSUtil.hide(_be);
FSUtil.show(_c0);
if(_bf==this.lastPage){
FSUtil.show("fsSubmit"+this.id);
}
FSUtil.scrollTo(_c0);
this.fitTableWidths(_bf);
}
};
this.fitTableWidths=function(_c1){
if(!/msie/i.test(navigator.userAgent)||/opera/i.test(navigator.userAgent)){
return;
}
var _c2="fsPage"+this.id+"-"+_c1;
var _c3=YDOM.getElementsByClassName("fsTable","table",_c2);
var max=0;
for(var i=0;i<_c3.length;i++){
var _c6=_c3[i].scrollWidth;
if(_c6>max){
max=_c6;
}
}
if(max){
YDOM.setStyle("fsForm"+this.id,"width",max+"px");
}
};
this.updateProgress=function(_c7){
if(!YDOM.get("fsProgress"+this.id+"-"+_c7)){
return;
}
var _c8=YDOM.getElementsByClassName("fsPage","div","fsForm"+this.id).length;
if(_c8<=1){
FSUtil.hide("fsProgress"+this.id+"-"+_c7);
return;
}
var _c9=YDOM.get("fsProgressBarContainer"+this.id+"-"+_c7);
var _ca=YDOM.get("fsProgressBar"+this.id+"-"+_c7);
var _cb=100;
var _cc=_c7/_c8;
if(_cc<0){
_cc=0;
}
if(_cc>1){
_cc=1;
}
var _cd=(_cb*_cc)+"px";
YDOM.setStyle(_ca,"width",_cd);
};
this.pageIsVisible=function(_ce){
var _cf=false;
var _d0=YDOM.getElementsByClassName("fsFieldCell","td","fsPage"+this.id+"-"+_ce);
for(var i=0;i<_d0.length;i++){
var _d2=_d0[i];
if(FSUtil.visible(_d2)&&!YDOM.hasClass(_d2,"fsHiddenCell")){
var _d3=YDOM.getAncestorByClassName(_d2,"fsSection");
if(!_d3||(FSUtil.visible(_d3)&&!YDOM.hasClass(_d3,"fsHiddenCell"))){
_cf=true;
}
}
}
var _d4=YDOM.getElementsByClassName("fsSection","table","fsPage"+this.id+"-"+_ce);
for(var i=0;i<_d4.length;i++){
var _d3=_d4[i];
if(FSUtil.visible(_d3)&&!YDOM.hasClass(_d3,"fsHiddenCell")){
_cf=true;
}
}
return _cf;
};
this.fieldIsVisible=function(_d5){
var _d6=_d5.parentNode;
while(_d6&&_d6.tagName.toLowerCase()!="body"&&!YDOM.hasClass(_d6,"fsFieldCell")){
_d6=_d6.parentNode;
}
var _d7=_d6&&_d6.tagName.toLowerCase()!="body"&&FSUtil.visible(_d6)&&!YDOM.hasClass(_d6,"fsHiddenCell")?true:false;
if(!_d7){
return false;
}
var _d8=_d6.parentNode;
while(_d8&&_d8.tagName.toLowerCase()!="body"&&!YDOM.hasClass(_d8,"fsSection")){
_d8=_d8.parentNode;
}
if(!_d8||_d8.tagName.toLowerCase()=="body"){
return _d7;
}
return FSUtil.visible(_d8)&&!YDOM.hasClass(_d8,"fsHiddenCell");
};
this.checkForm=function(){
var res=this.checkRequired(this.lastPage);
if(res){
var _da=[];
var _db=YDOM.getElementsByClassName("fsRequired","","fsForm"+this.id);
for(var i=0;i<_db.length;i++){
var _dd=_db[i];
if(!this.fieldIsVisible(_dd)){
if(_dd.id.indexOf("_")>=0){
var m=_dd.id.split("_");
_da.push(m[0]);
}else{
_da.push(_dd.name);
}
}
}
if(YDOM.get("hidden_fields"+this.id)){
YDOM.get("hidden_fields"+this.id).value=_da.join(",");
}
if(YDOM.get("captcha"+this.id)){
if(YDOM.get("captcha_code_"+this.id).value==""){
this.captchaError();
return false;
}
}
return true;
}else{
return false;
}
};
this.submitForm=function(){
if(!this.checkForm()){
return;
}
if(YDOM.get("captcha"+this.id)){
YDOM.get("fsSubmitButton"+this.id).disabled=true;
var _df=YDOM.get("fsForm"+this.id).action.replace(/index.php$/,"captcha.php");
this.scriptRequest(_df+"?action=test&v=2&captcha_code="+YDOM.get("captcha_code_"+this.id).value+"&form="+this.id+"&fspublicsession="+YDOM.get("session_id"+this.id).value+"&r="+(new Date()).getTime());
}else{
YDOM.get("fsForm"+this.id).submit();
}
};
this.captchaError=function(){
YDOM.addClass("captcha"+this.id,"captchaError");
FSUtil.scrollTo("captcha"+this.id);
};
this.reloadCaptcha=function(_e0){
var _e1=YDOM.get("fsForm"+this.id).action.replace(/index.php$/,"captcha.php");
YDOM.get("captcha_image_"+this.id).src=_e1+"?fspublicsession="+_e0+"&r="+Math.random();
};
this.scriptRequest=function(req){
var _e3=document.getElementsByTagName("head");
if(!_e3.length){
YDOM.get("fsForm"+this.id).submit();
return;
}
_e3=_e3[0];
var _e4=document.createElement("script");
_e4.setAttribute("type","text/javascript");
_e4.setAttribute("charset","utf-8");
_e4.setAttribute("src",req);
_e4.setAttribute("id","scriptRequest"+this.scriptRequestCounter);
_e3.appendChild(_e4);
this.scriptRequestCounter++;
};
this.captchaTestCallback=function(_e5){
if(_e5.res=="OK"){
YDOM.get("fsForm"+this.id).submit();
}else{
this.captchaError();
}
YDOM.get("fsSubmitButton"+this.id).disabled=false;
};
this.calendarShow=function(_e6,_e7,_e8){
var _e9=YDOM.getRegion(_e8.containerId+"Link");
if(_e9){
YDOM.setStyle(_e8.oDomContainer,"top",_e9.top+"px");
YDOM.setStyle(_e8.oDomContainer,"left",(_e9.left+16)+"px");
}
var id=_e8.id.match(/(\d+)/);
id=id[1];
var cur=new Date;
var _ec=YDOM.get("field"+id+"M");
var _ed=_ec&&_ec.selectedIndex?_ec.selectedIndex:cur.getMonth()+1;
var _ee=YDOM.get("field"+id+"D");
var day=_ee&&_ee.selectedIndex?_ee.selectedIndex:cur.getDate();
var _f0=YDOM.get("field"+id+"Y");
var _f1=cur.getFullYear();
if(_f0&&_f0.selectedIndex){
var _f1=parseInt(_f0.options[_f0.selectedIndex].value,10);
if(_f1<100){
_f1+=2000;
}
}
_e8.select(_ed+"/"+day+"/"+_f1);
_e8.setMonth(_ed-1);
_e8.setYear(_f1);
_e8.render();
};
this.calendarSelect=function(_f2,_f3,_f4){
var id=_f4.id.match(/(\d+)/);
id=id[1];
var _f6=_f3[0];
var _f7=_f6[0];
var _f8=_f7[0],_f9=_f7[1],day=_f7[2];
var _fb=YDOM.get("field"+id+"M");
if(_fb){
_fb.selectedIndex=_f9;
}
var _fc=YDOM.get("field"+id+"D");
if(_fc){
_fc.selectedIndex=day;
}
var _fd=YDOM.get("field"+id+"Y");
if(_fd){
for(var y=1;y<_fd.options.length;y++){
var _ff=parseInt(_fd.options[y].value,10);
if(_ff<100){
_ff+=2000;
}
if(_ff==_f8){
_fd.selectedIndex=y;
break;
}
}
}
_f4.hide();
};
this.textareaCharLimiter=function(id,_101){
var _102=YDOM.get("field"+id);
var _103=YDOM.get("fsCounter"+id);
var text=YDOM.get(_102).value;
if(text.length>_101){
_102.value=text.substring(0,_101);
}
_103.innerHTML=_101-YDOM.get(_102).value.length;
var _105=YDOM.getRegion(_102.id);
if(_105){
YDOM.setStyle(_103.id,"top",(_105.bottom-FSUtil.getHeight(_103)-5)+"px");
YDOM.setStyle(_103.id,"left",(_105.right-FSUtil.getWidth(_103)-25)+"px");
}
};
this.getFieldsByName=function(name){
var _107=new Array();
var els=document.getElementsByName(name);
for(var i=0;i<els.length;i++){
_107.push(els[i]);
}
var els=document.getElementsByName(name+"[]");
for(var i=0;i<els.length;i++){
_107.push(els[i]);
}
return _107;
};
this.saveIncomplete=function(){
if(!confirm(YDOM.get("resumeConfirm")?YDOM.get("resumeConfirm").innerHTML:"Are you sure you want to leave this form and resume later?")){
return;
}
YDOM.get("incomplete"+this.id).value="true";
YDOM.get("fsForm"+this.id).submit();
};
this.checkFreeLink=function(){
var form=YDOM.get("fsForm"+this.id);
if(!YDOM.hasClass(form,"fsFormFree")){
return true;
}
var doc;
var type=YDOM.get("referrer_type"+this.id);
switch(type.value){
case "iframe":
doc=window.parent.document;
break;
case "js":
doc=window.document;
break;
default:
return true;
}
var _10d=false;
var _10e=doc.getElementsByTagName("a");
for(var i=0;i<_10e.length;i++){
if(_10e[i].href.indexOf("http://www.formspring.com/")==0&&_10e[i].innerHTML.indexOf("FormSpring")>=0){
_10d=true;
break;
}
}
if(_10d){
return true;
}
this.showError(YDOM.get("embedError")?YDOM.get("embedError").innerHTML:"There was an error displaying the form. Please copy and paste the embed code again.");
FSUtil.hide(form);
return false;
};
this.checkMatrixOnePerColumn=function(id){
var ids=id.split("-");
var _112=ids[0];
var _113=ids[1];
var _114=ids[2];
var _115=YDOM.get("matrix-"+_112).getElementsByTagName("input");
for(var i=0;i<_115.length;i++){
var re=new RegExp("^"+_112+"-\\d+-"+_114+"$");
if(_115[i].id!=id&&re.test(_115[i].id)){
_115[i].checked=false;
}
}
};
this.getNumberProperties=function(_118){
var _119={min:NaN,max:NaN,decimals:NaN};
var _11a=_118.className.split(/\s+/);
for(var i=0;i<_11a.length;i++){
var _11c=_11a[i];
var _11d;
if(_11d=_11c.match(/^fsNumberMin-([\-\d]+)/)){
_119.min=parseInt(_11d[1]);
}else{
if(_11d=_11c.match(/^fsNumberMax-([\-\d]+)/)){
_119.max=parseInt(_11d[1]);
}else{
if(_11d=_11c.match(/^fsNumberDecimals-([\d]+)/)){
_119.decimals=parseInt(_11d[1]);
}
}
}
}
return _119;
};
};
function FSUtil(){
};
FSUtil.show=function(el){
YDOM.setStyle(el,"display","");
};
FSUtil.hide=function(el){
YDOM.setStyle(el,"display","none");
};
FSUtil.visible=function(el){
return YDOM.getStyle(el,"display")!="none";
};
FSUtil.scrollTo=function(el){
window.scroll(YDOM.getX(el),YDOM.getY(el));
};
FSUtil.getHeight=function(el){
var _123=YDOM.getRegion(el);
var _124=_123.bottom-_123.top;
return isNaN(_124)?0:_124;
};
FSUtil.getWidth=function(el){
var _126=YDOM.getRegion(el);
var _127=_126.right-_126.left;
return isNaN(_127)?0:_127;
};
FSUtil.arrayIndexOf=function(arr,item){
for(var i=0;i<arr.length;i++){
if(arr[i]===item){
return i;
}
}
return -1;
};


