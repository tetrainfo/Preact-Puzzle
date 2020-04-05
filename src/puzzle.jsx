import { Component } from 'preact';
export default class Puzzle extends Component {

    state = { 
        items: [],
        pieceMoved: 0,
        over: 0,
        stats: {count: 0, points: 0 }
       }

    componentDidMount( ) {
        //build the collection of pieces
        const x0=-0;
        const y0=-20;
        let { items } = this.state;
        let counter = 0;

        for (var i=0; i<= 4; i++){
            for (var j=0; j<=15; j++) {
                let item = {id: counter};
                counter++
                item.class = ""; 
                item.position ="background-position: " + (-j*49 + x0) + "px " + (-i*99 + y0) + "px";  
                items.push(item);  
            }
        }
        //shuffle the array and reassign the ids for access purposes to match the new array order
        //items = this.shuffle(items);
        this.setState({items});
    }



    drag = ( idx ) => {
        let { pieceMoved } = this.state;
        pieceMoved = idx;
        this.setState({pieceMoved});
    } 

    dragOver = (idx) => {
        this.setState( {over:idx} )
    }

    drop = ( ) => {
        let { pieceMoved, over } = this.state;
        let fromIdx = pieceMoved;
        let toIdx = over;
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

    promote = id => {
        let { items } = this.state;

        //ignore this promotion if its rank is 0. Invalid
        if ( id < 1 ){
            //Invalid
            return
        }

        //swap with item in front
        let promoted = items[ id ] ;
        let demoted = items[ id-1 ];
        let upstream = items[ id-2 ];
        if (!upstream) {
            upstream = {id: "-1"}
        }
        let upstreamId = upstream.id;

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

    //Shuffle pieces
    newGame = () => {
        let { items } = this.state;
        items.map( item => {
            
        })
        items = this.shuffle(items);

        this.setState({items});
    }
    
    render({ }, { items, itemStack, stats }) {
        return (
            <div>
                <div class="cardTable">
                    <h3 style="display:inline-block;">Puzzle</h3>
                    <button style="margin-left: 10px; margin:5px;" value="left" onClick={this.newGame}>Shuffle</button> 
                    <div class="inlineBlock stats"> &nbsp; Click or Drag to reorder </div>
                    <div class="container" onDragEnd={ () => this.drop()} >
                        { items.map( (item, idx) => ( 
                            <div  class="inlineBlock promote continuity"  >
                                <div style={item.position} draggable class= {item.class + " card frame picture"}  id={item.id} onClick={ () => this.promote(idx) } onDragStart={ () => this.drag(idx)}  onDragOver={ () => this.dragOver(idx)}> </div>
                            </div>
                        )) } 
                    </div> 
                </div>
                <div class="boxCover picture scaled"></div>
                <div>Todo: URL definable picture</div>
            </div>
        )
    }
}