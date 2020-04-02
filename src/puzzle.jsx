import { Component } from 'preact';
export default class Puzzle extends Component {

    state = { 
        items: [],
        itemStack:[],
        stats: {count: 0, points: 0 }
       }

    componentDidMount( ) {
        //build the collection of pieces
        const x0=-0;
        const y0=-20;
        let { items, itemStack } = this.state;
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
        this.setState({items, itemStack});
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
        let { items, itemStack, stats } = this.state;

        //ignore this promotion if its rank is 0. Invalid
        if ( id < 1 ){
            //Invalid
            return
        }
        stats.count++;

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

        this.setState({items, itemStack, stats});
    }

    //not used, re used for reset
    newGame = () => {
        let { items, itemStack } = this.state;
        items.map( item => {
            
        })
        itemStack = [];
        items = this.shuffle(items);

        this.setState({items, itemStack});
    }
    
    render({ }, { items, itemStack, stats }) {
        return (
            <div>
                <div class="cardTable">
                    <h3 style="display:inline-block;">Puzzle</h3>
                    <button style="margin-left: 10px; margin:5px;" value="left" onClick={this.newGame}>Shuffle</button> 
                    <div class="inlineBlock stats"> &nbsp; Click to reorder: {stats.count} </div>
                    <div class="container">
                        { items.map( (item, idx) => ( 
                            <div class="inlineBlock promote continuity">
                                <div style={item.position} class= {item.class + " card frame picture"}  id={item.id} onClick={ () => this.promote(idx) } > 
                                </div>
                            </div>
                        )) } 
                    </div> 
                </div>
                <div class="boxCover picture scaled"></div>
                <div>Todo: drag and drop</div>
            </div>
        )
    }
}