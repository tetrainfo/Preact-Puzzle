import './style';
import Puzzle from './puzzle';
import { Component } from 'preact';

export default class App extends Component {

	state = { 
		display: 'hidden',
		displayNot: 'block'
	}



	render( {}, { display, displayNot } ) {
		return (
			<div>
				<Puzzle/>
					<p> See https://github.com/tetrainfo/Preact-Puzzle for source code</p>
			</div>
		);
	}
}
