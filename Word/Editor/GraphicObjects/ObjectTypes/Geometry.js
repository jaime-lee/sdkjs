
var FORMULA_TYPE_MULT_DIV = 0,
    FORMULA_TYPE_PLUS_MINUS = 1,
    FORMULA_TYPE_PLUS_DIV = 2,
    FORMULA_TYPE_IF_ELSE =3,
    FORMULA_TYPE_ABS = 4,
    FORMULA_TYPE_AT2 = 5,
    FORMULA_TYPE_CAT2 = 6,
    FORMULA_TYPE_COS = 7,
    FORMULA_TYPE_MAX = 8,
    FORMULA_TYPE_MOD = 9,
    FORMULA_TYPE_PIN = 10,
    FORMULA_TYPE_SAT2 = 11,
    FORMULA_TYPE_SIN = 12,
    FORMULA_TYPE_SQRT = 13,
    FORMULA_TYPE_TAN = 14,
    FORMULA_TYPE_VALUE = 15,
    FORMULA_TYPE_MIN = 16;

var APPROXIMATE_EPSILON = 1;
var APPROXIMATE_EPSILON2 = 3;
var APPROXIMATE_EPSILON3 = 5;

function clonePrototype(obj) {

    if(obj == null || typeof(obj) != 'object') {

        return obj;
    }

    if(obj.constructor == Array) {

        var clonedArray=[];
        for(var i=0; i < obj.length; ++i) {

            clonedArray[i] = clone(obj[i]);
        }
        return clonedArray;
    }

    var clonedObj = {};
    for( var key in obj ) {

        clonedObj[key] = clonePrototype(obj[key]);
    }
    return clonedObj;
}

function CalculateGuideValue(name, formula, x, y, z, gdLst)
{
    var xt, yt, zt;

    xt=gdLst[x];  //TODO : возможно, что gdLst[x] еще не расчитан
    if(xt===undefined)
        xt=parseInt(x,10);

    yt=gdLst[y];
    if(yt===undefined)
        yt=parseInt(y,10);

    zt=gdLst[z];
    if(zt===undefined)
        zt=parseInt(z,10);

    switch(formula)
    {
        case FORMULA_TYPE_MULT_DIV:
        {
            gdLst[name]=xt*yt/zt;
            break;
        }
        case FORMULA_TYPE_PLUS_MINUS:
        {
            gdLst[name] = xt+yt-zt;
            break;
        }
        case FORMULA_TYPE_PLUS_DIV:
        {
            gdLst[name] = (xt+yt)/zt;
            break;
        }
        case FORMULA_TYPE_IF_ELSE:
        {
            if(xt>0)
                gdLst[name] = yt;
            else
                gdLst[name] = zt;
            break;
        }

        case FORMULA_TYPE_ABS:
        {
            gdLst[name] = Math.abs(xt);
            break;
        }
        case FORMULA_TYPE_AT2:
        {
            gdLst[name] = ATan2(yt, xt);
            break;
        }
        case FORMULA_TYPE_CAT2:
        {
            gdLst[name] = CAt2(xt,yt,zt);
            break;
        }

        case FORMULA_TYPE_COS:
        {
            gdLst[name] = xt*Cos(yt);
            break;
        }

        case FORMULA_TYPE_MAX:
        {
            gdLst[name] = Math.max(xt, yt);
            break;
        }

        case FORMULA_TYPE_MOD:
        {
            gdLst[name] = Math.sqrt(xt*xt+yt*yt+zt*zt);
            break;
        }

        case FORMULA_TYPE_PIN:
        {
            if (yt < xt)
                gdLst[name] = xt;
            else if (yt > zt)
                gdLst[name] = zt;
            else
                gdLst[name] = yt;
            break;
        }
        case FORMULA_TYPE_SAT2:
        {
            gdLst[name] = SAt2(xt,yt,zt);
            break;
        }
        case FORMULA_TYPE_SIN:
        {
            gdLst[name] = xt*Sin(yt);
            break;
        }
        case FORMULA_TYPE_SQRT:
        {
            gdLst[name] = Math.sqrt(xt);
            break;
        }

        case FORMULA_TYPE_TAN:
        {
            gdLst[name] = xt*Tan(yt);
            break;
        }
        case FORMULA_TYPE_VALUE:
        {
            gdLst[name] = xt;
            break;
        }
        case FORMULA_TYPE_MIN:
        {
            gdLst[name] = Math.min(xt, yt);
        }

    }
}

function CalculateGuideLst(gdLstInfo, gdLst)
{
    var info;
    for(var i=0, n=gdLstInfo.length; i<n;i++)
    {
        info=gdLstInfo[i];
        CalculateGuideValue(info.name, info.formula, info.x, info.y, info.z, gdLst);
    }

}

function CalculateCnxLst(cnxLstInfo, cnxLst, gdLst)
{
    var x_, y_, ang_;
    for(var i=0, n=cnxLstInfo.length; i<n;i++)
    {
        ang_=parseInt(cnxLstInfo[i].ang);
        if(isNaN(ang_))
            ang_=gdLst[cnxLstInfo[i].ang];


        x_=gdLst[cnxLstInfo[i].x];
        if(x_===undefined)
            x_=parseInt(cnxLstInfo[i].x);


        y_=gdLst[cnxLstInfo[i].y];
        if(y_===undefined)
            y_=parseInt(cnxLstInfo[i].y);

        if(cnxLst[i]==undefined)
            cnxLst[i]={};

        cnxLst[i].ang=ang_;
        cnxLst[i].x=x_;
        cnxLst[i].y=y_;
    }
}

function CalculateAhXYList(ahXYListInfo, ahXYLst, gdLst)
{
    var  minX, maxX, minY, maxY, posX, posY;
    for(var i=0, n=ahXYListInfo.length; i<n;i++)
    {

        minX=parseInt(ahXYListInfo[i].minX);
        if(isNaN(minX))
            minX=gdLst[ahXYListInfo[i].minX];

        maxX=parseInt(ahXYListInfo[i].maxX);
        if(isNaN(maxX))
            maxX=gdLst[ahXYListInfo[i].maxX];


        minY=parseInt(ahXYListInfo[i].minY);
        if(isNaN(minY))
            minY=gdLst[ahXYListInfo[i].minY];

        maxY=parseInt(ahXYListInfo[i].maxY);
        if(isNaN(maxY))
            maxY=gdLst[ahXYListInfo[i].maxY];


        posX=parseInt(ahXYListInfo[i].posX);
        if(isNaN(posX))
        {
            posX=gdLst[ahXYListInfo[i].posX];
        }

        posY=parseInt(ahXYListInfo[i].posY);
        if(isNaN(posY))
        {
            posY=gdLst[ahXYListInfo[i].posY];
        }


        if(ahXYLst[i]==undefined)
            ahXYLst[i]={};

        ahXYLst[i].gdRefX=ahXYListInfo[i].gdRefX;
        ahXYLst[i].minX= minX;
        ahXYLst[i].maxX= maxX;

        ahXYLst[i].gdRefY=ahXYListInfo[i].gdRefY;
        ahXYLst[i].minY= minY;
        ahXYLst[i].maxY= maxY;

        ahXYLst[i].posX= posX;
        ahXYLst[i].posY= posY;

    }
}

function CalculateAhPolarList(ahPolarListInfo, ahPolarLst, gdLst)
{
    var  minR, maxR, minAng, maxAng, posX, posY;
    for(var i=0, n=ahPolarListInfo.length; i<n;i++)
    {

        minR=parseInt(ahPolarListInfo[i].minR);
        if(isNaN(minR))
            minR=gdLst[ahPolarListInfo[i].minR];

        maxR=parseInt(ahPolarListInfo[i].maxR);
        if(isNaN(maxR))
            maxR=gdLst[ahPolarListInfo[i].maxR];


        minAng=parseInt(ahPolarListInfo[i].minAng);
        if(isNaN(minAng))
            minAng=gdLst[ahPolarListInfo[i].minAng];

        maxAng=parseInt(ahPolarListInfo[i].maxAng);
        if(isNaN(maxAng))
            maxAng=gdLst[ahPolarListInfo[i].maxAng];


        posX=parseInt(ahPolarListInfo[i].posX);
        if(isNaN(posX))
        {
            posX=gdLst[ahPolarListInfo[i].posX]
        }

        posY=parseInt(ahPolarListInfo[i].posY);
        if(isNaN(posY))
        {
            posY=gdLst[ahPolarListInfo[i].posY];
        }


        if(ahPolarLst[i]==undefined)
        {
            ahPolarLst[i]={};
        }
        ahPolarLst[i].gdRefR=ahPolarListInfo[i].gdRefR;
        ahPolarLst[i].minR = minR;
        ahPolarLst[i].maxR = maxR;

        ahPolarLst[i].gdRefAng = ahPolarListInfo[i].gdRefAng;
        ahPolarLst[i].minAng = minAng;
        ahPolarLst[i].maxAng = maxAng;

        ahPolarLst[i].posX=posX;
        ahPolarLst[i].posY=posY;

    }
}

function CGeometry()
{
    this.gdLstInfo=[];
    this.gdLst={};

    this.avLst = {};

    this.cnxLstInfo=[];
    this.cnxLst=[];

    this.ahXYLstInfo=[];
    this.ahXYLst=[];

    this.ahPolarLstInfo=[];
    this.ahPolarLst=[];

    this.pathLst = [];

    this.isLine = false;
    this.preset = null;

    this.createDuplicate = function()
    {
        var duplicate = new CGeometry();
        for(var i = 0; i < this.gdLstInfo.length; ++i)
        {
            duplicate.gdLstInfo[i] = clonePrototype(this.gdLstInfo[i]);
        }
        duplicate.gdLst = clonePrototype(this.gdLst);

        for(i = 0; i < this.cnxLstInfo.length; ++i)
        {
            duplicate.cnxLstInfo[i] = clonePrototype(this.cnxLstInfo[i]) ;
        }

        for(i = 0; i < this.cnxLst.length; ++i)
        {
            duplicate.cnxLst[i] = clonePrototype(this.cnxLst[i]);
        }

        for(i = 0; i < this.ahXYLstInfo.length; ++i)
        {
            duplicate.ahXYLstInfo[i] = clonePrototype(this.ahXYLstInfo[i]);
        }

        for(i = 0; i < this.ahXYLst.length; ++i)
        {
            duplicate.ahXYLst[i] = clonePrototype(this.ahXYLst[i]);
        }

        for(i = 0; i < this.ahPolarLstInfo.length; ++i)
        {
            duplicate.ahPolarLstInfo[i] = clonePrototype(this.ahPolarLstInfo[i]);
        }

        for(i = 0; i < this.ahPolarLst.length; ++i)
        {
            duplicate.ahPolarLst[i] = clonePrototype(this.ahPolarLst[i]);
        }

        for(i = 0; i < this.pathLst.length; ++i)
        {
            duplicate.pathLst[i] = this.pathLst[i].createDuplicate();
        }

        for (var i in this.avLst)
        {
            duplicate.avLst[i] = this.avLst[i];
        }

        duplicate.rectS = clonePrototype(this.rectS);
        duplicate.rect = clonePrototype(this.rect);

        duplicate.isLine = this.isLine;
        duplicate.preset = this.preset;

        return duplicate;
    };



    this.createDuplicateForTrack = function()
    {
        var _duplicate = new Geometry();
        _duplicate.gdLst["_3cd4"] = 16200000;
        _duplicate.gdLst["_3cd8"] = 8100000;
        _duplicate.gdLst["_5cd8"] = 13500000;
        _duplicate.gdLst["_7cd8"] = 18900000;
        _duplicate.gdLst["cd2"] = 10800000;
        _duplicate.gdLst["cd4"] = 5400000;
        _duplicate.gdLst["cd8"] = 2700000;
        _duplicate.gdLst["l"] = 0;
        _duplicate.gdLst["t"] = 0;
        var _adj_key;
        for(_adj_key in this.avLst)
        {
            if(this.avLst[_adj_key] === true)
            {
                _duplicate.gdLst[_adj_key] = this.gdLst[_adj_key];
            }
        }
        var _gd_index;
        var _cur_guide;
        var _duplicate_guide;
        var _gd_count = this.gdLstInfo.length;
        for(_gd_index = 0; _gd_index < _gd_count; ++_gd_index)
        {
            _cur_guide = this.gdLstInfo[_gd_index];
            _duplicate_guide = {};
            _duplicate_guide.name = _cur_guide.name;
            _duplicate_guide.formula = _cur_guide.formula;
            _duplicate_guide.x = _cur_guide.x;
            _duplicate_guide.y = _cur_guide.y;
            _duplicate_guide.z = _cur_guide.z;
            _duplicate_guide.isAdj = _cur_guide.isAdj;
            _duplicate.gdLstInfo.push(_duplicate_guide);
        }
        var _path_index;
        for(_path_index = 0; _path_index < this.pathLst.length; ++_path_index)
        {
            _duplicate.pathLst[_path_index] = this.pathLst[_path_index].createDuplicate();
        }
        var _ah_index;
        var _adjustment;
        var _duplicate_adj;
        for(_ah_index = 0; _ah_index < this.ahXYLstInfo.length; ++_ah_index)
        {
            _adjustment = this.ahXYLstInfo[_ah_index];
            _duplicate_adj = {};
            _duplicate_adj.gdRefX = _adjustment.gdRefX;
            _duplicate_adj.gdRefY = _adjustment.gdRefY;
            _duplicate_adj.maxX = _adjustment.maxX;
            _duplicate_adj.minX = _adjustment.minX;
            _duplicate_adj.maxY = _adjustment.maxY;
            _duplicate_adj.minY = _adjustment.minY;
            _duplicate_adj.posX = _adjustment.posX;
            _duplicate_adj.posY = _adjustment.posY;
            _duplicate.ahXYLstInfo.push(_duplicate_adj);
        }
        for(_ah_index = 0; _ah_index < this.ahPolarLstInfo.length; ++_ah_index)
        {
            _adjustment = this.ahPolarLstInfo[_ah_index];
            _duplicate_adj = {};
            _duplicate_adj.gdRefR = _adjustment.gdRefR;
            _duplicate_adj.gdRefAng = _adjustment.gdRefAng;
            _duplicate_adj.maxR = _adjustment.maxR;
            _duplicate_adj.minR = _adjustment.minR;
            _duplicate_adj.maxAng = _adjustment.maxAng;
            _duplicate_adj.minAng = _adjustment.minAng;
            _duplicate_adj.posX = _adjustment.posX;
            _duplicate_adj.posY = _adjustment.posY;
            _duplicate.ahPolarLstInfo.push(_duplicate_adj);
        }
        _duplicate.isLine = this.isLine;
        return _duplicate;
    };


}

CGeometry.prototype=
{
    Write_ToBinary: function(Writer)
    {

    },

    canFill: function()
    {
        if(this.preset === "line")
            return false;
        for(var i = 0; i < this.pathLst.length; ++i)
        {
            if(this.pathLst[i].fill !== "none")
                return true;
        }
        return  false;
    },

    Write_ToBinary2: function(Writer)
    {
        var w = Writer;

        var count = 0;
        for(var key in this.avLst)
        {
            ++count;
        }
        w.WriteLong(count);
        var gd_lst_info_count = this.gdLstInfo.length;
        Writer.WriteLong(gd_lst_info_count);

        var bool;
        for(var index = 0; index < gd_lst_info_count; ++index)
        {
            var g = this.gdLstInfo[index];
            w.WriteString2(g.name);
            w.WriteLong(g.formula);
            bool = typeof g.x === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(g.x);


            bool = typeof g.y === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(g.y);

            bool = typeof g.z === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(g.z);

        }

        WriteObjectLong(w, this.gdLst);
        for(key in this.avLst)
        {
            w.WriteString2(key);
        }


        var cnx_lst_count = this.cnxLstInfo.length;
        Writer.WriteLong(cnx_lst_count);
        for(index = 0; index < cnx_lst_count; ++index)
        {
            WriteObjectString(Writer, this.cnxLstInfo[index]);
        }



        var ah_xy_count = this.ahXYLstInfo.length;
        Writer.WriteLong(ah_xy_count);
        for(index = 0; index < ah_xy_count; ++index)
        {
            var o = this.ahXYLstInfo[index];
            bool = typeof  o.gdRefX === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.gdRefX);


            bool = typeof  o.gdRefY === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.gdRefY);

            bool = typeof  o.minX === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.minX);

            bool = typeof  o.maxX === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.maxX);


            bool = typeof  o.minY === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.minY);

            bool = typeof  o.maxY === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.maxY);

            bool = typeof  o.posX === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.posX);


            bool = typeof  o.posY === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.posY);
        }


        var ah_polar_count = this.ahPolarLstInfo.length;
        Writer.WriteLong(ah_polar_count);
        for(index = 0; index < ah_polar_count; ++index)
        {
            o = this.ahPolarLstInfo[index];
            bool = typeof  o.gdRefR === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.gdRefR);


            bool = typeof  o.gdRefAng === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.gdRefAng);

            bool = typeof  o.minR === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.minR);

            bool = typeof  o.maxR === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.maxR);


            bool = typeof  o.minAng === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.minAng);

            bool = typeof  o.maxAng === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.maxAng);

            bool = typeof  o.posX === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.posX);


            bool = typeof  o.posY === "string";
            w.WriteBool(bool);
            if(bool)
                w.WriteString2(o.posY);
        }


        var path_count = this.pathLst.length;
        Writer.WriteLong(path_count);
        for(index = 0; index < path_count; ++index)
        {
            this.pathLst[index].Write_ToBinary2(Writer);
        }

        Writer.WriteBool(typeof  this.preset === "string");
        if(typeof  this.preset === "string")
        {
            Writer.WriteString2(this.preset);
        }
        WriteObjectString(Writer, this.rectS);
        WriteObjectDouble(Writer, this.rect);
    },

    Read_FromBinary2: function(Reader)
    {
        var r = Reader;

        var count = r.GetLong();
        for(index = 0; index < count; ++index)
        {
            this.avLst[r.GetString2()] = true;
        }
        var gd_lst_info_count = Reader.GetLong();
        for(var index = 0; index < gd_lst_info_count; ++index)
        {
            var gd_info = {};
            gd_info.name = r.GetString2();
            gd_info.formula = r.GetLong();
            if(r.GetBool())
                gd_info.x = r.GetString2();

            if(r.GetBool())
                gd_info.y = r.GetString2();

            if(r.GetBool())
                gd_info.z = r.GetString2();

            this.gdLstInfo.push(gd_info);
        }


        this.gdLst = ReadObjectLong(r);


        var cnx_lst_count = Reader.GetLong();
        for(index = 0; index < cnx_lst_count; ++index)
        {
            this.cnxLstInfo[index] = ReadObjectString(Reader);
        }

        var ah_xy_count = Reader.GetLong();
        for(index = 0; index < ah_xy_count; ++index)
        {
            var o = {};
            if(r.GetBool())
                o.gdRefX = r.GetString2();

            if(r.GetBool())
                o.gdRefY = r.GetString2();

            if(r.GetBool())
                o.minX = r.GetString2();


            if(r.GetBool())
                o.maxX = r.GetString2();

            if(r.GetBool())
                o.minY = r.GetString2();

            if(r.GetBool())
                o.maxY = r.GetString2();

            if(r.GetBool())
                o.posX = r.GetString2();

            if(r.GetBool())
                o.posY = r.GetString2();
            this.ahXYLstInfo.push(o);
        }



        var ah_polar_count = Reader.GetLong();
        for(index = 0; index < ah_polar_count; ++index)
        {
            o = {};
            if(r.GetBool())
                o.gdRefR = r.GetString2();

            if(r.GetBool())
                o.gdRefAng = r.GetString2();

            if(r.GetBool())
                o.minR = r.GetString2();


            if(r.GetBool())
                o.maxR = r.GetString2();

            if(r.GetBool())
                o.minAng = r.GetString2();

            if(r.GetBool())
                o.maxAng = r.GetString2();

            if(r.GetBool())
                o.posX = r.GetString2();

            if(r.GetBool())
                o.posY = r.GetString2();
            this.ahPolarLstInfo.push(o);
        }

        var path_count = Reader.GetLong();
        for(index = 0; index < path_count; ++index)
        {
            this.pathLst[index] = new Path();
            this.pathLst[index].Read_FromBinary2(Reader);
        }
        if(r.GetBool())
        {
            this.preset = r.GetString2();
        }
        this.rectS = ReadObjectString(r);
        this.rect = ReadObjectDouble(r);
    },

    AddAdj: function(name, formula, x, y, z)
    {
        this.gdLst[name] = parseInt(x);
        this.avLst[name]=true;
    },

    AddGuide: function(name, formula, x, y, z)
    {
        this.gdLstInfo.push(
            {
                name: name,
                formula: formula,
                x: x,
                y: y,
                z: z,
                isAdj: false
            });
    },

    AddCnx: function(ang, x, y)
    {
        this.cnxLstInfo.push(
            {
                ang:ang,
                x:x,
                y:y
            });
    },

    AddHandleXY: function(gdRefX, minX, maxX, gdRefY, minY, maxY, posX, posY)
    {
        this.ahXYLstInfo.push(
            {
                gdRefX:gdRefX,
                minX:minX,
                maxX:maxX,

                gdRefY:gdRefY,
                minY:minY,
                maxY:maxY,

                posX:posX,
                posY:posY
            });
    },

    AddHandlePolar: function(gdRefAng, minAng, maxAng, gdRefR, minR, maxR, posX, posY)
    {
        this.ahPolarLstInfo.push(
            {
                gdRefAng:gdRefAng,
                minAng:minAng,
                maxAng:maxAng,

                gdRefR:gdRefR,
                minR:minR,
                maxR:maxR,

                posX:posX,
                posY:posY
            })
    },

    AddPathCommand: function(command, x1, y1, x2, y2, x3, y3)
    {
        switch(command)
        {
            case 0:
            {                              /* extrusionOk, fill, stroke, w, h*/
                this.pathLst[this.pathLst.length] = new Path(x1, y1, x2, y2, x3);
                break;
            }
            case 1:
            {
                this.pathLst[this.pathLst.length-1].moveTo(x1, y1);
                break;
            }
            case 2:
            {
                this.pathLst[this.pathLst.length-1].lnTo(x1, y1);
                break;
            }
            case 3:
            {
                this.pathLst[this.pathLst.length-1].arcTo(x1/*wR*/, y1/*hR*/, x2/*stAng*/, y2/*swAng*/);
                break;
            }
            case 4:
            {
                this.pathLst[this.pathLst.length-1].quadBezTo(x1, y1, x2, y2);
                break;
            }
            case 5:
            {
                this.pathLst[this.pathLst.length-1].cubicBezTo(x1, y1, x2, y2, x3, y3);
                break;
            }
            case 6:
            {
                this.pathLst[this.pathLst.length-1].close();
            }
        }
    },

    AddRect: function(l, t, r, b)
    {
        this.rectS = {};
        this.rectS.l = l;
        this.rectS.t = t;
        this.rectS.r = r;
        this.rectS.b = b;
    },

    Init: function(w, h)
    {
        this.gdLst["_3cd4"]=16200000;
        this.gdLst["_3cd8"]=8100000;
        this.gdLst["_5cd8"]=13500000;
        this.gdLst["_7cd8"]=18900000;
        this.gdLst["cd2"]=10800000;
        this.gdLst["cd4"]=5400000;
        this.gdLst["cd8"]=2700000;
        this.gdLst["l"]=0;
        this.gdLst["t"]=0;
        this.gdLst["h"]=h;
        this.gdLst["b"]=h;
        this.gdLst["hd2"]=h/2;
        this.gdLst["hd3"]=h/3;
        this.gdLst["hd4"]=h/4;
        this.gdLst["hd5"]=h/5;
        this.gdLst["hd6"]=h/6;
        this.gdLst["hd8"]=h/8;
        this.gdLst["hd10"]=h/10;
        this.gdLst["hd12"]=h/12;
        this.gdLst["hd32"]=h/32;
        this.gdLst["vc"]=h/2;
        this.gdLst["w"]=w;
        this.gdLst["r"]=w;
        this.gdLst["wd2"]=w/2;
        this.gdLst["wd3"]=w/3;
        this.gdLst["wd4"]=w/4;
        this.gdLst["wd5"]=w/4;
        this.gdLst["wd6"]=w/6;
        this.gdLst["wd8"]=w/8;
        this.gdLst["wd10"]=w/10;
        this.gdLst["wd12"]=w/12;
        this.gdLst["wd32"]=w/32;
        this.gdLst["hc"]=w/2;
        this.gdLst["ls"]=Math.max(w,h);
        this.gdLst["ss"]=Math.min(w,h);
        this.gdLst["ssd2"]=this.gdLst["ss"]/2;
        this.gdLst["ssd4"]=this.gdLst["ss"]/4;
        this.gdLst["ssd6"]=this.gdLst["ss"]/6;
        this.gdLst["ssd8"]=this.gdLst["ss"]/8;
        this.gdLst["ssd16"]=this.gdLst["ss"]/16;
        this.gdLst["ssd32"]=this.gdLst["ss"]/32;
        CalculateGuideLst(this.gdLstInfo, this.gdLst);
        CalculateCnxLst(this.cnxLstInfo, this.cnxLst, this.gdLst);
        CalculateAhXYList(this.ahXYLstInfo, this.ahXYLst, this.gdLst);
        CalculateAhPolarList(this.ahPolarLstInfo, this.ahPolarLst, this.gdLst);
        for(var i=0, n=this.pathLst.length; i<n; i++)
            this.pathLst[i].init(this.gdLst);
        if(this.rectS!=undefined)
        {
            this.rect={};
            this.rect.l=this.gdLst[this.rectS.l];
            if(this.rect.l===undefined)
            {
                this.rect.l=parseInt(this.rectS.l);
            }

            this.rect.t=this.gdLst[this.rectS.t];
            if(this.rect.t===undefined)
            {
                this.rect.t=parseInt(this.rectS.t);
            }

            this.rect.r=this.gdLst[this.rectS.r];
            if(this.rect.r===undefined)
            {
                this.rect.r=parseInt(this.rectS.r);
            }

            this.rect.b=this.gdLst[this.rectS.b];
            if(this.rect.b===undefined)
            {
                this.rect.b=parseInt(this.rectS.b);
            }
        }
    },

    Recalculate: function(w, h)
    {
        this.gdLst["h"]=h;
        this.gdLst["b"]=h;
        this.gdLst["hd2"]=h*0.5;
        this.gdLst["hd3"]=h*0.3333;
        this.gdLst["hd4"]=h*0.25;
        this.gdLst["hd5"]=h*0.2;
        this.gdLst["hd6"]=h*0.1666666;
        this.gdLst["hd8"]=h*0.125;
        this.gdLst["hd10"]=h*0.1;
        this.gdLst["hd12"]=h/12;
        this.gdLst["hd32"]=h/32;
        this.gdLst["vc"]=h*0.5;
        this.gdLst["w"]=w;
        this.gdLst["r"]=w;
        this.gdLst["wd2"]=w*0.5;
        this.gdLst["wd3"]=w/3;
        this.gdLst["wd4"]=w*0.25;
        this.gdLst["wd5"]=w*0.2;
        this.gdLst["wd6"]=w*0.166666;
        this.gdLst["wd8"]=w*0.125;
        this.gdLst["wd10"]=w*0.1;
        this.gdLst["wd12"]=w/12;
        this.gdLst["wd32"]=w*0.03125;
        this.gdLst["hc"]=w*0.5;
        this.gdLst["ls"]=Math.max(w,h);
        this.gdLst["ss"]=Math.min(w,h);
        this.gdLst["ssd2"]=this.gdLst["ss"]*0.5;
        this.gdLst["ssd4"]=this.gdLst["ss"]*0.25;
        this.gdLst["ssd6"]=this.gdLst["ss"]*0.166666;
        this.gdLst["ssd8"]=this.gdLst["ss"]*0.125;
        this.gdLst["ssd16"]=this.gdLst["ss"]*0.0625;
        this.gdLst["ssd32"]=this.gdLst["ss"]*0.03125;
        CalculateGuideLst(this.gdLstInfo, this.gdLst);
        CalculateCnxLst(this.cnxLstInfo, this.cnxLst, this.gdLst);
        CalculateAhXYList(this.ahXYLstInfo, this.ahXYLst, this.gdLst);
        CalculateAhPolarList(this.ahPolarLstInfo, this.ahPolarLst, this.gdLst);
        for(var i=0, n=this.pathLst.length; i<n; i++)
            this.pathLst[i].recalculate(this.gdLst);

        if(this.rectS!=undefined)
        {
            this.rect={};
            this.rect.l=this.gdLst[this.rectS.l];
            if(this.rect.l===undefined)
            {
                this.rect.l=parseInt(this.rectS.l);
            }

            this.rect.t=this.gdLst[this.rectS.t];
            if(this.rect.t===undefined)
            {
                this.rect.t=parseInt(this.rectS.t);
            }

            this.rect.r=this.gdLst[this.rectS.r];
            if(this.rect.r===undefined)
            {
                this.rect.r=parseInt(this.rectS.r);
            }

            this.rect.b=this.gdLst[this.rectS.b];
            if(this.rect.b===undefined)
            {
                this.rect.b=parseInt(this.rectS.b);
            }
        }
    },

    /*
     draw: function(graphics, line_color, line_width, fill_color, alpha, fillAlpha, lineAlpha)
     {
     //graphics.m_oContext.shadowOffsetX = shadow.length*Math.cos(shadow.angle)*100/(g_dKoef_pix_to_mm*zoom);
     //graphics.m_oContext.shadowOffsetY = shadow.length*Math.sin(shadow.angle)*100/(g_dKoef_pix_to_mm*zoom);
     //graphics.m_oContext.shadowBlur = shadow.blur;
     //graphics.m_oContext.shadowColor = shadow.color.norm(shadow.alpha);
     graphics.p_width(line_width);
     for(var i=0, n=this.pathLst.length; i<n;++i)
     this.pathLst[i].draw(graphics, line_color, line_width, fill_color, alpha, fillAlpha*255, lineAlpha*255);
     //if(shadow.length>0||shadow.blur>0)
     //{
     //    graphics.m_oContext.shadowOffsetX = 0;
     //    graphics.m_oContext.shadowOffsetY = 0;
     //    graphics.m_oContext.shadowBlur = 0;
     //    graphics.m_oContext.shadowColor = 0;
     //    graphics.p_width(line_width*10000/(g_dKoef_pix_to_mm*zoom));
     //    for(i=0; i<n;++i)
     //       this.pathLst[i].draw(graphics, line_color, line_width, fill_color, alpha, fillAlpha*255, lineAlpha*255);
     //}
     },
     */

    draw: function(shape_drawer)
    {
        for (var i=0, n=this.pathLst.length; i<n;++i)
            this.pathLst[i].draw(shape_drawer);
    },

    check_bounds: function(checker)
    {
        for(var i=0, n=this.pathLst.length; i<n;++i)
            this.pathLst[i].check_bounds(checker);
    },

    drawAdjustments: function(drawingDocument, transform)
    {
        var _adjustments = this.ahXYLst;
        var _adj_count = _adjustments.length;
        var _adj_index;
        for(_adj_index = 0; _adj_index < _adj_count; ++_adj_index)
            drawingDocument.DrawAdjustment(transform, _adjustments[_adj_index].posX, _adjustments[_adj_index].posY);

        _adjustments = this.ahPolarLst;
        _adj_count = _adjustments.length;
        for(_adj_index = 0; _adj_index < _adj_count; ++_adj_index)
            drawingDocument.DrawAdjustment(transform, _adjustments[_adj_index].posX, _adjustments[_adj_index].posY);
    },

    hitToPath: function(hitCanvasContext, x, y)
    {
        return false;
    },


    setPolarAdjustments: function(refR, rValue, refAng, angValue)
    {
        var history_data;
        if(typeof refR === "string" && typeof this.gdLst[refR] === "number" && typeof rValue === "number")
        {
            history_data = {};
            history_data.Type = historyitem_SetGuideValue;
            history_data.guideName = refR;
            history_data.oldGdValue = this.gdLst[refR];
            history_data.newGdValue = rValue;
            History.Add(this, history_data);
            this.gdLst[refR] = rValue;
        }
        if( typeof refAng === "string" && typeof this.gdLst[refAng] === "number" && typeof angValue === "number")
        {
            history_data = {};
            history_data.Type = historyitem_SetGuideValue;
            history_data.guideName = refAng;
            history_data.oldGdValue = this.gdLst[refAng];
            history_data.newGdValue = angValue;
            History.Add(this, history_data);
            this.gdLst[refAng] = angValue;
        }

    },

    setXYAdjustments: function(refX, xValue, refY, yValue)
    {
        var history_data;
        if(typeof refX === "string" && typeof this.gdLst[refX] === "number" && typeof xValue === "number")
        {
            history_data = {};
            history_data.Type = historyitem_SetGuideValue;
            history_data.guideName = refX;
            history_data.oldGdValue = this.gdLst[refX];
            history_data.newGdValue = xValue;
            History.Add(this, history_data);

            this.gdLst[refX] = xValue;
        }
        if( typeof refY === "string" && typeof this.gdLst[refY] === "number" && typeof yValue === "number")
        {
            history_data = {};
            history_data.Type = historyitem_SetGuideValue;
            history_data.guideName = refY;
            history_data.refAng = refY;
            history_data.oldGdValue = this.gdLst[refY];
            history_data.newGdValue = yValue;
            History.Add(this, history_data);

            this.gdLst[refY] = yValue;
        }

    },

    setGuideValue: function(gdRef, gdValue, model_id)
    {
        if(isRealNumber(this.gdLst[gdRef]))
        {
            History.Add(g_oUndoRedoDrawingObject, historyitem_AutoShapes_SetGuideValue, model_id, null, {object: this, data:{ gdRef: gdRef, oldValue: this.gdLst[gdRef], newValue: gdValue}});
            this.gdLst[gdRef] = gdValue;
        }
    },


    Save_Changes: function(data, writer)
    {
        writer.WriteLong(historyitem_type_Geometry);
        writer.WriteLong(data.Type);
        switch (data.Type)
        {
            case historyitem_SetGuideValue:
            {
                writer.WriteString2(data.guideName);
                writer.WriteDouble(data.newGdValue);
                break;
            }
        }
    },

    Load_Changes: function(reader)
    {
        var type = reader.GetLong();
        switch (type)
        {
            case historyitem_SetGuideValue:
            {
                var name = reader.GetString2();
                this.gdLst[name] = reader.GetDouble();
                break;
            }
        }
    },

    Undo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SetGuideValue:
            {
                this.gdLst[data.guideName] = data.oldValue;
                break;
            }
        }
    },

    Redo: function(data)
    {
        switch(data.Type)
        {
            case historyitem_SetGuideValue:
            {
                this.gdLst[data.guideName] = data.newValue;
                break;
            }
        }
    },

    Save_Changes: function(data, writer)
    {},



    hit: function(x, y)
    {

    },

    hitInInnerArea: function(canvasContext, x, y)
    {
        var _path_list = this.pathLst;
        var _path_count = _path_list.length;
        var _path_index;
        for(_path_index = 0; _path_index < _path_count; ++_path_index)
        {
            if(_path_list[_path_index].hitInInnerArea(canvasContext, x, y) === true)
                return true;
        }
        return false;
    },

    hitInPath: function(canvasContext, x, y)
    {
        var _path_list = this.pathLst;
        var _path_count = _path_list.length;
        var _path_index;
        for(_path_index = 0; _path_index < _path_count; ++_path_index)
        {
            if(_path_list[_path_index].hitInPath(canvasContext, x, y) === true)
                return true;
        }
        return false;
    },

    hitToAdj: function(x, y, distanse)
    {
        var dx, dy;
        for(var i=0; i<this.ahXYLst.length; i++)
        {
            dx=x-this.ahXYLst[i].posX;
            dy=y-this.ahXYLst[i].posY;

            if(Math.sqrt(dx*dx+dy*dy) < distanse)
            {
                return {hit: true, adjPolarFlag: false, adjNum: i};
            }
        }

        for( i=0; i<this.ahPolarLst.length; i++)
        {
            dx=x-this.ahPolarLst[i].posX;
            dy=y-this.ahPolarLst[i].posY;

            if(Math.sqrt(dx*dx+dy*dy) < distanse)
            {
                return {hit: true, adjPolarFlag: true, adjNum: i};
            }
        }
        return {hit: false, adjPolarFlag: null, adjNum: null};
    },


    getArrayPolygons: function(epsilon)
    {
        var used_epsilon;
        if(typeof epsilon !== "number" || isNaN(epsilon))
            used_epsilon = APPROXIMATE_EPSILON;
        else
            used_epsilon = epsilon;
        var arr_polygons = [];
        var cur_polygon = [];
        for(var path_index = 0; path_index < this.pathLst.length; ++path_index)
        {
            var arr_cur_path_commands = this.pathLst[path_index].ArrPathCommand;
            var last_command = null, last_point_x = null, last_point_y = null;
            var first_point_x = null, first_point_y = null;
            var bezier_polygon = null;
            for(var command_index = 0; command_index < arr_cur_path_commands.length; ++command_index)
            {
                var cur_command = arr_cur_path_commands[command_index];
                switch(cur_command.id)
                {
                    case moveTo:
                    {
                        if(last_command === null || last_command.id === close)
                        {
                            cur_polygon.push({x: cur_command.X, y: cur_command.Y});
                            last_command = cur_command;
                            last_point_x = cur_command.X;
                            last_point_y = cur_command.Y;
                            first_point_x = cur_command.X;
                            first_point_y = cur_command.Y;
                        }
                        break;
                    }
                    case lineTo:
                    {
                        cur_polygon.push({x: cur_command.X, y: cur_command.Y});
                        last_command = cur_command;
                        last_point_x = cur_command.X;
                        last_point_y = cur_command.Y;
                        break;
                    }
                    case bezier3:
                    {
                        bezier_polygon = partition_bezier3(last_point_x, last_point_y, cur_command.X0, cur_command.Y0, cur_command.X1, cur_command.Y1, used_epsilon);
                        for(var point_index = 1; point_index < bezier_polygon.length; ++point_index)
                        {
                            cur_polygon.push(bezier_polygon[point_index]);
                        }
                        last_command = cur_command;
                        last_point_x = cur_command.X1;
                        last_point_y = cur_command.Y1;
                        break;
                    }
                    case bezier4:
                    {
                        bezier_polygon = partition_bezier4(last_point_x, last_point_y, cur_command.X0, cur_command.Y0, cur_command.X1, cur_command.Y1, cur_command.X2, cur_command.Y2, used_epsilon);
                        for(point_index = 1; point_index < bezier_polygon.length; ++point_index)
                        {
                            cur_polygon.push(bezier_polygon[point_index]);
                        }
                        last_command = cur_command;
                        last_point_x = cur_command.X2;
                        last_point_y = cur_command.Y2;
                        break;
                    }

                    case arcTo:
                    {
                        var path_accumulator = new PathAccumulator();
                        ArcToCurvers(path_accumulator, cur_command.stX, cur_command.stY, cur_command.wR, cur_command.hR, cur_command.stAng, cur_command.swAng);
                        var arc_to_path_commands = path_accumulator.pathCommand;
                        for(var arc_to_path_index = 0; arc_to_path_index < arc_to_path_commands.length; ++arc_to_path_index)
                        {
                            var cur_arc_to_command = arc_to_path_commands[arc_to_path_index];
                            switch (cur_arc_to_command.id)
                            {
                                case moveTo:
                                {
                                    cur_polygon.push({x: cur_arc_to_command.X, y: cur_arc_to_command.Y});
                                    last_command = cur_arc_to_command;
                                    last_point_x = cur_arc_to_command.X;
                                    last_point_y = cur_arc_to_command.Y;
                                    break;
                                }
                                case bezier4:
                                {
                                    bezier_polygon = partition_bezier4(last_point_x, last_point_y, cur_arc_to_command.X0, cur_arc_to_command.Y0, cur_arc_to_command.X1, cur_arc_to_command.Y1, cur_arc_to_command.X2, cur_arc_to_command.Y2, used_epsilon);
                                    for(point_index = 0; point_index < bezier_polygon.length; ++point_index)
                                    {
                                        cur_polygon.push(bezier_polygon[point_index]);
                                    }
                                    last_command = cur_arc_to_command;
                                    last_point_x = cur_arc_to_command.X2;
                                    last_point_y = cur_arc_to_command.Y2;
                                    break;
                                }
                            }
                        }
                        break;
                    }

                    case close:
                    {

                        if(last_command.id !== moveTo)
                        {
                            if(cur_polygon.length >= 2)
                            {
                                if(first_point_x !== null && first_point_y !== null)
                                {
                                    cur_polygon.push({x: first_point_x, y: first_point_y});
                                }
                                arr_polygons.push(cur_polygon);
                            }
                            cur_polygon = [];
                            last_command = cur_command;
                        }
                        break;
                    }
                }
            }
            if(cur_polygon.length >= 2)
            {
                /*if(first_point_x !== null && first_point_y !== null)
                {
                    cur_polygon.push({x: first_point_x, y: first_point_y});
                }             */
                arr_polygons.push(cur_polygon);
            }
        }
        return arr_polygons;
    },


    getBounds: function()
    {

    }
};

function WriteGdInfo(Writer, gdInfo)
{
    Writer.WriteString2(gdInfo.name);
    Writer.WriteLong(gdInfo.formula);

    var flag = typeof gdInfo.x === "string";
    Writer.WriteBool(flag);
    if(flag)
        Writer.WriteString2(gdInfo.x);
    else
        return;

    flag = typeof gdInfo.y === "string";
    Writer.WriteBool(flag);
    if(flag)
        Writer.WriteString2(gdInfo.y);
    else
        return;

    flag = typeof gdInfo.z === "string";
    Writer.WriteBool(flag);
    if(flag)
        Writer.WriteString2(gdInfo.z);
}

function ReadGdInfo(Reader)
{
    var ret = {};
    ret.name = Reader.GetString2();
    ret.formula = Reader.GetLong();

    if(Reader.GetBool())
        ret.x = Reader.GetString2();
    else
        return;

    if(Reader.GetBool())
        ret.y = Reader.GetString2();
    else
        return;

    if(Reader.GetBool())
        ret.z = Reader.GetString2();
}

function WriteObjectDouble(Writer, Object)
{
    var field_count = 0;
    for(var key in Object)
    {
        ++field_count;
    }
    Writer.WriteLong(field_count);
    for(key in Object)
    {
        Writer.WriteString2(key);
        Writer.WriteDouble(Object[key]);
    }
}

function ReadObjectDouble(Reader)
{
    var ret = {};
    var field_count = Reader.GetLong();
    for(var index =0; index < field_count; ++index)
    {
        var key = Reader.GetString2();
        ret[key] =  Reader.GetDouble();
    }
    return ret;
}


function WriteObjectString(Writer, Object)
{
    var field_count = 0;
    for(var key in Object)
    {
        ++field_count;
    }
    Writer.WriteLong(field_count);
    for(key in Object)
    {
        Writer.WriteString2(key);
        Writer.WriteString2(Object[key]);
    }
}

function ReadObjectString(Reader)
{
    var ret = {};
    var field_count = Reader.GetLong();
    for(var index = 0; index < field_count; ++index)
    {
        var key = Reader.GetString2();
        ret[key] = Reader.GetString2();
    }
    return ret;
}

function WriteObjectBool(Writer, Object)
{
    var field_count = 0;
    for(var key in Object)
    {
        ++field_count;
    }
    Writer.WriteLong(field_count);
    for(key in Object)
    {
        Writer.WriteString2(key);
        Writer.WriteBool(Object[key]);
    }
}

function ReadObjectBool(Reader)
{
    var ret = {};
    var field_count = Reader.GetLong();
    for(var index =0; index < field_count; ++index)
    {
        var key = Reader.GetString2();
        ret[key] = Reader.GetBool();
    }
    return ret;
}

function PathAccumulator()
{
    this.pathCommand = [];
}

PathAccumulator.prototype =
{
    _m: function(x, y)
    {
        this.pathCommand.push({id: moveTo, X: x, Y: y});
    },

    _c: function(x0, y0, x1, y1, x2, y2)
    {
        this.pathCommand.push({id: bezier4, X0: x0, Y0: y0, X1: x1, Y1: y1, X2: x2, Y2: y2});
    }
};

function GraphEdge(point1, point2)
{
    if(point1.y <= point2.y)
    {
        this.point1 = point1;
        this.point2 = point2;
    }
    else
    {
        this.point1 = point2;
        this.point2 = point1;
    }
}

GraphEdge.prototype =
{
    getIntersectionPointX : function(y)
    {
        if(this.point2.y < y || this.point1.y > y)
        {
            return null;
        }

        var ret = { x1 : +0, x2 : +0, count : 1 | 0 };
        if(this.point1.y === this.point2.y)
        {
            ret.count = 2;
            if(this.point1.x <= this.point2.x)
            {
                ret.x1 = this.point1.x;
                ret.x2 = this.point2.x;
                return ret;
            }
            else
            {
                ret.x1 = this.point2.x;
                ret.x2 = this.point1.x;
                return ret;
            }
        }
        else
        {
            if(!(this.point1.x === this.point2.x))
            {
                ret.x1 = this.point1.x + ((y -  this.point1.y)/(this.point2.y - this.point1.y))*(this.point2.x - this.point1.x);
                return ret;
            }
            else
            {
                ret.x1 = this.point1.x;
                return ret;
            }
        }
    }
};

function ComparisonEdgeByTopPoint(graphEdge1, graphEdge2)
{
    return Math.min(graphEdge1.point1.y, graphEdge1.point2.y) - Math.min(graphEdge2.point1.y, graphEdge2.point2.y);
}