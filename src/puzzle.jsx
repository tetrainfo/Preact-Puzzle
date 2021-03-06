import { Component } from 'preact';
export default class Puzzle extends Component {
    
    graphic = ".jpg) top left no-repeat; "
    //picture properties: 784px wide by 547 high
    state = { 
        items: [],
        pieceMoved: 0,
        puzzles: ['puzzles/puzzle0.jpg','puzzles/puzzle1.jpg','puzzles/puzzle2.jpg','puzzles/puzzle3.jpg','puzzles/puzzle4.jpg', 'puzzles/puzzle5.jpg', 'puzzles/puzzle6.jpg', 'puzzles/puzzle7.jpg','puzzles/puzzle8.jpg','puzzles/puzzle9.jpg','puzzles/puzzle10.jpg','puzzles/puzzle11.jpg' ],
        boxCover: "background: url(puzzles/puzzle0" + this.graphic
       }

    setBoxCover = ( puzzleIndex ) => {
        //reset the image
        let {items} = this.state;
        let front = "";
        for (var i=0; i < items.length; i++){
            let pair = items[i].position.split('.');
            front = pair[0].replace(/[0-9]/g, '');
            items[i].position = front + puzzleIndex + "." + pair[1];
        }
          
        this.setState( { boxCover: front + puzzleIndex + this.graphic, items })
    }

    componentDidMount( ) {
        //build the collection of pieces
        const x0 = -0;
        const y0 = -20;
        const rowWidth = 99;
        const rows = 5;
        const colWidth= 49;
        const cols = 16;
        let { items, boxCover } = this.state;
        items = [];
        let counter = 0;
        for (var row=0; row < rows; row++){
            for ( var col = 0; col < cols; col++ ) {
                let item = {id: counter};
                counter++
                item.class = ""; 
                item.position = boxCover + "background-position: " + (-col * colWidth + x0) + "px " + (-row * rowWidth + y0) + "px";  
                items.push(item);  
            }
        }
        this.setState({items});
    }

    drag = ( idx ) => {
        let { pieceMoved } = this.state;
        pieceMoved = idx;
        this.setState({pieceMoved});
    } 

    dragOver = (idx) => {
        this.over = idx;
    }
    //shared variable avoids setting state triggering Render 200x
    over = 0

    drop = ( ) => {
        let toIdx = this.over;
        let { pieceMoved } = this.state;
        let fromIdx = pieceMoved;

        if ( fromIdx > toIdx ) {
            for (var i = fromIdx; i > toIdx; i-- ){
                this.promote(i);
            }
        }
        else {
            for (var i = fromIdx+1; i < toIdx+1; i++) {
                this.promote(i)
            }
        }

    }

    areAdjacent = ( id1, id2 ) => {
        let a = parseInt( id2, 10 );
        let b = parseInt( id1, 10 );
        //if the id match
        if( (a - b) == 1 ) {
            return true
        }
        return false
    }

    //promote this id  
    promote = id => {
        let { items } = this.state;

        //ignore this promotion if its rank is 0. Invalid
        if ( id < 1 ){
            //Invalid
            return
        }

        //get items
        let promoted = items[ id ] ;
        let demoted = items[ id-1 ];
        let upstream = items[ id-2 ];
        if (!upstream) {
            upstream = {id: "-1"}
        }
        let downstream = items [id + 1];
        if (!downstream) {
            downstream = {id:"-2"}
        }

        let upstreamId = upstream.id;
        let downstreamId = downstream.id;
        //swap with item in front
        items[ id ] = demoted;
        items[ id-1 ] = promoted;


        //determine if the demoted is adjacent and change class
        let demotedId = demoted.id;
        let promotedId = promoted.id;
        if ( this.areAdjacent( promotedId, demotedId ) ) {
            items[ id ].class = "adjacent";
        } 
        else {
            items[ id ].class = "";
        }
        if ( this.areAdjacent( upstreamId, promotedId ) ) {
            items[ id - 1 ].class = "adjacent";
        }
        else {
            items[ id - 1 ].class = "";
        }
        if (items[id+1]) {
            if ( this.areAdjacent( demotedId, downstreamId ) ) {
                items[ id + 1 ].class = "adjacent";
            }
            else {
                items[ id + 1 ].class = "";
            }
        }



        this.setState({items});
    }

    shuffle = items => {
        var currentIndex = items.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = items[currentIndex];
            items[currentIndex] = items[randomIndex];
            items[randomIndex] = temporaryValue;
        }
        return items;
    }

    //Scramble pieces
    newGame = () => {
        let { items } = this.state;
        items.map( item => {
            
        })
        items = this.shuffle(items);

        this.setState({items});
    }
    
    render({ }, { items, boxCover, puzzles }) {
        console.log("Render")
        return (
            <div>
                <div class="cardTable">
                    <h3 style="display:inline-block;">Puzzle</h3>
                    <button style="margin-left: 10px; margin:5px;" value="left" onClick={this.newGame}>Scramble</button> 
                    <div class="inlineBlock stats"> &nbsp; Click or Drag to reorder </div>
                    <div class="container" onDragEnd={ () => this.drop()} >
                        { items.map( (item, idx) => ( 
                            <div  class="inlineBlock promote continuity"  >
                                <div style={item.position} draggable class= {item.class + " card frame"}  id={item.id} onClick={ () => this.promote(idx) } onDragStart={ () => this.drag(idx)}  onDragOver={ () => this.dragOver(idx)}> </div>
                            </div>
                        )) } 
                    </div> 
                </div>
                <div style={boxCover} class="boxCover  scaled"></div>
                <div>
                    { puzzles.map( (puzzle, index) => (
                        <img src={puzzles[index]} width="100" class="promote button" onClick={() => this.setBoxCover(index)}/>
                    )) }
                </div>
            </div>
        )
    }
}