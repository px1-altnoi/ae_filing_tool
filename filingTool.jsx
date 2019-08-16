
app.beginUndoGroup("filing tool");

// 1. Global variables ------------------------------------
app.activeViewer.setActive();
var doneCMP = [];
var doneFTG = [];
var CMPlen = 0;
var FTGlen = 0;
var ACT_cmp = app.project.activeItem;
var ACT_cmpName = app.project.activeItem.name;
var pFolder;
var mFolder = app.project.items.addFolder("material");

// 2. Functions -------------------------------------------
var isAVLayer = function(layer){
    if(!(layer && layer instanceof AVLayer)){
        return false;
    }else{
        return true;
    }
}

var isPRECMP = function(layer){
    if(layer.source.mainSource instanceof FileSource || layer.source.mainSource instanceof SolidSource){
        return false;
    }else{
        return true;
    }
}

function mvFile(layer){
    doneFTG[FTGlen] = layer.source.id;
    FTGlen++;
    var mflg = 0;
    for(var k = 0;k < FTGlen - 1;k++){
        if(doneFTG[k] == layer.source.id){
            if(pFolder.id != layer.source.parentFolder.id){
                layer.source.parentFolder = mFolder;
                mflg = 1;
                break;
            }
        }else{
            // do nothing
        }
    }
    if(mflg == 0) {
        if(layer.source.mainSource instanceof FileSource || layer.source.mainSource instanceof SolidSource){
            layer.source.parentFolder = pFolder;
        }else{
            // do nothing
        }
    }
}

function digCMP(composition){
    doneCMP[CMPlen] = composition.id;
    CMPlen++;
    mkDir(composition.name);
    for(var i = 1;i < composition.layers.length + 1;i++){
        if(isAVLayer(composition.layers[i])){
            if(isPRECMP(composition.layers[i])){
                var flg = 0;
                for(var j = 0;j < CMPlen - 1;j++){
                    if(doneCMP[j] == composition.layers[i].source.id){
                        flg = 1;
                        break;
                    }else{
                        // do nothing
                    }
                }
                if(flg == 0) digCMP(composition.layers[i].source);
            }
            mvFile(composition.layers[i]);
        }
    }
    return true;
}

function mkDir(dirName){
    pFolder = app.project.items.addFolder(dirName);
}

function cleanUp(){

}

// 3. Main ------------------------------------------------
digCMP(ACT_cmp);
cleanUp();
app.endUndoGroup();
