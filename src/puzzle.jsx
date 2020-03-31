import { Component } from 'preact';
export default class Puzzle extends Component {

    state = { 
        items: [],
        itemStack:[],
        stats: {count: 0, points: 0 }
       }

    componentDidUpdate( ) {
       // console.log("ComponentDidUpdate triggers hide at 3 secconds")
       //setTimeout( this.hideLast2, 3000);
    }

    componentDidMount( ) {
        //data structure critical thinking question:
        //is this better solved as an array or as a linked list?
        //build the card collection
        const x0=-0;
        const y0=-20;
        let { items, itemStack } = this.state;
        let counter = 0;
        //let items = [];
        for (var i=0; i<= 4; i++){
            for (var j=0; j<=15; j++) {
                let item = {id: "id"+counter};
                counter++
                //item.class = "card picture"; 
                item.position ="background-position: " + (-j*49 + x0) + "px " + (-i*99 + y0) + "px";  
                items.push(item);  
            }
        }
        //shuffle the array and reassign the ids for access purposes to match the new array order
        //items = this.shuffle(items);
        for ( i = 0; i < items.length; i++ ) {
            items[i].id = i;
        }
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


    promote = id => {
        let { items, itemStack, stats } = this.state;
        console.log("id: " + id)

        //ignore this promotion if its rank is 0. Invalid
        if ( id < 1 ){
            //Invalid
            return
        }
        stats.count++;

        //swap with item in front
        var promoted = items[id];
        var demoted = items[id-1];
        //promoted.id = demoted.id;
        //demoted.id = promoted.id;
        items[id] = demoted;
        items[id-1] = promoted;


        this.setState({items, itemStack, stats});
    }

    //not used, re used for reset
    newGame = () => {
        let { items, itemStack } = this.state;
        items.map( item => {
            
        })
        itemStack = [];
        items = this.shuffle(items);
        //for (var i = 0; i < items.length; i++ ) {
        //    items[i].id = i;
        //}

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
                                <div style={item.position} class="card frame picture" id={item.id} onClick={ () => this.promote(idx) } > 
                                </div>
                            </div>
                        )) } 
                    </div> 
                </div>
                <div class="boxCover picture scaled"></div>
                <div>Todo: make puzzle piece border transparent when piece matches</div>
            </div>
        )
    }
}