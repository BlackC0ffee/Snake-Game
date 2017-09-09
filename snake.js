function getNeighbors (node){
    list = new Array();
    if (node.X !=0) { list.push( {X: node.X-1, Y: node.Y, Origin: node}) }
    if (node.Y !=0) { list.push( {X: node.X, Y: node.Y-1, Origin: node})}
    if (node.X !=columns) { list.push( {X: node.X+1, Y: node.Y, Origin: node})}
    if (node.Y !=rows) { list.push( {X: node.X, Y: node.Y+1, Origin: node})}
    return list;
}

function renderMap(main, size, rows, columns){
    while(main.hasChildNodes()){
        main.removeChild(main.lastChild);
    }
    main.style.overflow="table";
    for(y=0;y<=rows;y++){
        var row = document.createElement('div');
        row.id="y"+y;
        row.style.display="table-row";
        row.style.width = size * columns;
        for(x=0; x<=rows;x++) {
            var node = document.createElement('div');
            node.id = "x"+x+"y"+y;
            node.style.width = size+"px";
            node.style.height = size+"px";
            node.style.cssFloat = "left";
            row.appendChild(node);
        }
        main.appendChild(row);
    }
}

function GetPathNew(pawn, end, wall){
    var queue= new Array();
    var validated= new Array();

    queue.push(end);
    validated.push(end);

    while (queue.length != 0){
        var n = queue.shift();
        if(n.X== pawn.X && n.Y==pawn.Y){ break; }
        
        var neighbors=getNeighbors(n, wall);
        for (var i = 0; i < neighbors.length; i++) {
            if(!isInArray(wall, neighbors[i]) && !isInArray(validated, neighbors[i])){
                queue.push(list[i]);
                validated.push(list[i]);
            }
        }

    }

    var step = pawn;
    var path = new Array();
    path.push(pawn);

    while(true){
        for (i=0; i<validated.length; i++){
            if(validated[i].X == step.X && validated[i].Y == step.Y){
                path.push(validated[i].Origin);
                step=validated[i].Origin
                break;
            }
            if(i == validated.length-1) { return null ;} //path not found
        }
        if(step.X == end.X && step.Y == end.Y) { break; }
    }
    return path;
}

function isInArray (inputArray, val){
    for (var index = 0; index < inputArray.length; index++) {
        if(inputArray[index].X == val.X && inputArray[index].Y == val.Y){
            return true;
        }
    }
    return false;
}

function GetRandomNode(end, wall){
    if(wall === undefined) { wall = Array(); }
    if(end== undefined){
        return {X: Math.floor((Math.random() * columns) + 1), Y: Math.floor((Math.random() * rows) + 1)}
    }else{
        do{
            var x=Math.floor((Math.random() * columns) + 1);
            var y=Math.floor((Math.random() * rows) + 1);
        }while(isInArray(wall, {X: x, Y: y}))
        return {X: x, Y: y} 
    }
}

function game(){
    if(path==null){
        //debugger;

        pawn = Object.assign({ }, GetRandomNode(pawn), {Tail: new Array()});
        end = GetRandomNode(end, pawn.Tail);

        path=GetPathNew(pawn, end, pawn.Tail);

        renderMap(field, size, rows, columns);
        document.getElementById('x'+pawn.X+'y'+pawn.Y).style.backgroundColor = "black";
        document.getElementById('x'+end.X+'y'+end.Y).style.backgroundColor = "blue";
    }
    
    if(path.length == 0){
        end = GetRandomNode(end, pawn.Tail);
        document.getElementById('x'+end.X+'y'+end.Y).style.backgroundColor = "blue";

        path=GetPathNew(pawn, end, pawn.Tail); //retuns null if not found
        
        if(path==null) { return; } //Restarts the game

        pawn.Tail.push(node);
        path.shift();
    }
 
    pawn.Tail.push({X: pawn.X, Y: pawn.Y});
    node = pawn.Tail.shift();
    document.getElementById('x'+node.X+'y'+node.Y).style.background = "none";
    pawn = Object.assign(pawn, path.shift());
    document.getElementById('x'+pawn.X+'y'+pawn.Y).style.backgroundColor = "black";
    
}

function main(){
    field = document.getElementById('experiment');
    size = 5;
    rows = 49;
    columns = 49;
  
    //define globals
    pawn = null;
    end = null;
    path= null;

    play = window.setInterval(function(){ game(); }, 10);
}

