import { jsdomReactUniDriver } from '.';
import { SetupFn, renderTestApp, runTestSuite } from '@unidriver/test-suite';
// import {KeyboardEventsAppSetupFn, TodoAppSetupFn} from '@unidriver/test-suite';
import * as sinon from 'sinon';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {assert} from 'chai';

const setup: SetupFn = async (params) => {
	const cleanJsdom = require('jsdom-global')();
	const div = document.createElement('div');
	document.body.appendChild(div);
	const cleanApp = renderTestApp(div, params);
	const driver = jsdomReactUniDriver(div);

	const tearDown = () => {
		cleanApp();
		cleanJsdom();
		return Promise.resolve();
	};

	return {driver, tearDown};
};

describe('react base driver - test suite', () => {
	runTestSuite({
		setup
	});
});

describe('react base driver specific tests', () => {
	const spy = sinon.spy;

	describe('click', () => {
		it('sends event data properly on simulated events when element is attached to body', async () => {
			const cleanJsdom = require('jsdom-global')();
			const s = spy();
			const elem = document.createElement('div');
			const btn = <button onClick={s}>bob</button>;
			ReactDOM.render(btn, elem);

			const driver = jsdomReactUniDriver(elem);

			await driver.$('button').click();
			cleanJsdom();

			assert.equal(s.lastCall.args[0].target.tagName, 'BUTTON');
		});

		it('sends event data properly on simulated events when element is attached to body', async () => {
			const cleanJsdom = require('jsdom-global')();
			const s = spy();
			const elem = document.createElement('div');
			document.body.appendChild(elem);
			const btn = <button onClick={s}>bob</button>;
			ReactDOM.render(btn, elem);

			const driver = jsdomReactUniDriver(elem);

			await driver.$('button').click();
			cleanJsdom();

			assert.equal(s.lastCall.args[0].target.tagName, 'BUTTON');
		});

		it('should trigger [mouseDown, mouseUp, click] in this order and with default main-button(0) when clicked', async () => {
			const cleanJsdom = require('jsdom-global')();
			const mouseDown = spy();
			const mouseUp = spy();
			const click = spy();
			const elem = document.createElement('div');
			const btn = (
				<button 
					onMouseDown={mouseDown} 
					onMouseUp={mouseUp} 
					onClick={click}>
					bob
				</button>
				);
			ReactDOM.render(btn, elem);
	
			const driver = jsdomReactUniDriver(elem);
	
			await driver.$('button').click();
			cleanJsdom();

			sinon.assert.callOrder(mouseDown,mouseUp,click);
			const DEFAULT_BUTTON_ID = '0'
			assert.equal(mouseDown.lastCall.args[0].button, DEFAULT_BUTTON_ID);
			assert.equal(mouseUp.lastCall.args[0].button, DEFAULT_BUTTON_ID);
			assert.equal(click.lastCall.args[0].button, DEFAULT_BUTTON_ID);
		});

		it('should trigger [focus] on click', async () => {
			const cleanJsdom = require('jsdom-global')();
			const focus = spy();
			const elem = document.createElement('div');
			const btn = (
				<button onFocus={focus}>
					bob
				</button>
				);
			ReactDOM.render(btn, elem);
	
			const driver = jsdomReactUniDriver(elem);
	
			await driver.$('button').click();
			cleanJsdom();

			assert(focus.calledOnce);
		});

		it('should trigger [focusA, blurA, focusB] when clicking two buttons', async () => {
			const cleanJsdom = require('jsdom-global')();
			const focusA = spy();
			const focusB = spy();
			const blurA = spy();
			const elem = document.createElement('div');
			const btn = (
				<div>
					<button id="A" onFocus={focusA} onBlur={blurA}>
						button A
					</button>
					<button id="B" onFocus={focusB}>
						button B
					</button>
				</div>
				);
			ReactDOM.render(btn, elem);
	
			const driver = jsdomReactUniDriver(elem);
	
			await driver.$('button#A').click();
			await driver.$('button#B').click();
			cleanJsdom();

			sinon.assert.callOrder(focusA, blurA, focusB);

			assert(focusA.calledOnce);
			assert(blurA.calledOnce);
			assert(focusB.calledOnce);
		});

		it('should trigger [focusA, blurA] when clicking enabled and disabled button', async () => {
			const cleanJsdom = require('jsdom-global')();
			const focusA = spy();
			const focusB = spy();
			const blurA = spy();
			const elem = document.createElement('div');
			const btn = (
				<div>
					<button id="A" onFocus={focusA} onBlur={blurA}>
						button A
					</button>
					<button id="B" onFocus={focusB} disabled>
						button B
					</button>
				</div>
				);
			ReactDOM.render(btn, elem);
	
			const driver = jsdomReactUniDriver(elem);
	
			await driver.$('button#A').click();
			await driver.$('button#B').click();
			cleanJsdom();

			sinon.assert.callOrder(focusA, blurA);

			assert(focusA.calledOnce);
			assert(blurA.calledOnce);
			assert(focusB.notCalled);
		});
	})
	
});
