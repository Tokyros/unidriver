import * as React from 'react';
import { EventsAppProps } from '../../../types';

export type EventsAppState = {
	keyboardEvents: React.KeyboardEvent[];
	mouseEvents: React.MouseEvent[];
}

const keyboardEventComp = (event: React.KeyboardEvent, idx: number) => {
	 // `whiteSpace: pre` is needed for tests that run in browsers + Space key
    return (
        <div key={idx} className='keyboard-event-data'>
            <span className='event-key' style={{whiteSpace: 'pre'}}>{event.key}</span>
            <span className='event-keycode'>{event.keyCode}</span>
        </div>
    );
};

const mouseEventComp = (event: React.MouseEvent, idx: number) => {
	return (
		<div key={idx} className='mouse-event-data'>
			<span className='event-type'>{event.type}</span>
		</div>
	)
}

export class EventsApp extends React.Component<EventsAppProps, EventsAppState> {

	state = {
		keyboardEvents: [],
		mouseEvents: []
	}

	onKeyboardEvent = (e: React.KeyboardEvent) => {
		const {keyboardEvents} = this.state;
		const eventObj = {...e, key: e.key, keyCode: e.keyCode};
		this.setState({keyboardEvents: [...keyboardEvents, eventObj]});
	}

	onMouseEvent = (e: React.MouseEvent) => {
		const {mouseEvents} = this.state;
		const eventObj = {...e, type: e.type, clientX: e.clientX, clientY: e.clientY};
		this.setState({mouseEvents: [...mouseEvents, eventObj]});
	}

	render () {
		const { state } = this;

		return (
			<div className='events-container'>
				<div className='mouse-events'>
					<button style={{height: 100, width: 100}} onMouseDown={this.onMouseEvent} onMouseUp={this.onMouseEvent} onMouseMove={this.onMouseEvent}>
						Mouse Events
					</button>
					<div>{state.mouseEvents.map(mouseEventComp)}</div>
				</div>
				<div className='keyboard-events'>
					<input onKeyDown={this.onKeyboardEvent} value='' />
					<div>{state.keyboardEvents.map(keyboardEventComp)}</div>
				</div>
			</div>
		);
	}
}
